// NIET Pharmacy Backend - Gallery Mongoose Model
import mongoose, { Document, Model, Schema } from 'mongoose';
import { serializeMongoDocument } from '@/lib/mongodb';

export interface IGalleryDocument extends Document {
  title: string;
  category: string;
  image: string;
  caption?: string;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const gallerySchema = new Schema<IGalleryDocument>(
  {
    title: {
      type: String,
      required: [true, 'Gallery item title is required'],
      trim: true,
    },
    category: {
      type: String,
      default: 'Campus Activities',
      index: true,
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    caption: {
      type: String,
      trim: true,
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

export const GalleryModel: Model<IGalleryDocument> =
  mongoose.models.Gallery || mongoose.model<IGalleryDocument>('Gallery', gallerySchema);
