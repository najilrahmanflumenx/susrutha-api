import { Schema, model, Document } from 'mongoose';

export interface IFAQ extends Document {
  question: string;
  answer: string;
  category: 'GENERAL' | 'PANCHAKARMA' | 'ADMISSION' | 'INSURANCE' | 'TREATMENT';
  sortOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
  isDeleted: boolean;
}

const FAQSchema = new Schema<IFAQ>(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    category: {
      type: String,
      enum: ['GENERAL', 'PANCHAKARMA', 'ADMISSION', 'INSURANCE', 'TREATMENT'],
      default: 'GENERAL',
    },
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const FAQ = model<IFAQ>('FAQ', FAQSchema);
