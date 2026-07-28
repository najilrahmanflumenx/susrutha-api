import { Schema, Document } from 'mongoose';
export interface IBranch extends Document {
    name: string;
    code: string;
    type: 'INPATIENT_HOSPITAL' | 'CITY_CLINIC' | 'DIAGNOSTIC_CENTER';
    tagline?: string;
    address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    contact: {
        phone: string[];
        email: string;
        emergencyPhone?: string;
    };
    opdTimings: string;
    bedCapacity?: number;
    features: string[];
    coverImage?: string;
    galleryImages: string[];
    isMainBranch: boolean;
    status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
    isDeleted: boolean;
    deletedAt?: Date;
    createdBy?: Schema.Types.ObjectId;
    updatedBy?: Schema.Types.ObjectId;
}
export declare const Branch: import("mongoose").Model<IBranch, {}, {}, {}, Document<unknown, {}, IBranch, {}, {}> & IBranch & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
