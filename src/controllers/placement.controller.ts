import { NextRequest } from 'next/server';
import { PlacementModel } from '@/models/Placement';
import { requireAdmin } from '@/lib/auth';
import { failure, pickModelFields, readBody, success } from './http';

export class PlacementController {
  static async getPlacements(request: NextRequest) {
    const params = request.nextUrl.searchParams;
    const filter: Record<string, unknown> = {};
    for (const field of ['type', 'program', 'academicYear']) {
      const value = params.get(field);
      if (value) filter[field] = value;
    }
    const placements = await PlacementModel.find(filter).sort({ order: 1, academicYear: -1 });
    return success(placements, 'Placement records retrieved successfully.');
  }

  static async getPlacementById(_request: NextRequest, { params }: { params: { id: string } }) {
    const placement = await PlacementModel.findById(params.id);
    if (!placement) return failure('Placement record not found.', 404);
    return success(placement, 'Placement record details retrieved.');
  }

  static async createPlacement(request: NextRequest) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const placement = await PlacementModel.create(await readBody(request));
    return success(placement, 'Placement record created successfully.', 201);
  }

  static async updatePlacement(request: NextRequest, { params }: { params: { id: string } }) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const placement = await PlacementModel.findById(params.id);
    if (!placement) return failure('Placement record not found.', 404);
    placement.set(pickModelFields(PlacementModel.schema, await readBody(request)));
    await placement.save();
    return success(placement, 'Placement record updated successfully.');
  }

  static async deletePlacement(request: NextRequest, { params }: { params: { id: string } }) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const placement = await PlacementModel.findByIdAndDelete(params.id);
    if (!placement) return failure('Placement record not found.', 404);
    return success(null, 'Placement record deleted successfully.');
  }
}
