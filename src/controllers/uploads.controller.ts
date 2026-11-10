import { createHash } from 'crypto';
import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { failure, readBody, success } from './http';

export class UploadsController {
  static async signUpload(request: NextRequest) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    const body = await readBody(request);
    const folder = typeof body.folder === 'string' ? body.folder : 'niet-pharmacy';
    if (!/^[\w/-]{1,100}$/.test(folder)) return failure('Invalid upload folder.', 400);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
      return failure('Cloudinary API credentials are not configured.', 500);
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const signature = createHash('sha1')
      .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
      .digest('hex');
    return success(
      {
        signature,
        timestamp,
        apiKey,
        cloudName,
        folder,
        uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      },
      'Upload signature generated successfully.'
    );
  }
}
