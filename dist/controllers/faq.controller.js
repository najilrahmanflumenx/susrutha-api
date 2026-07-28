"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFAQ = exports.updateFAQ = exports.createFAQ = exports.getFAQs = void 0;
const FAQ_model_1 = require("../models/FAQ.model");
const getFAQs = async (req, res) => {
    try {
        const { category, status } = req.query;
        const filter = { isDeleted: false };
        if (status)
            filter.status = status;
        if (category)
            filter.category = category;
        const faqs = await FAQ_model_1.FAQ.find(filter).sort({ sortOrder: 1, createdAt: -1 });
        res.status(200).json({ success: true, data: faqs });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getFAQs = getFAQs;
const createFAQ = async (req, res) => {
    try {
        const faq = await FAQ_model_1.FAQ.create(req.body);
        res.status(201).json({ success: true, data: faq });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createFAQ = createFAQ;
const updateFAQ = async (req, res) => {
    try {
        const faq = await FAQ_model_1.FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!faq) {
            res.status(404).json({ success: false, message: 'FAQ not found' });
            return;
        }
        res.status(200).json({ success: true, data: faq });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateFAQ = updateFAQ;
const deleteFAQ = async (req, res) => {
    try {
        const faq = await FAQ_model_1.FAQ.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!faq) {
            res.status(404).json({ success: false, message: 'FAQ not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteFAQ = deleteFAQ;
