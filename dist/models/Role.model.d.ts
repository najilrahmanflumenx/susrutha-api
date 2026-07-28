import { Document } from 'mongoose';
export interface IRole extends Document {
    name: string;
    displayName: string;
    description?: string;
    permissions: string[];
    isSystem: boolean;
    status: 'ACTIVE' | 'INACTIVE';
}
export declare const Role: import("mongoose").Model<IRole, {}, {}, {}, Document<unknown, {}, IRole, {}, {}> & IRole & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
