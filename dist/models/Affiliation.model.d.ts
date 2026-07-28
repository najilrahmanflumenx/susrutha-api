import mongoose, { Document } from 'mongoose';
export interface IAffiliation extends Document {
    title: string;
    category: 'accreditation' | 'certification' | 'research_partner' | 'university';
    logoUrl: string;
    issuingBody: string;
    validityYear?: string;
    certificateUrl?: string;
    description?: string;
    sortOrder: number;
    status: 'draft' | 'published' | 'archived';
    isDeleted: boolean;
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
}
declare const _default: mongoose.Model<any, {}, {}, {}, any, any>;
export default _default;
