"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEcosystemPillar = exports.updateEcosystemPillar = exports.createEcosystemPillar = exports.getEcosystemPillars = void 0;
const Ecosystem_model_1 = __importDefault(require("../models/Ecosystem.model"));
const getEcosystemPillars = async (req, res) => {
    try {
        const { pillarType, status } = req.query;
        const filter = { isDeleted: false };
        if (status)
            filter.status = status;
        if (pillarType)
            filter.pillarType = pillarType;
        const pillars = await Ecosystem_model_1.default.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: pillars });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getEcosystemPillars = getEcosystemPillars;
const createEcosystemPillar = async (req, res) => {
    try {
        const pillar = await Ecosystem_model_1.default.create(req.body);
        res.status(201).json({ success: true, data: pillar });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createEcosystemPillar = createEcosystemPillar;
const updateEcosystemPillar = async (req, res) => {
    try {
        const pillar = await Ecosystem_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!pillar) {
            res.status(404).json({ success: false, message: 'Ecosystem pillar not found' });
            return;
        }
        res.status(200).json({ success: true, data: pillar });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateEcosystemPillar = updateEcosystemPillar;
const deleteEcosystemPillar = async (req, res) => {
    try {
        const pillar = await Ecosystem_model_1.default.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!pillar) {
            res.status(404).json({ success: false, message: 'Ecosystem pillar not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteEcosystemPillar = deleteEcosystemPillar;
