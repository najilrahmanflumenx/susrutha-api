import mongoose, { Schema, Document } from 'mongoose';

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
  dimensions?: { width: number; height: number };
  uploadedBy?: mongoose.Types.ObjectId;
  isDeleted: boolean;
}

const MediaFileSchema = new Schema<IMediaFile>(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, default: 0 },
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
    folder: { type: String, default: 'general' },
    altText: { type: String, default: '' },
    tags: [{ type: String }],
    dimensions: {
      width: { type: Number },
      height: { type: Number },
    },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.MediaFile || mongoose.model<IMediaFile>('MediaFile', MediaFileSchema);
