import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { serializeMongoDocument } from '@/lib/mongodb';

export interface AdminDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: 'superadmin' | 'admin' | 'editor';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const adminSchema = new Schema<AdminDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['superadmin', 'admin', 'editor'], default: 'admin' },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { transform: serializeMongoDocument },
  }
);

adminSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

adminSchema.methods.comparePassword = function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const AdminModel =
  mongoose.models.Admin || mongoose.model<AdminDocument>('Admin', adminSchema);
