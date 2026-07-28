"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTreatment = exports.updateTreatment = exports.createTreatment = exports.getTreatmentBySlug = exports.getTreatments = void 0;
const Treatment_model_1 = __importDefault(require("../models/Treatment.model"));
const getTreatments = async (req, res) => {
    try {
        const { category, search, status, page = 1, limit = 50 } = req.query;
        const filter = { isDeleted: false };
        if (status)
            filter.status = status;
        if (category)
            filter.category = category;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { shortDescription: { $regex: search, $options: 'i' } },
            ];
        }
        const skip = (Number(page) - 1) * Number(limit);
        const [treatments, total] = await Promise.all([
            Treatment_model_1.default.find(filter)
                .populate('doctorIds', 'name designation photo slug')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Treatment_model_1.default.countDocuments(filter),
        ]);
        res.status(200).json({
            success: true,
            data: treatments,
            meta: { total, page: Number(page), limit: Number(limit) },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getTreatments = getTreatments;
const getTreatmentBySlug = async (req, res) => {
    try {
        const treatment = await Treatment_model_1.default.findOne({ slug: req.params.slug, isDeleted: false })
            .populate('doctorIds');
        if (!treatment) {
            res.status(404).json({ success: false, message: 'Treatment not found' });
            return;
        }
        res.status(200).json({ success: true, data: treatment });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getTreatmentBySlug = getTreatmentBySlug;
const createTreatment = async (req, res) => {
    try {
        const treatment = await Treatment_model_1.default.create(req.body);
        res.status(201).json({ success: true, data: treatment });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createTreatment = createTreatment;
const updateTreatment = async (req, res) => {
    try {
        const treatment = await Treatment_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!treatment) {
            res.status(404).json({ success: false, message: 'Treatment not found' });
            return;
        }
        res.status(200).json({ success: true, data: treatment });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateTreatment = updateTreatment;
const deleteTreatment = async (req, res) => {
    try {
        const treatment = await Treatment_model_1.default.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!treatment) {
            res.status(404).json({ success: false, message: 'Treatment not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Treatment deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteTreatment = deleteTreatment;
