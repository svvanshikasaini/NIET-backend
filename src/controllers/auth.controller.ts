import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { AdminModel } from '@/models/Admin';
import {
  clearAdminCookie,
  createAdminToken,
  requireAdmin,
  setAdminCookie,
} from '@/lib/auth';
import { checkRateLimit, failure, readBody, success } from './http';

export class AuthController {
  static async login(request: NextRequest) {
    checkRateLimit(request, 'auth_login', 15 * 60_000, 10);
    const body = await readBody(request);
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 6) {
      return failure('Enter a valid email address and password.', 400);
    }

    const admin = await AdminModel.findOne({ email }).select('+password');
    if (!admin || !admin.isActive || !(await bcrypt.compare(password, admin.password))) {
      return failure('Invalid email or password credentials.', 401);
    }

    admin.lastLogin = new Date();
    await admin.save();

    const safeAdmin = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive,
      lastLogin: admin.lastLogin,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };
    const token = createAdminToken({ id: admin.id, email, role: admin.role });
    const response = success({ admin: safeAdmin, token }, 'Login successful. Welcome back!');
    setAdminCookie(response, token);
    return response;
  }

  static async logout() {
    const response = success(null, 'Successfully logged out.');
    clearAdminCookie(response);
    return response;
  }

  static async me(request: NextRequest) {
    const currentAdmin = await requireAdmin(request);
    if (!currentAdmin) return failure('Authentication required.', 401);
    const admin = await AdminModel.findById(currentAdmin.id);
    if (!admin) return failure('Admin profile not found.', 404);
    return success(
      {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
      'Current admin profile retrieved.'
    );
  }
}
