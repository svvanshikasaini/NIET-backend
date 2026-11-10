// GET /api/courses/[id] - Fetch course details
// PUT /api/courses/[id] - Update course (Admin protected)
// DELETE /api/courses/[id] - Delete course (Admin protected)
import { CourseController } from '@/controllers/course.controller';
import { withErrorHandling } from '@/controllers/http';

export const dynamic = 'force-dynamic';

export const GET = withErrorHandling(CourseController.getCourseById);
export const PUT = withErrorHandling(CourseController.updateCourse);
export const DELETE = withErrorHandling(CourseController.deleteCourse);
