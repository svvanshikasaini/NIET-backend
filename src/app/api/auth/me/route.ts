// GET /api/auth/me - Validate Session and Return Admin Profile
import { AuthController } from '@/controllers/auth.controller';
import { withErrorHandling } from '@/controllers/http';

export const dynamic = 'force-dynamic';

export const GET = withErrorHandling(AuthController.me);
