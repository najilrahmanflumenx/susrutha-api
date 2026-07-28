"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCondition = exports.updateCondition = exports.createCondition = exports.getConditionBySlug = exports.getConditions = void 0;
const Condition_model_1 = __importDefault(require("../models/Condition.model"));
const getConditions = async (req, res) => {
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
        const [conditions, total] = await Promise.all([
            Condition_model_1.default.find(filter)
                .populate('specialistDoctorIds', 'name designation photo slug')
                .populate('recommendedTreatmentIds', 'title category slug coverImage')
                .populate('recommendedPackageIds', 'title durationDays price slug image')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Condition_model_1.default.countDocuments(filter),
        ]);
        res.status(200).json({
            success: true,
            data: conditions,
            meta: { total, page: Number(page), limit: Number(limit) },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getConditions = getConditions;
const getConditionBySlug = async (req, res) => {
    try {
        const condition = await Condition_model_1.default.findOne({ slug: req.params.slug, isDeleted: false })
            .populate('specialistDoctorIds')
            .populate('recommendedTreatmentIds')
            .populate('recommendedPackageIds');
        if (!condition) {
            res.status(404).json({ success: false, message: 'Condition not found' });
            return;
        }
        res.status(200).json({ success: true, data: condition });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getConditionBySlug = getConditionBySlug;
const createCondition = async (req, res) => {
    try {
        const condition = await Condition_model_1.default.create(req.body);
        res.status(201).json({ success: true, data: condition });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createCondition = createCondition;
const updateCondition = async (req, res) => {
    try {
        const condition = await Condition_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!condition) {
            res.status(404).json({ success: false, message: 'Condition not found' });
            return;
        }
        res.status(200).json({ success: true, data: condition });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateCondition = updateCondition;
const deleteCondition = async (req, res) => {
    try {
        const condition = await Condition_model_1.default.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!condition) {
            res.status(404).json({ success: false, message: 'Condition not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Condition deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteCondition = deleteCondition;
