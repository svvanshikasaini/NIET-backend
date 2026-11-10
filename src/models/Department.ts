// NIET Pharmacy Backend - Department Mongoose Model
import mongoose, { Document, Model, Schema } from 'mongoose';
import { serializeMongoDocument } from '@/lib/mongodb';

export interface IDepartmentDocument extends Document {
  name: string;
  code: string;
  description?: string;
  hodName?: string;
  hodId?: mongoose.Types.ObjectId;
  image?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const departmentSchema = new Schema<IDepartmentDocument>(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Department code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    hodName: {
      type: String,
      trim: true,
    },
    hodId: {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
    },
    image: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: serializeMongoDocument,
    },
  }
);

export const DepartmentModel: Model<IDepartmentDocument> =
  mongoose.models.Department || mongoose.model<IDepartmentDocument>('Department', departmentSchema);
