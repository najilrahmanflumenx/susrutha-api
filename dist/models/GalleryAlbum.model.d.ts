import mongoose, { Document } from 'mongoose';
export interface IMediaItem {
    url: string;
    caption?: string;
    altText?: string;
    mediaType: 'image' | 'video';
    sortOrder: number;
}
export interface IGalleryAlbum extends Document {
    title: string;
    slug: string;
    category: 'infrastructure' | 'ayur_village' | 'kowdiar_op' | 'herbal_garden' | 'events' | 'treatments';
    description?: string;
    coverImage?: string;
    mediaItems: IMediaItem[];
    isFeatured: boolean;
    status: 'draft' | 'published' | 'archived';
    isDeleted: boolean;
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
}
declare const _default: mongoose.Model<any, {}, {}, {}, any, any>;
export default _default;
