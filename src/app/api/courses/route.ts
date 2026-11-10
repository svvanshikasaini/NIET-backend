// GET /api/courses - Fetch academic programs
// POST /api/courses - Create academic program (Admin protected)
import { CourseController } from '@/controllers/course.controller';
import { withErrorHandling } from '@/controllers/http';

export const dynamic = 'force-dynamic';

export const GET = withErrorHandling(CourseController.getCourses);
export const POST = withErrorHandling(CourseController.createCourse);
