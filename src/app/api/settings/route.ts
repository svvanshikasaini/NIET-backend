// GET /api/settings - Fetch global website configuration (Public)
// PUT /api/settings - Update website settings (Admin protected)
import { SettingsController } from '@/controllers/settings.controller';
import { withErrorHandling } from '@/controllers/http';

export const dynamic = 'force-dynamic';

export const GET = withErrorHandling(SettingsController.getSettings);
export const PUT = withErrorHandling(SettingsController.updateSettings);
