import { Schema, Document } from 'mongoose';
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
export declare const Appointment: import("mongoose").Model<IAppointment, {}, {}, {}, Document<unknown, {}, IAppointment, {}, {}> & IAppointment & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
