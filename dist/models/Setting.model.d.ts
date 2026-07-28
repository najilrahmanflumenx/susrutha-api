import { Document } from 'mongoose';
export interface ISetting extends Document {
    key: string;
    value: Record<string, any>;
    description?: string;
    isSystem: boolean;
}
export declare const Setting: import("mongoose").Model<ISetting, {}, {}, {}, Document<unknown, {}, ISetting, {}, {}> & ISetting & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
