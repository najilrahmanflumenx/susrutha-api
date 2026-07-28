import { Schema, model, Document } from 'mongoose';

export interface IInfrastructure extends Document {
  title: string;
  category: 'ROOMS' | 'PANCHAKARMA_SUITES' | 'OPERATING_THEATRE' | 'PHYSIOTHERAPY' | 'YOGA_HALL' | 'AYUR_VILLAGE' | 'OTHER';
  branchId: Schema.Types.ObjectId;
  description: string;
  specifications: string[];
  capacity?: number;
  coverImage?: string;
  galleryImages: string[];
  sortOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
  isDeleted: boolean;
}

const InfrastructureSchema = new Schema<IInfrastructure>(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['ROOMS', 'PANCHAKARMA_SUITES', 'OPERATING_THEATRE', 'PHYSIOTHERAPY', 'YOGA_HALL', 'AYUR_VILLAGE', 'OTHER'],
      required: true,
    },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    description: { type: String, required: true },
    specifications: [{ type: String }],
    capacity: { type: Number },
    coverImage: { type: String },
    galleryImages: [{ type: String }],
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

InfrastructureSchema.index({ branchId: 1, category: 1 });

export const Infrastructure = model<IInfrastructure>('Infrastructure', InfrastructureSchema);
