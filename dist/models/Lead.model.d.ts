import { Schema, Document } from 'mongoose';
export interface ILead extends Document {
    name: string;
    phone: string;
    email?: string;
    subject?: string;
    message?: string;
    branchId?: Schema.Types.ObjectId;
    source: 'WEBSITE_CONTACT' | 'HERO_CALLBACK' | 'FOOTER_NEWSLETTER' | 'WHATSAPP';
    status: 'NEW' | 'CONTACTED' | 'SCHEDULED' | 'CLOSED';
    notes?: string;
    isDeleted: boolean;
}
export declare const Lead: import("mongoose").Model<ILead, {}, {}, {}, Document<unknown, {}, ILead, {}, {}> & ILead & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
