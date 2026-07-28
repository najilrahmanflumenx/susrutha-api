import { Request, Response } from 'express';
import { Testimonial } from '../models/Testimonial.model';

export const getTestimonials = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, isFeatured, rating } = req.query;
    const filter: any = { isDeleted: false };
    if (status) filter.status = status;
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
    if (rating) filter.rating = Number(rating);

    const testimonials = await Testimonial.find(filter)
      .populate('branchId', 'name code')
      .sort({ rating: -1, createdAt: -1 });

    res.status(200).json({ success: true, data: testimonials });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, data: testimonial });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!testimonial) {
      res.status(404).json({ success: false, message: 'Testimonial not found' });
      return;
    }
    res.status(200).json({ success: true, data: testimonial });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!testimonial) {
      res.status(404).json({ success: false, message: 'Testimonial not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
