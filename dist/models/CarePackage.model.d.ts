import { Schema, Document } from 'mongoose';
export interface ICarePackage extends Document {
    title: string;
    slug: string;
    subtitle?: string;
    durationDays: number;
    assignedBranchIds: Schema.Types.ObjectId[];
    overview: string;
    inclusions: string[];
    exclusions: string[];
    targetAilments: string[];
    image?: string;
    price?: number;
    isFeatured: boolean;
    sortOrder: number;
    status: 'ACTIVE' | 'INACTIVE';
    isDeleted: boolean;
}
export declare const CarePackage: import("mongoose").Model<ICarePackage, {}, {}, {}, Document<unknown, {}, ICarePackage, {}, {}> & ICarePackage & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
