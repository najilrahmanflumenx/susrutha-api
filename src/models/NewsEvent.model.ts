import mongoose, { Schema, Document } from 'mongoose';

export interface INewsEvent extends Document {
  title: string;
  slug: string;
  type: string;
  publisherName: string;
  publishedDate: Date;
  summary: string;
  content: string;
  coverImage?: string;
  externalLink?: string;
  articleUrl?: string;
  attachmentUrl?: string;
  publicationType?: string;
  isFeatured: boolean;
  status: 'draft' | 'published' | 'archived' | 'ACTIVE' | 'INACTIVE';
  isDeleted: boolean;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
}

const NewsEventSchema = new Schema<INewsEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    type: {
      type: String,
      default: 'press_release',
    },
    publicationType: { type: String, default: 'newspaper' },
    publisherName: { type: String, default: 'Susrutha Media' },
    publishedDate: { type: Date, default: Date.now },
    summary: { type: String, default: '' },
    content: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    externalLink: { type: String, default: '' },
    articleUrl: { type: String, default: '' },
    attachmentUrl: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ['draft', 'published', 'archived', 'ACTIVE', 'INACTIVE'], default: 'published' },
    isDeleted: { type: Boolean, default: false },
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.models.NewsEvent || mongoose.model<INewsEvent>('NewsEvent', NewsEventSchema);
