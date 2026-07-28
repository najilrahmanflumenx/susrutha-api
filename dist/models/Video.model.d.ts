import mongoose, { Document } from 'mongoose';
export interface IVideo extends Document {
    title: string;
    slug: string;
    category: 'patient_story' | 'doctor_talk' | 'facility_tour' | 'treatment_demo';
    youtubeUrl: string;
    videoHost: 'youtube' | 'vimeo' | 'cloudinary';
    thumbnailUrl?: string;
    duration?: string;
    description: string;
    doctorId?: mongoose.Types.ObjectId;
    treatmentId?: mongoose.Types.ObjectId;
    isFeatured: boolean;
    sortOrder: number;
    status: 'draft' | 'published' | 'archived';
    isDeleted: boolean;
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
}
declare const _default: mongoose.Model<any, {}, {}, {}, any, any>;
export default _default;
