import mongoose, { Schema, Document } from 'mongoose';

export interface IAffiliation extends Document {
  title: string;
  name?: string;
  category?: string;
  type?: string;
  logoUrl?: string;
  issuingBody?: string;
  validityYear?: string;
  certificateUrl?: string;
  websiteUrl?: string;
  description?: string;
  sortOrder: number;
  status: 'published' | 'draft' | 'archived' | 'ACTIVE' | 'INACTIVE';
  isDeleted: boolean;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
}

const AffiliationSchema = new Schema<IAffiliation>(
  {
    title: { type: String, required: true, trim: true },
    name: { type: String, default: '', trim: true },
    type: { type: String, default: 'Government Accreditation', trim: true },
    category: {
      type: String,
      default: 'accreditation',
      trim: true,
    },
    logoUrl: { type: String, default: '' },
    issuingBody: { type: String, default: '' },
    validityYear: { type: String, default: '' },
    certificateUrl: { type: String, default: '' },
    websiteUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['published', 'draft', 'archived', 'ACTIVE', 'INACTIVE'],
      default: 'published',
    },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.models.Affiliation || mongoose.model<IAffiliation>('Affiliation', AffiliationSchema);
