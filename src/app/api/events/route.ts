// GET /api/events - Fetch events with status & search filters
// POST /api/events - Create new event (Admin protected)
import { EventController } from '@/controllers/event.controller';
import { withErrorHandling } from '@/controllers/http';

export const dynamic = 'force-dynamic';

export const GET = withErrorHandling(EventController.getEvents);
export const POST = withErrorHandling(EventController.createEvent);
