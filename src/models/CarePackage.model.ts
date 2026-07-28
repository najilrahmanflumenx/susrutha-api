import { Schema, model, Document } from 'mongoose';

export interface ICarePackage extends Document {
  title: string;
  slug: string;
  subtitle?: string;
  durationDays: number;
  assignedBranchIds: Schema.Types.ObjectId[];
  overview: string;
  inclusions: string[];
  exclusions: string[];
  targetAilments: string[];
  image?: string;
  price?: number;
  isFeatured: boolean;
  sortOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
  isDeleted: boolean;
}

const CarePackageSchema = new Schema<ICarePackage>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    subtitle: { type: String },
    durationDays: { type: Number, required: true, default: 7 },
    assignedBranchIds: [{ type: Schema.Types.ObjectId, ref: 'Branch' }],
    overview: { type: String, required: true },
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    targetAilments: [{ type: String }],
    image: { type: String },
    price: { type: Number },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const CarePackage = model<ICarePackage>('CarePackage', CarePackageSchema);
