"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVideo = exports.updateVideo = exports.createVideo = exports.getVideos = void 0;
const Video_model_1 = __importDefault(require("../models/Video.model"));
const getVideos = async (req, res) => {
    try {
        const { category, status } = req.query;
        const filter = { isDeleted: false };
        if (status)
            filter.status = status;
        if (category)
            filter.category = category;
        const videos = await Video_model_1.default.find(filter)
            .populate('doctorId', 'name designation photo')
            .populate('treatmentId', 'title category')
            .sort({ sortOrder: 1, createdAt: -1 });
        res.status(200).json({ success: true, data: videos });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getVideos = getVideos;
const createVideo = async (req, res) => {
    try {
        const video = await Video_model_1.default.create(req.body);
        res.status(201).json({ success: true, data: video });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createVideo = createVideo;
const updateVideo = async (req, res) => {
    try {
        const video = await Video_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!video) {
            res.status(404).json({ success: false, message: 'Video not found' });
            return;
        }
        res.status(200).json({ success: true, data: video });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateVideo = updateVideo;
const deleteVideo = async (req, res) => {
    try {
        const video = await Video_model_1.default.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!video) {
            res.status(404).json({ success: false, message: 'Video not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteVideo = deleteVideo;
