// NIET Pharmacy Backend - Research Mongoose Model
import mongoose, { Document, Model, Schema } from 'mongoose';
import { serializeMongoDocument } from '@/lib/mongodb';

type ResearchCategory = 'Approvals' | 'Grants' | 'Doctoral' | 'Thrust Areas' | 'Publications' | 'Patents';

export interface IResearchDocument extends Document {
  title: string;
  category: ResearchCategory;
  description?: string;
  pdfUrl?: string;
  academicYear?: string;
  facultyId?: mongoose.Types.ObjectId;
  facultyName?: string;
  externalLink?: string;
  isPublished: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const researchSchema = new Schema<IResearchDocument>(
  {
    title: {
      type: String,
      required: [true, 'Research title is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Approvals', 'Grants', 'Doctoral', 'Thrust Areas', 'Publications', 'Patents'],
      required: [true, 'Research category is required'],
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    pdfUrl: {
      type: String,
      trim: true,
    },
    academicYear: {
      type: String,
      trim: true,
      index: true,
    },
    facultyId: {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
    },
    facultyName: {
      type: String,
      trim: true,
    },
    externalLink: {
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

export const ResearchModel: Model<IResearchDocument> =
  mongoose.models.Research || mongoose.model<IResearchDocument>('Research', researchSchema);
