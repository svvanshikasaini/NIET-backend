// GET /api/gallery - Fetch photo gallery items
// POST /api/gallery - Add new gallery photo (Admin protected)
import { GalleryController } from '@/controllers/gallery.controller';
import { withErrorHandling } from '@/controllers/http';

export const dynamic = 'force-dynamic';

export const GET = withErrorHandling(GalleryController.getGallery);
export const POST = withErrorHandling(GalleryController.addGalleryItem);
