import { NextFunction, Request, Response } from 'express';
import prisma from '../lib/db';
import { handlePagination } from '../middlewares/pagination';

const createSet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      throw new Error('Invalid or missing fields for set creation');
    }

    const newSet = await prisma.set.create({
      data: { name, description },
    });

    res.json(newSet);
  } catch (error) {
    next(error);
  }
};

const getAllSets = async (req: Request, res: Response, next: NextFunction) => {
  await handlePagination(req, res, next, async (options) => {
    const { cursor, limit, orderByField, orderByDirection } = options;

    const sets = await prisma.set.findMany({
      cursor: cursor ? { id: Number(cursor) } : undefined,
      take: limit,
      orderBy: {
        [orderByField]: orderByDirection,
      },
    });

    return sets;
  });
};

const getSetById = async (req: Request, res: Response, next: NextFunction) => {
  const { setId } = req.params;
  try {
    if (!setId || isNaN(parseInt(setId))) {
      throw new Error('Invalid or missing Set ID for fetching a set');
    }

    const set = await prisma.set.findUnique({
      where: { id: parseInt(setId) },
    });

    if (!set) {
      throw new Error(`Set with ID ${setId} not found`);
    }

    res.json(set);
  } catch (error) {
    next(error);
  }
};

const updateSetById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { setId } = req.params;
  const { name, description } = req.body;

  try {
    if (!setId || isNaN(parseInt(setId)) || !name || !description) {
      throw new Error('Invalid or missing fields for updating a set');
    }

    const updatedSet = await prisma.set.update({
      where: { id: parseInt(setId) },
      data: { name, description },
    });

    res.json(updatedSet);
  } catch (error) {
    next(error);
  }
};

const deleteSetById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { setId } = req.params;
  try {
    if (!setId || isNaN(parseInt(setId))) {
      throw new Error('Invalid or missing Set ID for deleting a set');
    }

    await prisma.set.delete({
      where: { id: parseInt(setId) },
    });

    res.json({ message: 'Set deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export { createSet, getAllSets, getSetById, updateSetById, deleteSetById };
