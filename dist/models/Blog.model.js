"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
const mongoose_1 = require("mongoose");
const BlogSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true, default: 'Ayurveda Health' },
    tags: [{ type: String }],
    authorName: { type: String, default: 'Susrutha Medical Team' },
    authorTitle: { type: String },
    coverImage: { type: String },
    readTimeMinutes: { type: Number, default: 5 },
    isFeatured: { type: Boolean, default: false },
    seoTitle: { type: String },
    seoDescription: { type: String },
    status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], default: 'PUBLISHED' },
    publishedAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
BlogSchema.index({ slug: 1, status: 1 });
exports.Blog = (0, mongoose_1.model)('Blog', BlogSchema);
