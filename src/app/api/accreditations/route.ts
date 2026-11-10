// GET /api/accreditations - Fetch accreditations and approvals
// POST /api/accreditations - Create accreditation/approval document (Admin protected)
import { AccreditationController } from '@/controllers/accreditation.controller';
import { withErrorHandling } from '@/controllers/http';

export const dynamic = 'force-dynamic';

export const GET = withErrorHandling(AccreditationController.getAccreditations);
export const POST = withErrorHandling(AccreditationController.createAccreditation);
