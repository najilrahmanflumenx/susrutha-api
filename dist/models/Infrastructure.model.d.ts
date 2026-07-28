import { Schema, Document } from 'mongoose';
export interface IInfrastructure extends Document {
    title: string;
    category: 'ROOMS' | 'PANCHAKARMA_SUITES' | 'OPERATING_THEATRE' | 'PHYSIOTHERAPY' | 'YOGA_HALL' | 'AYUR_VILLAGE' | 'OTHER';
    branchId: Schema.Types.ObjectId;
    description: string;
    specifications: string[];
    capacity?: number;
    coverImage?: string;
    galleryImages: string[];
    sortOrder: number;
    status: 'ACTIVE' | 'INACTIVE';
    isDeleted: boolean;
}
export declare const Infrastructure: import("mongoose").Model<IInfrastructure, {}, {}, {}, Document<unknown, {}, IInfrastructure, {}, {}> & IInfrastructure & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
