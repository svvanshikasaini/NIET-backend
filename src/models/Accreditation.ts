// NIET Pharmacy Backend - Accreditation & Approval Mongoose Model
import mongoose, { Document, Model, Schema } from 'mongoose';
import { serializeMongoDocument } from '@/lib/mongodb';

type AccreditationBody = 'PCI' | 'NBA' | 'AICTE' | 'AKTU' | 'NIRF' | 'NAAC' | 'QS-IGAUGE';

export interface IAccreditationDocument extends Document {
  title: string;
  body: AccreditationBody;
  session?: string;
  category: string;
  pdfUrl: string;
  fileSize?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const accreditationSchema = new Schema<IAccreditationDocument>(
  {
    title: {
      type: String,
      required: [true, 'Accreditation/Approval title is required'],
      trim: true,
    },
    body: {
      type: String,
      enum: ['PCI', 'NBA', 'AICTE', 'AKTU', 'NIRF', 'NAAC', 'QS-IGAUGE'],
      required: [true, 'Regulatory body is required'],
      index: true,
    },
    session: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      default: 'Approval',
      trim: true,
      index: true,
    },
    pdfUrl: {
      type: String,
      required: [true, 'Document PDF URL is required'],
      trim: true,
    },
    fileSize: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    isActive: {
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

export const AccreditationModel: Model<IAccreditationDocument> =
  mongoose.models.Accreditation ||
  mongoose.model<IAccreditationDocument>('Accreditation', accreditationSchema);
