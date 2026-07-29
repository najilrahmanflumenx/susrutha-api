import mongoose, { Schema, Document } from 'mongoose';

export interface ICondition extends Document {
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  coverImage?: string;
  ayurvedicRootCause?: string;
  symptoms: string[];
  recommendedTreatmentIds: mongoose.Types.ObjectId[];
  recommendedPackageIds: mongoose.Types.ObjectId[];
  specialistDoctorIds: mongoose.Types.ObjectId[];
  assignedBranchIds?: mongoose.Types.ObjectId[];
  faqs: { question: string; answer: string }[];
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

const ConditionSchema = new Schema<ICondition>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    category: { type: String, default: 'General', trim: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    coverImage: { type: String, default: '' },
    ayurvedicRootCause: { type: String, default: '' },
    symptoms: [{ type: String }],
    recommendedTreatmentIds: [{ type: Schema.Types.ObjectId, ref: 'Treatment' }],
    recommendedPackageIds: [{ type: Schema.Types.ObjectId, ref: 'CarePackage' }],
    specialistDoctorIds: [{ type: Schema.Types.ObjectId, ref: 'Doctor' }],
    assignedBranchIds: [{ type: Schema.Types.ObjectId, ref: 'Branch' }],
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
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

export default mongoose.models.Condition || mongoose.model<ICondition>('Condition', ConditionSchema);
