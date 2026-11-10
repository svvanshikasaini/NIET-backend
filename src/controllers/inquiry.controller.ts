import { NextRequest } from 'next/server';
import { InquiryModel } from '@/models/Inquiry';
import { requireAdmin } from '@/lib/auth';
import {
  checkRateLimit,
  escapeRegex,
  failure,
  paginated,
  pagination,
  pickModelFields,
  readBody,
  success,
} from './http';

export class InquiryController {
  static async getInquiries(request: NextRequest) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const { page, limit, skip, search } = pagination(request);
    const filter: Record<string, unknown> = {};
    const status = request.nextUrl.searchParams.get('status');
    if (status) filter.status = status;
    if (search) {
      const regex = new RegExp(escapeRegex(search), 'i');
      filter.$or = [{ fname: regex }, { lname: regex }, { email: regex }, { phone: regex }];
    }
    const [inquiries, total] = await Promise.all([
      InquiryModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      InquiryModel.countDocuments(filter),
    ]);
    return paginated(inquiries, page, limit, total, 'Inquiries retrieved successfully.');
  }

  static async submitInquiry(request: NextRequest) {
    checkRateLimit(request, 'inquiry_submission', 60_000, 5);
    const inquiry = await InquiryModel.create(await readBody(request));
    return success(inquiry, 'Your inquiry has been submitted successfully.', 201);
  }

  static async updateInquiryStatus(request: NextRequest, { params }: { params: { id: string } }) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const inquiry = await InquiryModel.findById(params.id);
    if (!inquiry) return failure('Inquiry not found.', 404);
    inquiry.set(pickModelFields(InquiryModel.schema, await readBody(request)));
    await inquiry.save();
    return success(inquiry, 'Inquiry status updated successfully.');
  }

  static async deleteInquiry(request: NextRequest, { params }: { params: { id: string } }) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const inquiry = await InquiryModel.findByIdAndDelete(params.id);
    if (!inquiry) return failure('Inquiry not found.', 404);
    return success(null, 'Inquiry deleted successfully.');
  }
}
