import { Document } from 'mongoose';
export interface IBlog extends Document {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string[];
    authorName: string;
    authorTitle?: string;
    coverImage?: string;
    readTimeMinutes: number;
    isFeatured: boolean;
    seoTitle?: string;
    seoDescription?: string;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    publishedAt?: Date;
    isDeleted: boolean;
}
export declare const Blog: import("mongoose").Model<IBlog, {}, {}, {}, Document<unknown, {}, IBlog, {}, {}> & IBlog & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
