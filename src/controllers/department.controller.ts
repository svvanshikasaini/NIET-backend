import { NextRequest } from 'next/server';
import { DepartmentModel } from '@/models/Department';
import { requireAdmin } from '@/lib/auth';
import { failure, pickModelFields, readBody, success } from './http';

export class DepartmentController {
  static async getDepartments(request: NextRequest) {
    const onlyActive = request.nextUrl.searchParams.get('onlyActive') !== 'false';
    const departments = await DepartmentModel.find(onlyActive ? { isActive: true } : {}).sort({
      order: 1,
      name: 1,
    });
    return success(departments, 'Departments retrieved successfully.');
  }

  static async getDepartmentById(_request: NextRequest, { params }: { params: { id: string } }) {
    const department = await DepartmentModel.findById(params.id);
    if (!department) return failure('Department not found.', 404);
    return success(department, 'Department details retrieved.');
  }

  static async createDepartment(request: NextRequest) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const body = await readBody(request);
    const name = typeof body.name === 'string' ? body.name : '';
    const code = typeof body.code === 'string' ? body.code.toUpperCase() : '';
    if (await DepartmentModel.exists({ $or: [{ code }, { name }] })) {
      return failure('A department with this name or code already exists.', 409);
    }
    const department = await DepartmentModel.create(body);
    return success(department, 'Department created successfully.', 201);
  }

  static async updateDepartment(request: NextRequest, { params }: { params: { id: string } }) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const department = await DepartmentModel.findById(params.id);
    if (!department) return failure('Department not found.', 404);
    department.set(pickModelFields(DepartmentModel.schema, await readBody(request)));
    await department.save();
    return success(department, 'Department updated successfully.');
  }

  static async deleteDepartment(request: NextRequest, { params }: { params: { id: string } }) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const department = await DepartmentModel.findByIdAndDelete(params.id);
    if (!department) return failure('Department not found.', 404);
    return success(null, 'Department deleted successfully.');
  }
}
