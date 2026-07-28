"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTestimonial = exports.updateTestimonial = exports.createTestimonial = exports.getTestimonials = void 0;
const Testimonial_model_1 = require("../models/Testimonial.model");
const getTestimonials = async (req, res) => {
    try {
        const { status, isFeatured, rating } = req.query;
        const filter = { isDeleted: false };
        if (status)
            filter.status = status;
        if (isFeatured !== undefined)
            filter.isFeatured = isFeatured === 'true';
        if (rating)
            filter.rating = Number(rating);
        const testimonials = await Testimonial_model_1.Testimonial.find(filter)
            .populate('branchId', 'name code')
            .sort({ rating: -1, createdAt: -1 });
        res.status(200).json({ success: true, data: testimonials });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getTestimonials = getTestimonials;
const createTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial_model_1.Testimonial.create(req.body);
        res.status(201).json({ success: true, data: testimonial });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createTestimonial = createTestimonial;
const updateTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial_model_1.Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!testimonial) {
            res.status(404).json({ success: false, message: 'Testimonial not found' });
            return;
        }
        res.status(200).json({ success: true, data: testimonial });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateTestimonial = updateTestimonial;
const deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial_model_1.Testimonial.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!testimonial) {
            res.status(404).json({ success: false, message: 'Testimonial not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteTestimonial = deleteTestimonial;
