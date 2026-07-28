import { Schema, Document } from 'mongoose';
export interface IDoctor extends Document {
    name: string;
    slug: string;
    designation: string;
    qualifications: string;
    registrationNumber?: string;
    experienceYears: number;
    departmentId: Schema.Types.ObjectId;
    assignedBranchIds: Schema.Types.ObjectId[];
    bio: string;
    photo?: string;
    consultationFee: number;
    availability: {
        branchId: Schema.Types.ObjectId;
        days: string[];
        timeSlots: string[];
    }[];
    specialties: string[];
    languagesSpoken: string[];
    sortOrder: number;
    isDirector: boolean;
    isFeatured: boolean;
    status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
    isDeleted: boolean;
}
export declare const Doctor: import("mongoose").Model<IDoctor, {}, {}, {}, Document<unknown, {}, IDoctor, {}, {}> & IDoctor & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
