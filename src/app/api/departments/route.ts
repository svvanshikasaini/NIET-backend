// GET /api/departments - Fetch academic departments
// POST /api/departments - Create academic department (Admin protected)
import { DepartmentController } from '@/controllers/department.controller';
import { withErrorHandling } from '@/controllers/http';

export const dynamic = 'force-dynamic';

export const GET = withErrorHandling(DepartmentController.getDepartments);
export const POST = withErrorHandling(DepartmentController.createDepartment);
