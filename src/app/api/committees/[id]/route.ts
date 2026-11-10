// GET /api/committees/[id] - Fetch committee details
// PUT /api/committees/[id] - Update committee (Admin protected)
// DELETE /api/committees/[id] - Delete committee (Admin protected)
import { CommitteeController } from '@/controllers/committee.controller';
import { withErrorHandling } from '@/controllers/http';

export const dynamic = 'force-dynamic';

export const GET = withErrorHandling(CommitteeController.getCommitteeById);
export const PUT = withErrorHandling(CommitteeController.updateCommittee);
export const DELETE = withErrorHandling(CommitteeController.deleteCommittee);
