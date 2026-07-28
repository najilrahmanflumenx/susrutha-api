import { Schema, Document } from 'mongoose';
export interface IDepartment extends Document {
    title: string;
    slug: string;
    code: string;
    tagline?: string;
    overview: string;
    headDoctorId?: Schema.Types.ObjectId;
    assignedBranchIds: Schema.Types.ObjectId[];
    icon?: string;
    coverImage?: string;
    sortOrder: number;
    isFeatured: boolean;
    status: 'ACTIVE' | 'INACTIVE';
    isDeleted: boolean;
}
export declare const Department: import("mongoose").Model<IDepartment, {}, {}, {}, Document<unknown, {}, IDepartment, {}, {}> & IDepartment & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
