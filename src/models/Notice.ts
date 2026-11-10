// NIET Pharmacy Backend - Notice Mongoose Model
import mongoose, { Document, Model, Schema } from 'mongoose';
import { serializeMongoDocument } from '@/lib/mongodb';

type NoticeCategory = 'Admissions' | 'Academic' | 'Examinations' | 'Events' | 'General';

export interface INoticeDocument extends Document {
  title: string;
  link?: string;
  pdfUrl?: string;
  category: NoticeCategory;
  isNewNotice: boolean;
  priority: number;
  active: boolean;
  publishDate: Date;
  expiryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const noticeSchema = new Schema<INoticeDocument>(
  {
    title: {
      type: String,
      required: [true, 'Notice title is required'],
      trim: true,
    },
    link: {
      type: String,
      trim: true,
    },
    pdfUrl: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Admissions', 'Academic', 'Examinations', 'Events', 'General'],
      default: 'General',
      index: true,
    },
    isNewNotice: {
      type: Boolean,
      default: true,
    },
    priority: {
      type: Number,
      default: 0,
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    publishDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    expiryDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: serializeMongoDocument,
    },
  }
);

export const NoticeModel: Model<INoticeDocument> =
  mongoose.models.Notice || mongoose.model<INoticeDocument>('Notice', noticeSchema);
