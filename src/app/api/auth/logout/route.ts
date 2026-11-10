// POST /api/auth/logout - Admin Logout Endpoint
import { AuthController } from '@/controllers/auth.controller';
import { withErrorHandling } from '@/controllers/http';

export const dynamic = 'force-dynamic';

export const POST = withErrorHandling(AuthController.logout);
