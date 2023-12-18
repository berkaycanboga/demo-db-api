import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createAd = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { product_id, title, content, image_url } = req.body;
    if (!product_id || !title || !content) {
      throw new Error('Invalid or missing fields for ad creation');
    }

    const newAd = await prisma.ad.create({
      data: { product_id, title, content, image_url },
    });

    res.json(newAd);
  } catch (error) {
    next(error);
  }
};

const getAllAds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ads = await prisma.ad.findMany();
    res.json(ads);
  } catch (error) {
    next(error);
  }
};

const getAdById = async (req: Request, res: Response, next: NextFunction) => {
  const { adId } = req.params;
  try {
    if (!adId || isNaN(parseInt(adId))) {
      throw new Error('Invalid or missing Ad ID for fetching an ad');
    }

    const ad = await prisma.ad.findUnique({
      where: { id: parseInt(adId) },
    });

    if (!ad) {
      throw new Error(`Ad with ID ${adId} not found`);
    }

    res.json(ad);
  } catch (error) {
    next(error);
  }
};

const updateAdById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { adId } = req.params;
  const { product_id, title, content, image_url } = req.body;

  try {
    if (!adId || isNaN(parseInt(adId)) || !product_id || !title || !content) {
      throw new Error('Invalid or missing fields for updating an ad');
    }

    const updatedAd = await prisma.ad.update({
      where: { id: parseInt(adId) },
      data: { product_id, title, content, image_url },
    });

    res.json(updatedAd);
  } catch (error) {
    next(error);
  }
};

const deleteAdById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { adId } = req.params;
  try {
    if (!adId || isNaN(parseInt(adId))) {
      throw new Error('Invalid or missing Ad ID for deleting an ad');
    }

    await prisma.ad.delete({
      where: { id: parseInt(adId) },
    });

    res.json({ message: 'Ad deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export { createAd, getAllAds, getAdById, updateAdById, deleteAdById };
