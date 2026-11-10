import { NextRequest } from 'next/server';
import { WebsiteSettingsModel } from '@/models/WebsiteSettings';
import { requireAdmin } from '@/lib/auth';
import { failure, pickModelFields, readBody, success } from './http';

export class SettingsController {
  static async getSettings() {
    let settings = await WebsiteSettingsModel.findOne({ key: 'global_config' });
    if (!settings) settings = await WebsiteSettingsModel.create({ key: 'global_config' });
    return success(settings, 'Website settings retrieved successfully.');
  }

  static async updateSettings(request: NextRequest) {
    if (!(await requireAdmin(request))) return failure('Authentication required.', 401);
    let settings = await WebsiteSettingsModel.findOne({ key: 'global_config' });
    if (!settings) settings = new WebsiteSettingsModel({ key: 'global_config' });
    settings.set(pickModelFields(WebsiteSettingsModel.schema, await readBody(request)));
    await settings.save();
    return success(settings, 'Website settings updated successfully.');
  }
}
