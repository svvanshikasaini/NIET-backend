// GET /api/dashboard - Dashboard Analytics & Overview Metrics
import { DashboardController } from '@/controllers/dashboard.controller';
import { withErrorHandling } from '@/controllers/http';

export const dynamic = 'force-dynamic';

export const GET = withErrorHandling(DashboardController.getMetrics);
