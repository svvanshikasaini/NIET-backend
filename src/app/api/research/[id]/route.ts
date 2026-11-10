// GET /api/research/[id] - Fetch research record
// PUT /api/research/[id] - Update research record (Admin protected)
// DELETE /api/research/[id] - Delete research record (Admin protected)
import { ResearchController } from '@/controllers/research.controller';
import { withErrorHandling } from '@/controllers/http';

export const dynamic = 'force-dynamic';

export const GET = withErrorHandling(ResearchController.getResearchById);
export const PUT = withErrorHandling(ResearchController.updateResearch);
export const DELETE = withErrorHandling(ResearchController.deleteResearch);
