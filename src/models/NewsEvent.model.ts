import mongoose, { Schema, Document } from 'mongoose';

export interface INewsEvent extends Document {
  title: string;
  slug: string;
  type: 'press_release' | 'newspaper_clipping' | 'tv_feature' | 'event' | 'award';
  publisherName: string;
  publishedDate: Date;
  summary: string;
  content: string;
  coverImage?: string;
  externalLink?: string;
  attachmentUrl?: string;
  isFeatured: boolean;
  status: 'draft' | 'published' | 'archived';
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
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    type: {
      type: String,
      enum: ['press_release', 'newspaper_clipping', 'tv_feature', 'event', 'award'],
      default: 'press_release',
    },
    publisherName: { type: String, default: 'Susrutha Media' },
    publishedDate: { type: Date, default: Date.now },
    summary: { type: String, required: true },
    content: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    externalLink: { type: String, default: '' },
    attachmentUrl: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
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
