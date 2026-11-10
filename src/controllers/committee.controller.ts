import { NextRequest } from 'next/server';
import { CommitteeModel } from '@/models/Committee';
import { requireAdmin } from '@/lib/auth';
import { failure, pickModelFields, readBody, success } from './http';

export class CommitteeController {
  static async getCommittees(request: NextRequest) {
    const onlyActive = request.nextUrl.searchParams.get('onlyActive') !== 'false';
    const committees = await CommitteeModel.find(onlyActive ? { isActive: true } : {}).sort({
      order: 1,
      name: 1,
    });
    return success(committees, 'Committees retrieved successfully.');
  }

  static async getCommitteeById(_request: NextRequest, { params }: { params: { id: string } }) {
    const committee = await CommitteeModel.findById(params.id);
    if (!committee) return failure('Committee not found.', 404);
    return success(committee, 'Committee details retrieved.');
  }

  static async createCommittee(request: NextRequest) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const committee = await CommitteeModel.create(await readBody(request));
    return success(committee, 'Committee created successfully.', 201);
  }

  static async updateCommittee(request: NextRequest, { params }: { params: { id: string } }) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const committee = await CommitteeModel.findById(params.id);
    if (!committee) return failure('Committee not found.', 404);
    committee.set(pickModelFields(CommitteeModel.schema, await readBody(request)));
    await committee.save();
    return success(committee, 'Committee updated successfully.');
  }

  static async deleteCommittee(request: NextRequest, { params }: { params: { id: string } }) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const committee = await CommitteeModel.findByIdAndDelete(params.id);
    if (!committee) return failure('Committee not found.', 404);
    return success(null, 'Committee deleted successfully.');
  }
}
