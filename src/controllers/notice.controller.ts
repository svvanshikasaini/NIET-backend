import { NextRequest } from 'next/server';
import { NoticeModel } from '@/models/Notice';
import { requireAdmin } from '@/lib/auth';
import { escapeRegex, failure, paginated, pagination, pickModelFields, readBody, success } from './http';

export class NoticeController {
  static async getNotices(request: NextRequest) {
    const { page, limit, skip, search } = pagination(request);
    const params = request.nextUrl.searchParams;
    const filter: Record<string, unknown> = {
      active: params.has('active') ? params.get('active') === 'true' : true,
    };
    const category = params.get('category');
    if (category) filter.category = category;
    if (search) filter.title = { $regex: escapeRegex(search), $options: 'i' };

    const [notices, total] = await Promise.all([
      NoticeModel.find(filter).sort({ priority: 1, publishDate: -1 }).skip(skip).limit(limit),
      NoticeModel.countDocuments(filter),
    ]);
    return paginated(notices, page, limit, total, 'Notices retrieved successfully.');
  }

  static async getNoticeById(_request: NextRequest, { params }: { params: { id: string } }) {
    const notice = await NoticeModel.findById(params.id);
    if (!notice) return failure('Notice not found.', 404);
    return success(notice, 'Notice details retrieved.');
  }

  static async createNotice(request: NextRequest) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const notice = await NoticeModel.create(await readBody(request));
    return success(notice, 'Notice created successfully.', 201);
  }

  static async updateNotice(request: NextRequest, { params }: { params: { id: string } }) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const notice = await NoticeModel.findById(params.id);
    if (!notice) return failure('Notice not found.', 404);
    notice.set(pickModelFields(NoticeModel.schema, await readBody(request)));
    await notice.save();
    return success(notice, 'Notice updated successfully.');
  }

  static async deleteNotice(request: NextRequest, { params }: { params: { id: string } }) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const notice = await NoticeModel.findByIdAndDelete(params.id);
    if (!notice) return failure('Notice not found.', 404);
    return success(null, 'Notice deleted successfully.');
  }
}
