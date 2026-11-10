import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { AdminModel, type AdminDocument } from '@/models/Admin';
import { connectToDatabase } from './mongodb';

const ADMIN_COOKIE = 'niet_admin_token';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 characters.');
  }
  return secret;
}

export interface AuthenticatedAdmin {
  id: string;
  email: string;
  role: AdminDocument['role'];
}

type TokenPayload = jwt.JwtPayload & {
  id: string;
  email: string;
  role: AuthenticatedAdmin['role'];
};

export function createAdminToken(admin: AuthenticatedAdmin): string {
  return jwt.sign(admin, getJwtSecret(), {
    expiresIn: (process.env.JWT_EXPIRES_IN || '24h') as jwt.SignOptions['expiresIn'],
  });
}

export function setAdminCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: ADMIN_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60,
    path: '/',
  });
}

export function clearAdminCookie(response: NextResponse): void {
  response.cookies.set({
    name: ADMIN_COOKIE,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

export async function requireAdmin(request: NextRequest): Promise<AuthenticatedAdmin | null> {
  const token =
    request.cookies.get(ADMIN_COOKIE)?.value ??
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

  if (!token) {
    return null;
  }

  let payload: TokenPayload;
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    if (
      typeof decoded !== 'object' ||
      typeof decoded.id !== 'string' ||
      typeof decoded.email !== 'string' ||
      !['superadmin', 'admin', 'editor'].includes(String(decoded.role))
    ) {
      return null;
    }
    payload = decoded as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return null;
    }
    throw error;
  }

  await connectToDatabase();
  const admin = await AdminModel.findById(payload.id).select('email role isActive');
  if (!admin || !admin.isActive || admin.email !== payload.email) {
    return null;
  }

  return {
    id: admin.id,
    email: admin.email,
    role: admin.role,
  };
}
