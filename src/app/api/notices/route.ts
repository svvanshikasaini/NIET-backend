// GET /api/notices - Fetch active notices (Public)
// POST /api/notices - Create new notice (Admin protected)
import { NoticeController } from '@/controllers/notice.controller';
import { withErrorHandling } from '@/controllers/http';

export const dynamic = 'force-dynamic';

export const GET = withErrorHandling(NoticeController.getNotices);
export const POST = withErrorHandling(NoticeController.createNotice);
