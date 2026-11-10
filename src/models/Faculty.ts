// NIET Pharmacy Backend - Faculty Mongoose Model
import mongoose, { Document, Model, Schema } from 'mongoose';
import { serializeMongoDocument } from '@/lib/mongodb';

export interface IFacultyPublicationCell {
  text: string;
  link?: string | null;
}

export interface IFacultyDocument extends Document {
  name: string;
  designation: string;
  qualification: string;
  department: string;
  departmentId?: mongoose.Types.ObjectId;
  photo?: string;
  email?: string;
  contactNo?: string;
  experience?: string;
  academicExperience?: string;
  industryExperience?: string;
  specialization?: string;
  researchInterest?: string;
  guided?: string;
  googleScholar?: string;
  website?: string;
  fdpAttended?: string;
  publicationsCount?: string;
  publicationsList: string[];
  awards: string[];
  grants: string[];
  affiliations: string[];
  reviewer: string[];
  publicationTable: IFacultyPublicationCell[][];
  isLeadership: boolean;
  leadershipRole?: 'director' | 'dean' | null;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const facultySchema = new Schema<IFacultyDocument>(
  {
    name: {
      type: String,
      required: [true, 'Faculty member name is required'],
      trim: true,
      index: true,
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true,
    },
    qualification: {
      type: String,
      required: [true, 'Qualification is required'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      index: true,
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
    },
    photo: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    contactNo: {
      type: String,
      trim: true,
    },
    experience: {
      type: String,
      trim: true,
    },
    academicExperience: {
      type: String,
      trim: true,
    },
    industryExperience: {
      type: String,
      trim: true,
    },
    specialization: {
      type: String,
      trim: true,
    },
    researchInterest: {
      type: String,
      trim: true,
    },
    guided: {
      type: String,
      trim: true,
    },
    googleScholar: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    fdpAttended: {
      type: String,
      trim: true,
    },
    publicationsCount: {
      type: String,
      trim: true,
    },
    publicationsList: {
      type: [String],
      default: [],
    },
    awards: {
      type: [String],
      default: [],
    },
    grants: {
      type: [String],
      default: [],
    },
    affiliations: {
      type: [String],
      default: [],
    },
    reviewer: {
      type: [String],
      default: [],
    },
    publicationTable: {
      type: Schema.Types.Mixed,
      default: [],
    },
    isLeadership: {
      type: Boolean,
      default: false,
      index: true,
    },
    leadershipRole: {
      type: String,
      enum: ['director', 'dean', null],
      default: null,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
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

// Composite text index for searching faculty by name, department, specialization
facultySchema.index({ name: 'text', department: 'text', specialization: 'text' });

export const FacultyModel: Model<IFacultyDocument> =
  mongoose.models.Faculty || mongoose.model<IFacultyDocument>('Faculty', facultySchema);
