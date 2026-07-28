import mongoose, { Document } from 'mongoose';
export interface ICondition extends Document {
    title: string;
    slug: string;
    category: string;
    shortDescription: string;
    fullDescription: string;
    coverImage?: string;
    ayurvedicRootCause?: string;
    symptoms: string[];
    recommendedTreatmentIds: mongoose.Types.ObjectId[];
    recommendedPackageIds: mongoose.Types.ObjectId[];
    specialistDoctorIds: mongoose.Types.ObjectId[];
    assignedBranchIds?: mongoose.Types.ObjectId[];
    faqs: {
        question: string;
        answer: string;
    }[];
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
