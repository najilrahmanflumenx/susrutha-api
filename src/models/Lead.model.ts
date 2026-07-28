import { Schema, model, Document } from 'mongoose';

export interface ILead extends Document {
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message?: string;
  branchId?: Schema.Types.ObjectId;
  source: 'WEBSITE_CONTACT' | 'HERO_CALLBACK' | 'FOOTER_NEWSLETTER' | 'WHATSAPP';
  status: 'NEW' | 'CONTACTED' | 'SCHEDULED' | 'CLOSED';
  notes?: string;
  isDeleted: boolean;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    subject: { type: String },
    message: { type: String },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    source: {
      type: String,
      enum: ['WEBSITE_CONTACT', 'HERO_CALLBACK', 'FOOTER_NEWSLETTER', 'WHATSAPP'],
      default: 'WEBSITE_CONTACT',
    },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'SCHEDULED', 'CLOSED'],
      default: 'NEW',
    },
    notes: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Lead = model<ILead>('Lead', LeadSchema);
