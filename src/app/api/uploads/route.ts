// POST /api/uploads - Cloudinary Upload Signature Generator (Admin protected)
import { UploadsController } from '@/controllers/uploads.controller';
import { withErrorHandling } from '@/controllers/http';

export const dynamic = 'force-dynamic';

export const POST = withErrorHandling(UploadsController.signUpload);
