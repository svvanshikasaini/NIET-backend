// POST /api/auth/login - Admin Login Endpoint
import { AuthController } from '@/controllers/auth.controller';
import { withErrorHandling } from '@/controllers/http';

export const dynamic = 'force-dynamic';

export const POST = withErrorHandling(AuthController.login);
