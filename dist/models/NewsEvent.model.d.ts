import mongoose, { Document } from 'mongoose';
export interface INewsEvent extends Document {
    title: string;
    slug: string;
    type: 'press_release' | 'newspaper_clipping' | 'tv_feature' | 'event' | 'award';
    publisherName: string;
    publishedDate: Date;
    summary: string;
    content: string;
    coverImage?: string;
    externalLink?: string;
    attachmentUrl?: string;
    isFeatured: boolean;
    status: 'draft' | 'published' | 'archived';
    isDeleted: boolean;
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
    };
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
}
declare const _default: mongoose.Model<any, {}, {}, {}, any, any>;
export default _default;
