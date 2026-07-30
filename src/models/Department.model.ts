import { Schema, model, Document } from 'mongoose';

export interface IDepartment extends Document {
  title: string;
  slug: string;
  code: string;
  tagline?: string;
  overview: string;
  headDoctorId?: Schema.Types.ObjectId;
  assignedBranchIds: Schema.Types.ObjectId[];
  icon?: string;
  coverImage?: string;
  image?: string;
  branchCode?: string;
  sortOrder: number;
  isFeatured: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  isDeleted: boolean;
}

const DepartmentSchema = new Schema<IDepartment>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    code: { type: String, uppercase: true, trim: true },
    tagline: { type: String },
    overview: { type: String, required: true },
    headDoctorId: { type: Schema.Types.ObjectId, ref: 'Doctor' },
    assignedBranchIds: [{ type: Schema.Types.ObjectId, ref: 'Branch' }],
    icon: { type: String },
    coverImage: { type: String },
    image: { type: String },
    branchCode: { type: String, uppercase: true, trim: true },
    sortOrder: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

DepartmentSchema.index({ slug: 1 });
DepartmentSchema.index({ assignedBranchIds: 1 });

export const Department = model<IDepartment>('Department', DepartmentSchema);
