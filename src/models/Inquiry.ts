// NIET Pharmacy Backend - Contact Inquiry Mongoose Model
import mongoose, { Document, Model, Schema } from 'mongoose';
import { serializeMongoDocument } from '@/lib/mongodb';

type InquiryStatus = 'pending' | 'contacted' | 'resolved' | 'archived';

export interface IInquiryDocument extends Document {
  fname: string;
  lname: string;
  email: string;
  phone: string;
  city: string;
  subject?: string;
  message?: string;
  status: InquiryStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const inquirySchema = new Schema<IInquiryDocument>(
  {
    fname: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lname: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    subject: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'resolved', 'archived'],
      default: 'pending',
      index: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: serializeMongoDocument,
    },
  }
);

export const InquiryModel: Model<IInquiryDocument> =
  mongoose.models.Inquiry || mongoose.model<IInquiryDocument>('Inquiry', inquirySchema);
