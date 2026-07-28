import { Schema, model, Document } from 'mongoose';

export interface IAppointment extends Document {
  appointmentNumber: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  patientAge?: number;
  patientGender?: 'MALE' | 'FEMALE' | 'OTHER';
  branchId: Schema.Types.ObjectId;
  departmentId?: Schema.Types.ObjectId;
  doctorId?: Schema.Types.ObjectId;
  consultationType: 'OPD_INPERSON' | 'IPD_ADMISSION' | 'TELE_CONSULTATION';
  preferredDate: Date;
  preferredTimeSlot: string;
  symptomsNote?: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  adminNotes?: string;
  isDeleted: boolean;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    appointmentNumber: { type: String, required: true, unique: true },
    patientName: { type: String, required: true, trim: true },
    patientPhone: { type: String, required: true, trim: true },
    patientEmail: { type: String, lowercase: true, trim: true },
    patientAge: { type: Number },
    patientGender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'] },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department' },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor' },
    consultationType: {
      type: String,
      enum: ['OPD_INPERSON', 'IPD_ADMISSION', 'TELE_CONSULTATION'],
      default: 'OPD_INPERSON',
    },
    preferredDate: { type: Date, required: true },
    preferredTimeSlot: { type: String, required: true },
    symptomsNote: { type: String },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'],
      default: 'PENDING',
    },
    adminNotes: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

AppointmentSchema.index({ branchId: 1, preferredDate: 1 });
AppointmentSchema.index({ doctorId: 1, preferredDate: 1 });

export const Appointment = model<IAppointment>('Appointment', AppointmentSchema);
