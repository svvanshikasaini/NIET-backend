// NIET Pharmacy Backend - Committee Mongoose Model
import mongoose, { Document, Model, Schema } from 'mongoose';
import { serializeMongoDocument } from '@/lib/mongodb';

export interface ICommitteeMemberItem {
  sNo: number;
  name: string;
  designation?: string;
  role?: string;
  contact?: string;
}

export interface ISquadMemberItem {
  sNo: number;
  name: string;
  contact: string;
}

export interface ISquadFloorItem {
  floor: string;
  members: ISquadMemberItem[];
}

export interface ICommitteeDocument extends Document {
  name: string;
  slug: string;
  committeeTitle: string;
  description?: string;
  committeeMembers: ICommitteeMemberItem[];
  squadTitle?: string;
  squadFloors: ISquadFloorItem[];
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const committeeSchema = new Schema<ICommitteeDocument>(
  {
    name: {
      type: String,
      required: [true, 'Committee name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Committee slug is required'],
      unique: true,
      trim: true,
      index: true,
    },
    committeeTitle: {
      type: String,
      required: [true, 'Committee title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    committeeMembers: [
      {
        sNo: { type: Number, required: true },
        name: { type: String, required: true, trim: true },
        designation: { type: String, trim: true },
        role: { type: String, trim: true },
        contact: { type: String, trim: true },
      },
    ],
    squadTitle: {
      type: String,
      trim: true,
    },
    squadFloors: [
      {
        floor: { type: String, required: true },
        members: [
          {
            sNo: { type: Number, required: true },
            name: { type: String, required: true, trim: true },
            contact: { type: String, required: true, trim: true },
          },
        ],
      },
    ],
    isActive: {
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

export const CommitteeModel: Model<ICommitteeDocument> =
  mongoose.models.Committee || mongoose.model<ICommitteeDocument>('Committee', committeeSchema);
