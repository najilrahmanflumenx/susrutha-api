import mongoose, { Document } from 'mongoose';
export interface IEcosystem extends Document {
    title: string;
    slug: string;
    pillarType: 'herbal_garden' | 'pharmacy_unit' | 'research_center' | 'academy';
    tagline: string;
    description: string;
    coverImage?: string;
    gallery: string[];
    keyHighlights: string[];
    statistics: {
        label: string;
        value: string;
    }[];
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
