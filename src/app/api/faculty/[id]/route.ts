// GET /api/faculty/[id] - Fetch single faculty profile
// PUT /api/faculty/[id] - Update faculty profile (Admin protected)
// DELETE /api/faculty/[id] - Delete faculty profile (Admin protected)
import { FacultyController } from '@/controllers/faculty.controller';
import { withErrorHandling } from '@/controllers/http';

export const dynamic = 'force-dynamic';

export const GET = withErrorHandling(FacultyController.getFacultyById);
export const PUT = withErrorHandling(FacultyController.updateFaculty);
export const DELETE = withErrorHandling(FacultyController.deleteFaculty);
