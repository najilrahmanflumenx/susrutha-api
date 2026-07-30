import { Request, Response } from 'express';
import NewsEvent from '../models/NewsEvent.model';
import Affiliation from '../models/Affiliation.model';

export const getNewsEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, status } = req.query;
    const filter: any = { isDeleted: false };
    if (status) filter.status = status;

    if (type === 'affiliations') {
      const affiliations = await Affiliation.find({ isDeleted: false }).sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: affiliations });
      return;
    }

    if (type && type !== 'ALL') filter.type = type;

    const items = await NewsEvent.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createNewsEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body.slug && req.body.title) {
      const base = req.body.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      req.body.slug = `${base}-${Date.now()}`;
    }
    // Normalize status
    if (req.body.status === 'ACTIVE') req.body.status = 'published';
    // Map articleUrl → externalLink (both stored)
    if (req.body.articleUrl && !req.body.externalLink) {
      req.body.externalLink = req.body.articleUrl;
    }
    if (req.body.externalLink && !req.body.articleUrl) {
      req.body.articleUrl = req.body.externalLink;
    }
    // summary is required, use title as fallback
    if (!req.body.summary && req.body.title) {
      req.body.summary = req.body.title;
    }
    const item = await NewsEvent.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateNewsEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.body.title && !req.body.slug) {
      req.body.slug = req.body.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (req.body.status === 'ACTIVE') req.body.status = 'published';
    // Sync articleUrl ↔ externalLink
    if (req.body.articleUrl && !req.body.externalLink) {
      req.body.externalLink = req.body.articleUrl;
    }
    if (req.body.externalLink && !req.body.articleUrl) {
      req.body.articleUrl = req.body.externalLink;
    }
    const item = await NewsEvent.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) {
      res.status(404).json({ success: false, message: 'News item not found' });
      return;
    }
    res.status(200).json({ success: true, data: item });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteNewsEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await NewsEvent.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!item) {
      res.status(404).json({ success: false, message: 'News item not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
