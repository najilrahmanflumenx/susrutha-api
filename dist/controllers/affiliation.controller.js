"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAffiliation = exports.updateAffiliation = exports.createAffiliation = exports.getAffiliations = void 0;
const Affiliation_model_1 = __importDefault(require("../models/Affiliation.model"));
const getAffiliations = async (req, res) => {
    try {
        const { category, status } = req.query;
        const filter = { isDeleted: false };
        if (status)
            filter.status = status;
        if (category)
            filter.category = category;
        const affiliations = await Affiliation_model_1.default.find(filter).sort({ sortOrder: 1, createdAt: -1 });
        res.status(200).json({ success: true, data: affiliations });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAffiliations = getAffiliations;
const createAffiliation = async (req, res) => {
    try {
        const affiliation = await Affiliation_model_1.default.create(req.body);
        res.status(201).json({ success: true, data: affiliation });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createAffiliation = createAffiliation;
const updateAffiliation = async (req, res) => {
    try {
        const affiliation = await Affiliation_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!affiliation) {
            res.status(404).json({ success: false, message: 'Affiliation not found' });
            return;
        }
        res.status(200).json({ success: true, data: affiliation });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateAffiliation = updateAffiliation;
const deleteAffiliation = async (req, res) => {
    try {
        const affiliation = await Affiliation_model_1.default.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!affiliation) {
            res.status(404).json({ success: false, message: 'Affiliation not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteAffiliation = deleteAffiliation;
