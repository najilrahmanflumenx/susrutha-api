import { Schema, model, Document } from 'mongoose';

export interface IFAQ extends Document {
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
  isDeleted: boolean;
}

const FAQSchema = new Schema<IFAQ>(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    category: { type: String, default: 'General Queries', trim: true },
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

FAQSchema.index({ category: 1, sortOrder: 1 });

export const FAQ = model<IFAQ>('FAQ', FAQSchema);
