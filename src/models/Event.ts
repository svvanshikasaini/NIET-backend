// NIET Pharmacy Backend - Event Mongoose Model
import mongoose, { Document, Model, Schema } from 'mongoose';
import { serializeMongoDocument } from '@/lib/mongodb';

type EventStatus = 'Upcoming' | 'Completed';

export interface IEventDocument extends Document {
  title: string;
  slug: string;
  description?: string;
  date?: Date;
  venue?: string;
  status: EventStatus;
  coverImage: string;
  images: string[];
  isPublished: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEventDocument>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Event slug is required'],
      unique: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      index: true,
    },
    venue: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Completed'],
      default: 'Completed',
      index: true,
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image URL is required'],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
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

export const EventModel: Model<IEventDocument> =
  mongoose.models.Event || mongoose.model<IEventDocument>('Event', eventSchema);
