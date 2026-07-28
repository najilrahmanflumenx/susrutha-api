import { Schema, Document } from 'mongoose';
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
export declare const Testimonial: import("mongoose").Model<ITestimonial, {}, {}, {}, Document<unknown, {}, ITestimonial, {}, {}> & ITestimonial & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
