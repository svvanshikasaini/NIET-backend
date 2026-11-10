// GET /api/research - Fetch research publications & projects
// POST /api/research - Create research record (Admin protected)
import { ResearchController } from '@/controllers/research.controller';
import { withErrorHandling } from '@/controllers/http';

export const dynamic = 'force-dynamic';

export const GET = withErrorHandling(ResearchController.getResearchList);
export const POST = withErrorHandling(ResearchController.createResearch);
