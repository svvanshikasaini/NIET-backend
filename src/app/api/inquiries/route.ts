// GET /api/inquiries - List contact inquiries (Admin protected)
// POST /api/inquiries - Submit contact inquiry (Public with rate-limit)
import { InquiryController } from '@/controllers/inquiry.controller';
import { withErrorHandling } from '@/controllers/http';

export const dynamic = 'force-dynamic';

export const GET = withErrorHandling(InquiryController.getInquiries);
export const POST = withErrorHandling(InquiryController.submitInquiry);
