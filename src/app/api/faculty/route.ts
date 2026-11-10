// GET /api/faculty - Fetch faculty list with pagination, search, department filter
// POST /api/faculty - Create new faculty profile (Admin protected)
import { FacultyController } from '@/controllers/faculty.controller';
import { withErrorHandling } from '@/controllers/http';

export const dynamic = 'force-dynamic';

export const GET = withErrorHandling(FacultyController.getFacultyList);
export const POST = withErrorHandling(FacultyController.createFaculty);
