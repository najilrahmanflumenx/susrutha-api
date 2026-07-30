import { Schema, model, Document } from 'mongoose';

export interface ILead extends Document {
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message?: string;
  leadType: 'PACKAGE_BOOKING' | 'SINGLE_TREATMENT' | 'GENERAL_INQUIRY' | 'FEEDBACK_RATING';
  packageId?: Schema.Types.ObjectId;
  treatmentId?: Schema.Types.ObjectId;
  doctorId?: Schema.Types.ObjectId;
  branchId?: Schema.Types.ObjectId;
  rating?: number;
  preferredDate?: Date;
  preferredTimeSlot?: string;
  symptomsNote?: string;
  source: 'WEBSITE_CONTACT' | 'HERO_CALLBACK' | 'FOOTER_NEWSLETTER' | 'WHATSAPP' | 'BOOKING_WIZARD' | 'FEEDBACK_FORM';
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
    leadType: {
      type: String,
      enum: ['PACKAGE_BOOKING', 'SINGLE_TREATMENT', 'GENERAL_INQUIRY', 'FEEDBACK_RATING'],
      default: 'GENERAL_INQUIRY',
    },
    packageId: { type: Schema.Types.ObjectId, ref: 'CarePackage' },
    treatmentId: { type: Schema.Types.ObjectId, ref: 'Treatment' },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor' },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    rating: { type: Number, min: 1, max: 5 },
    preferredDate: { type: Date },
    preferredTimeSlot: { type: String },
    symptomsNote: { type: String },
    source: {
      type: String,
      enum: ['WEBSITE_CONTACT', 'HERO_CALLBACK', 'FOOTER_NEWSLETTER', 'WHATSAPP', 'BOOKING_WIZARD', 'FEEDBACK_FORM'],
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

LeadSchema.index({ leadType: 1, status: 1 });
LeadSchema.index({ branchId: 1 });

export const Lead = model<ILead>('Lead', LeadSchema);
