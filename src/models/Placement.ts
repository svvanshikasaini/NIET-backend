// NIET Pharmacy Backend - Placement Mongoose Model
import mongoose, { Document, Model, Schema } from 'mongoose';
import { serializeMongoDocument } from '@/lib/mongodb';

type PlacementRecordType = 'statistic' | 'student_record' | 'team_member' | 'recruiter';

export interface IPlacementDocument extends Document {
  type: PlacementRecordType;
  program?: string;
  academicYear?: string;
  intake?: number;
  studentsPlaced?: number;
  highestPackage?: string;
  avgPackage?: string;
  studentName?: string;
  rollNo?: string;
  company?: string;
  package?: string;
  memberName?: string;
  designation?: string;
  email?: string;
  phone?: string;
  recruiterName?: string;
  recruiterLogo?: string;
  isPublished: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const placementSchema = new Schema<IPlacementDocument>(
  {
    type: {
      type: String,
      enum: ['statistic', 'student_record', 'team_member', 'recruiter'],
      required: [true, 'Placement record type is required'],
      index: true,
    },
    program: {
      type: String,
      trim: true,
      index: true,
    },
    academicYear: {
      type: String,
      trim: true,
      index: true,
    },
    intake: {
      type: Number,
    },
    studentsPlaced: {
      type: Number,
    },
    highestPackage: {
      type: String,
      trim: true,
    },
    avgPackage: {
      type: String,
      trim: true,
    },
    studentName: {
      type: String,
      trim: true,
    },
    rollNo: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    package: {
      type: String,
      trim: true,
    },
    memberName: {
      type: String,
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    recruiterName: {
      type: String,
      trim: true,
    },
    recruiterLogo: {
      type: String,
      trim: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: serializeMongoDocument,
    },
  }
);

export const PlacementModel: Model<IPlacementDocument> =
  mongoose.models.Placement || mongoose.model<IPlacementDocument>('Placement', placementSchema);
