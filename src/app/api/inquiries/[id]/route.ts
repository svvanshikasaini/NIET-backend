// PATCH /api/inquiries/[id] - Update inquiry status / notes (Admin protected)
// DELETE /api/inquiries/[id] - Delete inquiry (Admin protected)
import { InquiryController } from '@/controllers/inquiry.controller';
import { withErrorHandling } from '@/controllers/http';

export const dynamic = 'force-dynamic';

export const PATCH = withErrorHandling(InquiryController.updateInquiryStatus);
export const DELETE = withErrorHandling(InquiryController.deleteInquiry);
