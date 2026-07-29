import mongoose, { Schema, Document } from 'mongoose';

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

const MediaItemSchema = new Schema<IMediaItem>({
  url: { type: String, required: true },
  caption: { type: String, default: '' },
  altText: { type: String, default: '' },
  mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
  sortOrder: { type: Number, default: 0 },
});

const GalleryAlbumSchema = new Schema<IGalleryAlbum>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    category: {
      type: String,
      enum: ['infrastructure', 'ayur_village', 'kowdiar_op', 'herbal_garden', 'events', 'treatments'],
      default: 'infrastructure',
    },
    description: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    mediaItems: [MediaItemSchema],
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.models.GalleryAlbum || mongoose.model<IGalleryAlbum>('GalleryAlbum', GalleryAlbumSchema);
