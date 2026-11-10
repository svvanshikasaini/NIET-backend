// NIET Pharmacy Backend - Website Settings Mongoose Model
import mongoose, { Document, Model, Schema } from 'mongoose';
import { serializeMongoDocument } from '@/lib/mongodb';

export interface IHeroSlideItem {
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  link?: string;
}

export interface IWebsiteSettingsDocument extends Document {
  key: string;
  heroHeading: string;
  heroSubheading: string;
  heroDescription: string;
  nirfBadgeText: string;
  admissionsApplyUrl: string;
  heroSlides: IHeroSlideItem[];
  contactInfo: {
    campusAddress: {
      line1: string;
      line2: string;
      city: string;
      pincode: string;
    };
    phones: { label: string; number: string }[];
    emails: { label: string; email: string }[];
    mapEmbedUrl?: string;
  };
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const websiteSettingsSchema = new Schema<IWebsiteSettingsDocument>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'global_config',
      index: true,
    },
    heroHeading: {
      type: String,
      default: 'Committed to developing highly skilled professionals',
    },
    heroSubheading: {
      type: String,
      default: 'A Centre of Excellence',
    },
    heroDescription: {
      type: String,
      default:
        'Ranked 37th nationally by NIRF 2024, Ministry of Education, Govt. of India. NBA Accredited B.Pharm program with Platinum Rating in QS I-GAUGE.',
    },
    nirfBadgeText: {
      type: String,
      default: 'NIRF 2024: 37th Rank in India',
    },
    admissionsApplyUrl: {
      type: String,
      default: 'https://applynow.niet.co.in/',
    },
    heroSlides: [
      {
        title: { type: String, required: true },
        subtitle: { type: String },
        description: { type: String },
        image: { type: String, required: true },
        link: { type: String },
      },
    ],
    contactInfo: {
      campusAddress: {
        line1: { type: String, default: 'Noida Institute of Engineering and Technology (Pharmacy Institute)' },
        line2: { type: String, default: '19, Knowledge Park-II, Institutional Area' },
        city: { type: String, default: 'Greater Noida (UP)' },
        pincode: { type: String, default: '201306' },
      },
      phones: [
        {
          label: { type: String, required: true },
          number: { type: String, required: true },
        },
      ],
      emails: [
        {
          label: { type: String, required: true },
          email: { type: String, required: true },
        },
      ],
      mapEmbedUrl: { type: String },
    },
    socialLinks: {
      facebook: { type: String },
      twitter: { type: String },
      linkedin: { type: String },
      instagram: { type: String },
      youtube: { type: String },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: serializeMongoDocument,
    },
  }
);

export const WebsiteSettingsModel: Model<IWebsiteSettingsDocument> =
  mongoose.models.WebsiteSettings ||
  mongoose.model<IWebsiteSettingsDocument>('WebsiteSettings', websiteSettingsSchema);
