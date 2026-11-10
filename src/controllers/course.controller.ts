import { NextRequest } from 'next/server';
import { CourseModel } from '@/models/Course';
import { requireAdmin } from '@/lib/auth';
import { failure, pickModelFields, readBody, success } from './http';

export class CourseController {
  static async getCourses(request: NextRequest) {
    const level = request.nextUrl.searchParams.get('level');
    const isPublished = request.nextUrl.searchParams.has('isPublished')
      ? request.nextUrl.searchParams.get('isPublished') === 'true'
      : true;
    const filter: Record<string, unknown> = { isPublished };
    if (level) filter.level = level;

    const courses = await CourseModel.find(filter).sort({ order: 1, name: 1 });
    return success(courses, 'Courses retrieved successfully.');
  }

  static async getCourseById(_request: NextRequest, { params }: { params: { id: string } }) {
    const course = await CourseModel.findById(params.id);
    if (!course) return failure('Course not found.', 404);
    return success(course, 'Course details retrieved.');
  }

  static async createCourse(request: NextRequest) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const body = await readBody(request);
    const course = await CourseModel.create(body);
    return success(course, 'Course added successfully.', 201);
  }

  static async updateCourse(request: NextRequest, { params }: { params: { id: string } }) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const body = await readBody(request);
    const course = await CourseModel.findById(params.id);
    if (!course) return failure('Course not found.', 404);
    course.set(pickModelFields(CourseModel.schema, body));
    await course.save();
    return success(course, 'Course updated successfully.');
  }

  static async deleteCourse(request: NextRequest, { params }: { params: { id: string } }) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const course = await CourseModel.findByIdAndDelete(params.id);
    if (!course) return failure('Course not found.', 404);
    return success(null, 'Course deleted successfully.');
  }
}
