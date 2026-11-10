import { NextRequest, NextResponse } from 'next/server';
import mongoose, { Schema } from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';

export interface RouteContext {
  params: { id: string };
}

export class HttpError extends Error {
  constructor(
    message: string,
    readonly statusCode: number
  ) {
    super(message);
  }
}

type RequestHandler = (request: NextRequest) => Promise<Response>;
type ItemHandler = (request: NextRequest, context: RouteContext) => Promise<Response>;

export function withErrorHandling(handler: RequestHandler): RequestHandler;
export function withErrorHandling(handler: ItemHandler): ItemHandler;
export function withErrorHandling(
  handler: RequestHandler | ItemHandler
): RequestHandler | ItemHandler {
  return async (request: NextRequest, context?: RouteContext) => {
    try {
      await connectToDatabase();
      return context
        ? await (handler as ItemHandler)(request, context)
        : await (handler as RequestHandler)(request);
    } catch (error) {
      return errorResponse(error);
    }
  };
}

export function success(data: unknown, message: string, status = 200): NextResponse {
  return NextResponse.json(
    { success: true, message, data, timestamp: new Date().toISOString() },
    { status }
  );
}

export function paginated(
  data: unknown[],
  page: number,
  limit: number,
  total: number,
  message: string
): NextResponse {
  const totalPages = Math.ceil(total / limit) || 1;
  return NextResponse.json({
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    timestamp: new Date().toISOString(),
  });
}

export function failure(message: string, status: number): NextResponse {
  return NextResponse.json(
    { success: false, error: message, timestamp: new Date().toISOString() },
    { status }
  );
}

export async function readBody(request: NextRequest): Promise<Record<string, unknown>> {
  let value: unknown;
  try {
    value = await request.json();
  } catch {
    throw new HttpError('Request body must be valid JSON.', 400);
  }

  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new HttpError('Request body must be a JSON object.', 400);
  }
  return value as Record<string, unknown>;
}

export function pickModelFields(
  schema: Schema,
  values: Record<string, unknown>
): Record<string, unknown> {
  const allowedFields = new Set(
    Object.keys(schema.paths).filter(
      (field) => !['_id', '__v', 'createdAt', 'updatedAt'].includes(field)
    )
  );
  return Object.fromEntries(
    Object.entries(values).filter(([field]) => allowedFields.has(field))
  );
}

export function pagination(request: NextRequest, defaultLimit = 10) {
  const params = request.nextUrl.searchParams;
  const parsePositiveInt = (value: string | null, fallback: number) => {
    const parsed = Number.parseInt(value ?? '', 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  };
  const page = parsePositiveInt(params.get('page'), 1);
  const limit = Math.min(parsePositiveInt(params.get('limit'), defaultLimit), 100);
  return { page, limit, skip: (page - 1) * limit, search: params.get('search')?.trim() ?? '' };
}

export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const rateLimits = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  request: NextRequest,
  prefix: string,
  windowMs: number,
  maxRequests: number
): void {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';
  const key = `${prefix}:${ip}`;
  const now = Date.now();
  const record = rateLimits.get(key);

  if (!record || record.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  if (record.count >= maxRequests) {
    throw new HttpError('Too many requests. Please try again later.', 429);
  }
  record.count += 1;
}

function errorResponse(error: unknown): NextResponse {
  if (error instanceof HttpError) {
    return failure(error.message, error.statusCode);
  }
  if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
    return failure(error.message, 400);
  }
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 11000
  ) {
    return failure('A record with these values already exists.', 409);
  }

  console.error('API request failed:', error);
  const message =
    process.env.NODE_ENV === 'production'
      ? 'An unexpected server error occurred.'
      : error instanceof Error
        ? error.message
        : String(error);
  return failure(message, 500);
}
