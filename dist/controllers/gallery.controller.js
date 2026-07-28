"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGalleryAlbum = exports.updateGalleryAlbum = exports.createGalleryAlbum = exports.getGalleryAlbums = void 0;
const GalleryAlbum_model_1 = __importDefault(require("../models/GalleryAlbum.model"));
const getGalleryAlbums = async (req, res) => {
    try {
        const { category, status } = req.query;
        const filter = { isDeleted: false };
        if (status)
            filter.status = status;
        if (category)
            filter.category = category;
        const albums = await GalleryAlbum_model_1.default.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: albums });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getGalleryAlbums = getGalleryAlbums;
const createGalleryAlbum = async (req, res) => {
    try {
        const album = await GalleryAlbum_model_1.default.create(req.body);
        res.status(201).json({ success: true, data: album });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createGalleryAlbum = createGalleryAlbum;
const updateGalleryAlbum = async (req, res) => {
    try {
        const album = await GalleryAlbum_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!album) {
            res.status(404).json({ success: false, message: 'Gallery album not found' });
            return;
        }
        res.status(200).json({ success: true, data: album });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateGalleryAlbum = updateGalleryAlbum;
const deleteGalleryAlbum = async (req, res) => {
    try {
        const album = await GalleryAlbum_model_1.default.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!album) {
            res.status(404).json({ success: false, message: 'Gallery album not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteGalleryAlbum = deleteGalleryAlbum;
