import { NextRequest } from 'next/server';
import { ResearchModel } from '@/models/Research';
import { requireAdmin } from '@/lib/auth';
import { failure, pickModelFields, readBody, success } from './http';

export class ResearchController {
  static async getResearchList(request: NextRequest) {
    const params = request.nextUrl.searchParams;
    const filter: Record<string, unknown> = {
      isPublished: params.has('isPublished') ? params.get('isPublished') === 'true' : true,
    };
    const category = params.get('category');
    if (category) filter.category = category;
    const records = await ResearchModel.find(filter).sort({ order: 1, createdAt: -1 });
    return success(records, 'Research records retrieved successfully.');
  }

  static async getResearchById(_request: NextRequest, { params }: { params: { id: string } }) {
    const research = await ResearchModel.findById(params.id);
    if (!research) return failure('Research record not found.', 404);
    return success(research, 'Research details retrieved.');
  }

  static async createResearch(request: NextRequest) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const research = await ResearchModel.create(await readBody(request));
    return success(research, 'Research project/publication created successfully.', 201);
  }

  static async updateResearch(request: NextRequest, { params }: { params: { id: string } }) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const research = await ResearchModel.findById(params.id);
    if (!research) return failure('Research record not found.', 404);
    research.set(pickModelFields(ResearchModel.schema, await readBody(request)));
    await research.save();
    return success(research, 'Research record updated successfully.');
  }

  static async deleteResearch(request: NextRequest, { params }: { params: { id: string } }) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const research = await ResearchModel.findByIdAndDelete(params.id);
    if (!research) return failure('Research record not found.', 404);
    return success(null, 'Research record deleted successfully.');
  }
}
