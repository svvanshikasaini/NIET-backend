// GET /api/committees - Fetch statutory committees
// POST /api/committees - Create committee (Admin protected)
import { CommitteeController } from '@/controllers/committee.controller';
import { withErrorHandling } from '@/controllers/http';

export const dynamic = 'force-dynamic';

export const GET = withErrorHandling(CommitteeController.getCommittees);
export const POST = withErrorHandling(CommitteeController.createCommittee);
