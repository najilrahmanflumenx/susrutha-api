import mongoose, { Document } from 'mongoose';
export interface ITreatment extends Document {
    title: string;
    slug: string;
    category: string;
    shortDescription: string;
    fullDescription: string;
    coverImage?: string;
    galleryImages: string[];
    durationMinutes: number;
    recommendedDays: number;
    indications: string[];
    benefits: string[];
    contraindications: string[];
    procedureSteps: string[];
    doctorIds: mongoose.Types.ObjectId[];
    assignedBranchIds?: mongoose.Types.ObjectId[];
    isFeatured: boolean;
    status: 'draft' | 'published' | 'archived';
    isDeleted: boolean;
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
        metaKeywords?: string;
        ogImage?: string;
        canonicalUrl?: string;
    };
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
}
declare const _default: mongoose.Model<any, {}, {}, {}, any, any>;
export default _default;
