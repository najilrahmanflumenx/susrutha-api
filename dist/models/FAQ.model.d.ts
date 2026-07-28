import { Document } from 'mongoose';
export interface IFAQ extends Document {
    question: string;
    answer: string;
    category: 'GENERAL' | 'PANCHAKARMA' | 'ADMISSION' | 'INSURANCE' | 'TREATMENT';
    sortOrder: number;
    status: 'ACTIVE' | 'INACTIVE';
    isDeleted: boolean;
}
export declare const FAQ: import("mongoose").Model<IFAQ, {}, {}, {}, Document<unknown, {}, IFAQ, {}, {}> & IFAQ & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
