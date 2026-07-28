"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNewsEvent = exports.updateNewsEvent = exports.createNewsEvent = exports.getNewsEvents = void 0;
const NewsEvent_model_1 = __importDefault(require("../models/NewsEvent.model"));
const getNewsEvents = async (req, res) => {
    try {
        const { type, status } = req.query;
        const filter = { isDeleted: false };
        if (status)
            filter.status = status;
        if (type)
            filter.type = type;
        const items = await NewsEvent_model_1.default.find(filter).sort({ publishedDate: -1 });
        res.status(200).json({ success: true, data: items });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getNewsEvents = getNewsEvents;
const createNewsEvent = async (req, res) => {
    try {
        const item = await NewsEvent_model_1.default.create(req.body);
        res.status(201).json({ success: true, data: item });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createNewsEvent = createNewsEvent;
const updateNewsEvent = async (req, res) => {
    try {
        const item = await NewsEvent_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!item) {
            res.status(404).json({ success: false, message: 'News item not found' });
            return;
        }
        res.status(200).json({ success: true, data: item });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateNewsEvent = updateNewsEvent;
const deleteNewsEvent = async (req, res) => {
    try {
        const item = await NewsEvent_model_1.default.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!item) {
            res.status(404).json({ success: false, message: 'News item not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteNewsEvent = deleteNewsEvent;
