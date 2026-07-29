import mongoose, { Schema, Document } from 'mongoose';

export interface IEcosystem extends Document {
  title: string;
  slug: string;
  pillarType: 'herbal_garden' | 'pharmacy_unit' | 'research_center' | 'academy';
  tagline: string;
  description: string;
  coverImage?: string;
  gallery: string[];
  keyHighlights: string[];
  statistics: { label: string; value: string }[];
  status: 'draft' | 'published' | 'archived';
  isDeleted: boolean;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
}

const EcosystemSchema = new Schema<IEcosystem>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    pillarType: {
      type: String,
      enum: ['herbal_garden', 'pharmacy_unit', 'research_center', 'academy'],
      required: true,
    },
    tagline: { type: String, default: '' },
    description: { type: String, required: true },
    coverImage: { type: String, default: '' },
    gallery: [{ type: String }],
    keyHighlights: [{ type: String }],
    statistics: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
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

export default mongoose.models.Ecosystem || mongoose.model<IEcosystem>('Ecosystem', EcosystemSchema);
