import { NextRequest } from 'next/server';
import { FacultyModel } from '@/models/Faculty';
import { requireAdmin } from '@/lib/auth';
import { escapeRegex, failure, paginated, pagination, pickModelFields, readBody, success } from './http';

export class FacultyController {
  static async getFacultyList(request: NextRequest) {
    const { page, limit, skip, search } = pagination(request, 20);
    const params = request.nextUrl.searchParams;
    const filter: Record<string, unknown> = {
      isPublished: params.has('isPublished') ? params.get('isPublished') === 'true' : true,
    };
    const department = params.get('department');
    if (department) filter.department = department;
    if (params.has('isLeadership')) filter.isLeadership = params.get('isLeadership') === 'true';
    if (search) {
      const regex = new RegExp(escapeRegex(search), 'i');
      filter.$or = [
        { name: regex },
        { department: regex },
        { designation: regex },
        { specialization: regex },
      ];
    }

    const [faculty, total] = await Promise.all([
      FacultyModel.find(filter).sort({ order: 1, name: 1 }).skip(skip).limit(limit),
      FacultyModel.countDocuments(filter),
    ]);
    return paginated(faculty, page, limit, total, 'Faculty members retrieved successfully.');
  }

  static async getFacultyById(_request: NextRequest, { params }: { params: { id: string } }) {
    const faculty = await FacultyModel.findById(params.id);
    if (!faculty) return failure('Faculty member profile not found.', 404);
    return success(faculty, 'Faculty details retrieved.');
  }

  static async createFaculty(request: NextRequest) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const faculty = await FacultyModel.create(await readBody(request));
    return success(faculty, 'Faculty member added successfully.', 201);
  }

  static async updateFaculty(request: NextRequest, { params }: { params: { id: string } }) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const faculty = await FacultyModel.findById(params.id);
    if (!faculty) return failure('Faculty member profile not found.', 404);
    faculty.set(pickModelFields(FacultyModel.schema, await readBody(request)));
    await faculty.save();
    return success(faculty, 'Faculty member profile updated successfully.');
  }

  static async deleteFaculty(request: NextRequest, { params }: { params: { id: string } }) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const faculty = await FacultyModel.findByIdAndDelete(params.id);
    if (!faculty) return failure('Faculty member profile not found.', 404);
    return success(null, 'Faculty member deleted successfully.');
  }
}
