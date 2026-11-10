// GET /api/departments/[id] - Fetch department details
// PUT /api/departments/[id] - Update department (Admin protected)
// DELETE /api/departments/[id] - Delete department (Admin protected)
import { DepartmentController } from '@/controllers/department.controller';
import { withErrorHandling } from '@/controllers/http';

export const dynamic = 'force-dynamic';

export const GET = withErrorHandling(DepartmentController.getDepartmentById);
export const PUT = withErrorHandling(DepartmentController.updateDepartment);
export const DELETE = withErrorHandling(DepartmentController.deleteDepartment);
