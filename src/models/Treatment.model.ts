import mongoose, { Schema, Document } from 'mongoose';

export interface ITreatment extends Document {
  title: string;
  slug: string;
  category: string; // e.g. Panchakarma, Kizhi, Dhara, Vasthi, Wellness
  shortDescription: string;
  fullDescription: string;
  coverImage?: string;
  galleryImages: string[];
  durationMinutes: number;
  recommendedDays: number;
  indications: string[];
  benefits: string[];
  contraindications: string[];
  procedureSteps: string[];
  doctorIds: mongoose.Types.ObjectId[];
  assignedBranchIds?: mongoose.Types.ObjectId[];
  isFeatured: boolean;
  status: 'draft' | 'published' | 'archived';
  isDeleted: boolean;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    ogImage?: string;
    canonicalUrl?: string;
  };
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
}

const TreatmentSchema = new Schema<ITreatment>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    category: { type: String, default: 'Panchakarma', trim: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    coverImage: { type: String, default: '' },
    galleryImages: [{ type: String }],
    durationMinutes: { type: Number, default: 60 },
    recommendedDays: { type: Number, default: 14 },
    indications: [{ type: String }],
    benefits: [{ type: String }],
    contraindications: [{ type: String }],
    procedureSteps: [{ type: String }],
    doctorIds: [{ type: Schema.Types.ObjectId, ref: 'Doctor' }],
    assignedBranchIds: [{ type: Schema.Types.ObjectId, ref: 'Branch' }],
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
    isDeleted: { type: Boolean, default: false },
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      metaKeywords: { type: String, default: '' },
      ogImage: { type: String, default: '' },
      canonicalUrl: { type: String, default: '' },
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.models.Treatment || mongoose.model<ITreatment>('Treatment', TreatmentSchema);
