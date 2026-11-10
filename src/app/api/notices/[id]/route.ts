// GET /api/notices/[id] - Fetch notice details
// PUT /api/notices/[id] - Update notice (Admin protected)
// DELETE /api/notices/[id] - Delete notice (Admin protected)
import { NoticeController } from '@/controllers/notice.controller';
import { withErrorHandling } from '@/controllers/http';

export const dynamic = 'force-dynamic';

export const GET = withErrorHandling(NoticeController.getNoticeById);
export const PUT = withErrorHandling(NoticeController.updateNotice);
export const DELETE = withErrorHandling(NoticeController.deleteNotice);
