import { loadEnvConfig } from '@next/env';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

loadEnvConfig(process.cwd());

const { MONGODB_URI, MONGODB_DB_NAME, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!MONGODB_URI || !MONGODB_DB_NAME) {
  throw new Error('Set MONGODB_URI and MONGODB_DB_NAME before creating an admin.');
}
if (!ADMIN_NAME?.trim() || !ADMIN_EMAIL?.trim() || !ADMIN_PASSWORD) {
  throw new Error('Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD for this command.');
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ADMIN_EMAIL)) {
  throw new Error('ADMIN_EMAIL must be a valid email address.');
}
if (ADMIN_PASSWORD.length < 12) {
  throw new Error('ADMIN_PASSWORD must be at least 12 characters long.');
}

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['superadmin', 'admin', 'editor'], default: 'admin' },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

try {
  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
  await Admin.init();

  const email = ADMIN_EMAIL.trim().toLowerCase();
  if (await Admin.exists({ email })) {
    throw new Error(`An admin account already exists for ${email}.`);
  }

  await Admin.create({
    name: ADMIN_NAME.trim(),
    email,
    password: await bcrypt.hash(ADMIN_PASSWORD, 12),
    role: 'superadmin',
  });

  console.log(`Admin account created for ${email}.`);
} catch (error) {
  console.error('Could not create admin account:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
