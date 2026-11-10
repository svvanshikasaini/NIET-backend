// DELETE /api/gallery/[id] - Delete gallery photo (Admin protected)
import { GalleryController } from '@/controllers/gallery.controller';
import { withErrorHandling } from '@/controllers/http';

export const dynamic = 'force-dynamic';

export const DELETE = withErrorHandling(GalleryController.deleteGalleryItem);
