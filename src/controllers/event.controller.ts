import { NextRequest } from 'next/server';
import { EventModel } from '@/models/Event';
import { requireAdmin } from '@/lib/auth';
import { escapeRegex, failure, pagination, pickModelFields, readBody, success, paginated } from './http';

export class EventController {
  static async getEvents(request: NextRequest) {
    const { page, limit, skip, search } = pagination(request, 12);
    const params = request.nextUrl.searchParams;
    const filter: Record<string, unknown> = {
      isPublished: params.has('isPublished') ? params.get('isPublished') === 'true' : true,
    };
    const status = params.get('status');
    if (status) filter.status = status;
    if (search) {
      const regex = new RegExp(escapeRegex(search), 'i');
      filter.$or = [{ title: regex }, { description: regex }, { venue: regex }];
    }

    const [events, total] = await Promise.all([
      EventModel.find(filter).sort({ date: -1, order: 1 }).skip(skip).limit(limit),
      EventModel.countDocuments(filter),
    ]);
    return paginated(events, page, limit, total, 'Events retrieved successfully.');
  }

  static async getEventById(_request: NextRequest, { params }: { params: { id: string } }) {
    const event = await EventModel.findById(params.id);
    if (!event) return failure('Event not found.', 404);
    return success(event, 'Event details retrieved.');
  }

  static async createEvent(request: NextRequest) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const event = await EventModel.create(await readBody(request));
    return success(event, 'Event added successfully.', 201);
  }

  static async updateEvent(request: NextRequest, { params }: { params: { id: string } }) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const event = await EventModel.findById(params.id);
    if (!event) return failure('Event not found.', 404);
    event.set(pickModelFields(EventModel.schema, await readBody(request)));
    await event.save();
    return success(event, 'Event updated successfully.');
  }

  static async deleteEvent(request: NextRequest, { params }: { params: { id: string } }) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const event = await EventModel.findByIdAndDelete(params.id);
    if (!event) return failure('Event not found.', 404);
    return success(null, 'Event deleted successfully.');
  }
}
