// GET /api/placements - Fetch placement statistics & student records
// POST /api/placements - Create placement record (Admin protected)
import { PlacementController } from '@/controllers/placement.controller';
import { withErrorHandling } from '@/controllers/http';

export const dynamic = 'force-dynamic';

export const GET = withErrorHandling(PlacementController.getPlacements);
export const POST = withErrorHandling(PlacementController.createPlacement);
