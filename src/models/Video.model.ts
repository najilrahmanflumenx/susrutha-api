import mongoose, { Schema, Document } from 'mongoose';

export interface IVideo extends Document {
  title: string;
  slug: string;
  category: string;
  youtubeUrl?: string;
  videoUrl?: string;
  videoHost?: string;
  thumbnailUrl?: string;
  duration?: string;
  description: string;
  doctorId?: mongoose.Types.ObjectId;
  treatmentId?: mongoose.Types.ObjectId;
  isFeatured: boolean;
  sortOrder: number;
  status: 'published' | 'draft' | 'archived' | 'ACTIVE' | 'INACTIVE';
  isDeleted: boolean;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
}

const VideoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    category: {
      type: String,
      default: 'facility_tour',
      trim: true,
    },
    youtubeUrl: { type: String, default: '', trim: true },
    videoUrl: { type: String, default: '', trim: true },
    videoHost: { type: String, default: 'youtube' },
    thumbnailUrl: { type: String, default: '' },
    duration: { type: String, default: '' },
    description: { type: String, default: '' },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor' },
    treatmentId: { type: Schema.Types.ObjectId, ref: 'Treatment' },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['published', 'draft', 'archived', 'ACTIVE', 'INACTIVE'],
      default: 'published',
    },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);
