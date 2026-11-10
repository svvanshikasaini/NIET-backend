import { NextRequest } from 'next/server';
import { GalleryModel } from '@/models/Gallery';
import { requireAdmin } from '@/lib/auth';
import { failure, readBody, success } from './http';

export class GalleryController {
  static async getGallery(request: NextRequest) {
    const params = request.nextUrl.searchParams;
    const filter: Record<string, unknown> = {
      isPublished: params.has('isPublished') ? params.get('isPublished') === 'true' : true,
    };
    const category = params.get('category');
    if (category) filter.category = category;
    const gallery = await GalleryModel.find(filter).sort({ order: 1, createdAt: -1 });
    return success(gallery, 'Gallery photos retrieved successfully.');
  }

  static async addGalleryItem(request: NextRequest) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const item = await GalleryModel.create(await readBody(request));
    return success(item, 'Photo added to gallery successfully.', 201);
  }

  static async deleteGalleryItem(request: NextRequest, { params }: { params: { id: string } }) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const item = await GalleryModel.findByIdAndDelete(params.id);
    if (!item) return failure('Gallery item not found.', 404);
    return success(null, 'Gallery photo deleted successfully.');
  }
}
