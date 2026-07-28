import { Schema, model, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  authorName: string;
  authorTitle?: string;
  coverImage?: string;
  readTimeMinutes: number;
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: Date;
  isDeleted: boolean;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true, default: 'Ayurveda Health' },
    tags: [{ type: String }],
    authorName: { type: String, default: 'Susrutha Medical Team' },
    authorTitle: { type: String },
    coverImage: { type: String },
    readTimeMinutes: { type: Number, default: 5 },
    isFeatured: { type: Boolean, default: false },
    seoTitle: { type: String },
    seoDescription: { type: String },
    status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], default: 'PUBLISHED' },
    publishedAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

BlogSchema.index({ slug: 1, status: 1 });

export const Blog = model<IBlog>('Blog', BlogSchema);
