import mongoose, { Schema, Document } from 'mongoose';

export interface IAffiliation extends Document {
  title: string;
  category: 'accreditation' | 'certification' | 'research_partner' | 'university';
  logoUrl: string;
  issuingBody: string;
  validityYear?: string;
  certificateUrl?: string;
  description?: string;
  sortOrder: number;
  status: 'draft' | 'published' | 'archived';
  isDeleted: boolean;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
}

const AffiliationSchema = new Schema<IAffiliation>(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['accreditation', 'certification', 'research_partner', 'university'],
      default: 'accreditation',
    },
    logoUrl: { type: String, required: true },
    issuingBody: { type: String, default: '' },
    validityYear: { type: String, default: '' },
    certificateUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.models.Affiliation || mongoose.model<IAffiliation>('Affiliation', AffiliationSchema);
