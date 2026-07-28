import { Schema, Document } from 'mongoose';
export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    phone?: string;
    roleId: Schema.Types.ObjectId;
    assignedBranchIds: Schema.Types.ObjectId[];
    avatar?: string;
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    lastLoginAt?: Date;
    refreshToken?: string;
    isDeleted: boolean;
    deletedAt?: Date;
}
export declare const User: import("mongoose").Model<IUser, {}, {}, {}, Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
