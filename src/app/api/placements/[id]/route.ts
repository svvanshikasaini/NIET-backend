// GET /api/placements/[id] - Fetch placement record
// PUT /api/placements/[id] - Update placement record (Admin protected)
// DELETE /api/placements/[id] - Delete placement record (Admin protected)
import { PlacementController } from '@/controllers/placement.controller';
import { withErrorHandling } from '@/controllers/http';

export const dynamic = 'force-dynamic';

export const GET = withErrorHandling(PlacementController.getPlacementById);
export const PUT = withErrorHandling(PlacementController.updatePlacement);
export const DELETE = withErrorHandling(PlacementController.deletePlacement);
