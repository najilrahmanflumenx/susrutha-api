"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMediaFile = exports.createMediaFileRecord = exports.getMediaFiles = void 0;
const MediaFile_model_1 = __importDefault(require("../models/MediaFile.model"));
const getMediaFiles = async (req, res) => {
    try {
        const { folder, mimeType, search, page = 1, limit = 50 } = req.query;
        const filter = { isDeleted: false };
        if (folder)
            filter.folder = folder;
        if (mimeType)
            filter.mimeType = { $regex: mimeType, $options: 'i' };
        if (search) {
            filter.$or = [
                { originalName: { $regex: search, $options: 'i' } },
                { altText: { $regex: search, $options: 'i' } },
            ];
        }
        const skip = (Number(page) - 1) * Number(limit);
        const [files, total] = await Promise.all([
            MediaFile_model_1.default.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
            MediaFile_model_1.default.countDocuments(filter),
        ]);
        res.status(200).json({
            success: true,
            data: files,
            meta: { total, page: Number(page), limit: Number(limit) },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMediaFiles = getMediaFiles;
const createMediaFileRecord = async (req, res) => {
    try {
        const media = await MediaFile_model_1.default.create(req.body);
        res.status(201).json({ success: true, data: media });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createMediaFileRecord = createMediaFileRecord;
const deleteMediaFile = async (req, res) => {
    try {
        const file = await MediaFile_model_1.default.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!file) {
            res.status(404).json({ success: false, message: 'Media file not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteMediaFile = deleteMediaFile;
