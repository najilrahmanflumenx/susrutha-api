import { Schema, model, Document } from 'mongoose';

export interface ITestimonial extends Document {
  patientName: string;
  patientLocation?: string;
  treatmentReceived?: string;
  branchId?: Schema.Types.ObjectId;
  rating: number;
  reviewText: string;
  patientPhoto?: string;
  videoUrl?: string;
  isFeatured: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  isDeleted: boolean;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    patientName: { type: String, required: true, trim: true },
    patientLocation: { type: String, default: 'Thiruvananthapuram' },
    treatmentReceived: { type: String },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    reviewText: { type: String, required: true },
    patientPhoto: { type: String },
    videoUrl: { type: String },
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Testimonial = model<ITestimonial>('Testimonial', TestimonialSchema);
