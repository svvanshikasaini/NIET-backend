import { NextRequest } from 'next/server';
import { AccreditationModel } from '@/models/Accreditation';
import { requireAdmin } from '@/lib/auth';
import { failure, pickModelFields, readBody, success } from './http';

export class AccreditationController {
  static async getAccreditations(request: NextRequest) {
    const params = request.nextUrl.searchParams;
    const filter: Record<string, unknown> = {
      isActive: params.has('isActive') ? params.get('isActive') === 'true' : true,
    };
    const body = params.get('body');
    if (body) filter.body = body;
    const records = await AccreditationModel.find(filter).sort({ order: 1, createdAt: -1 });
    return success(records, 'Accreditations/Approvals retrieved successfully.');
  }

  static async getAccreditationById(_request: NextRequest, { params }: { params: { id: string } }) {
    const record = await AccreditationModel.findById(params.id);
    if (!record) return failure('Accreditation/Approval record not found.', 404);
    return success(record, 'Accreditation details retrieved.');
  }

  static async createAccreditation(request: NextRequest) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const record = await AccreditationModel.create(await readBody(request));
    return success(record, 'Accreditation/Approval added successfully.', 201);
  }

  static async updateAccreditation(request: NextRequest, { params }: { params: { id: string } }) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const record = await AccreditationModel.findById(params.id);
    if (!record) return failure('Accreditation/Approval record not found.', 404);
    record.set(pickModelFields(AccreditationModel.schema, await readBody(request)));
    await record.save();
    return success(record, 'Accreditation/Approval updated successfully.');
  }

  static async deleteAccreditation(request: NextRequest, { params }: { params: { id: string } }) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const record = await AccreditationModel.findByIdAndDelete(params.id);
    if (!record) return failure('Accreditation/Approval record not found.', 404);
    return success(null, 'Accreditation/Approval deleted successfully.');
  }
}
