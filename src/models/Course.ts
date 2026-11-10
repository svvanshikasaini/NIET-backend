// NIET Pharmacy Backend - Course Mongoose Model
import mongoose, { Document, Model, Schema } from 'mongoose';
import { serializeMongoDocument } from '@/lib/mongodb';

type CourseLevel = 'Diploma' | 'Undergraduate' | 'Postgraduate';

export interface ICourseDocument extends Document {
  name: string;
  slug: string;
  level: CourseLevel;
  duration: string;
  intake: number;
  aktuCode?: string;
  eligibility: string;
  overview: string;
  merits: string[];
  highlights: string[];
  attendanceRule?: string;
  peos: string[];
  pos: { sNo: number; outcome: string }[];
  careerOptions: string[];
  syllabusPdfs: { title: string; url: string }[];
  feeStructure: { title: string; amount: string; notes?: string }[];
  isPublished: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourseDocument>(
  {
    name: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Course slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    level: {
      type: String,
      enum: ['Diploma', 'Undergraduate', 'Postgraduate'],
      required: [true, 'Course academic level is required'],
      index: true,
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true,
    },
    intake: {
      type: Number,
      required: [true, 'Intake is required'],
    },
    aktuCode: {
      type: String,
      trim: true,
    },
    eligibility: {
      type: String,
      required: [true, 'Eligibility criteria is required'],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, 'Overview is required'],
      trim: true,
    },
    merits: {
      type: [String],
      default: [],
    },
    highlights: {
      type: [String],
      default: [],
    },
    attendanceRule: {
      type: String,
      trim: true,
    },
    peos: {
      type: [String],
      default: [],
    },
    pos: [
      {
        sNo: { type: Number, required: true },
        outcome: { type: String, required: true },
      },
    ],
    careerOptions: {
      type: [String],
      default: [],
    },
    syllabusPdfs: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    feeStructure: [
      {
        title: { type: String, required: true },
        amount: { type: String, required: true },
        notes: { type: String },
      },
    ],
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

export const CourseModel: Model<ICourseDocument> =
  mongoose.models.Course || mongoose.model<ICourseDocument>('Course', courseSchema);
