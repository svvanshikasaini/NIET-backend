import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { CourseModel } from '@/models/Course';
import { EventModel } from '@/models/Event';
import { FacultyModel } from '@/models/Faculty';
import { InquiryModel } from '@/models/Inquiry';
import { NoticeModel } from '@/models/Notice';
import { PlacementModel } from '@/models/Placement';
import { failure, success } from './http';

export class DashboardController {
  static async getMetrics(request: NextRequest) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);

    const [
      faculty,
      courses,
      events,
      notices,
      inquiries,
      pending,
      resolved,
      placements,
      recentInquiries,
      recentNotices,
      recentEvents,
    ] = await Promise.all([
      FacultyModel.countDocuments({ isPublished: true }),
      CourseModel.countDocuments({ isPublished: true }),
      EventModel.countDocuments({ isPublished: true }),
      NoticeModel.countDocuments({ active: true }),
      InquiryModel.countDocuments(),
      InquiryModel.countDocuments({ status: 'pending' }),
      InquiryModel.countDocuments({ status: 'resolved' }),
      PlacementModel.countDocuments({ isPublished: true }),
      InquiryModel.find().sort({ createdAt: -1 }).limit(5),
      NoticeModel.find({ active: true }).sort({ priority: 1, publishDate: -1 }).limit(5),
      EventModel.find({ isPublished: true }).sort({ date: -1 }).limit(4),
    ]);

    return success(
      {
        counts: {
          faculty,
          courses,
          events,
          notices,
          inquiries: { total: inquiries, pending, resolved },
          placements,
        },
        recentInquiries,
        recentNotices,
        recentEvents,
      },
      'Dashboard metrics and overview retrieved successfully.'
    );
  }
}
