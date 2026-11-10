// GET /api/accreditations/[id] - Fetch accreditation record
// PUT /api/accreditations/[id] - Update accreditation (Admin protected)
// DELETE /api/accreditations/[id] - Delete accreditation (Admin protected)
import { AccreditationController } from '@/controllers/accreditation.controller';
import { withErrorHandling } from '@/controllers/http';

export const dynamic = 'force-dynamic';

export const GET = withErrorHandling(AccreditationController.getAccreditationById);
export const PUT = withErrorHandling(AccreditationController.updateAccreditation);
export const DELETE = withErrorHandling(AccreditationController.deleteAccreditation);
