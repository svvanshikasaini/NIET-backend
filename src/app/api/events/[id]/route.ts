// GET /api/events/[id] - Fetch single event
// PUT /api/events/[id] - Update event (Admin protected)
// DELETE /api/events/[id] - Delete event (Admin protected)
import { EventController } from '@/controllers/event.controller';
import { withErrorHandling } from '@/controllers/http';

export const dynamic = 'force-dynamic';

export const GET = withErrorHandling(EventController.getEventById);
export const PUT = withErrorHandling(EventController.updateEvent);
export const DELETE = withErrorHandling(EventController.deleteEvent);
