import mongoose, { Document } from 'mongoose';
export interface IMediaFile extends Document {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    publicId?: string;
    folder: string;
    altText: string;
    tags: string[];
    dimensions?: {
        width: number;
        height: number;
    };
    uploadedBy?: mongoose.Types.ObjectId;
    isDeleted: boolean;
}
declare const _default: mongoose.Model<any, {}, {}, {}, any, any>;
export default _default;
