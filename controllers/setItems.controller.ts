import { NextFunction, Request, Response } from 'express';
import prisma from '../lib/db';
import { handlePagination } from '../middlewares/pagination';

const createSetItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { set_id, item_type, item_id } = req.body;
    if (!set_id || !item_type || !item_id) {
      throw new Error('Invalid or missing fields for set item creation');
    }

    const newSetItem = await prisma.setItem.create({
      data: { set_id, item_type, item_id },
    });

    res.json(newSetItem);
  } catch (error) {
    next(error);
  }
};

const getAllSetItems = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await handlePagination(req, res, next, async (options) => {
    const { cursor, limit, orderByField, orderByDirection } = options;

    const setItems = await prisma.setItem.findMany({
      cursor: cursor ? { id: Number(cursor) } : undefined,
      take: limit,
      orderBy: {
        [orderByField]: orderByDirection,
      },
    });

    return setItems;
  });
};

const getSetItemById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { setItemId } = req.params;
  try {
    if (!setItemId || isNaN(parseInt(setItemId))) {
      throw new Error('Invalid or missing Set Item ID for fetching a set item');
    }

    const setItem = await prisma.setItem.findUnique({
      where: { id: parseInt(setItemId) },
    });

    if (!setItem) {
      throw new Error(`Set Item with ID ${setItemId} not found`);
    }

    res.json(setItem);
  } catch (error) {
    next(error);
  }
};

const updateSetItemById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { setItemId } = req.params;
  const { set_id, item_type, item_id } = req.body;

  try {
    if (
      !setItemId ||
      isNaN(parseInt(setItemId)) ||
      !set_id ||
      !item_type ||
      !item_id
    ) {
      throw new Error('Invalid or missing fields for updating a set item');
    }

    const updatedSetItem = await prisma.setItem.update({
      where: { id: parseInt(setItemId) },
      data: { set_id, item_type, item_id },
    });

    res.json(updatedSetItem);
  } catch (error) {
    next(error);
  }
};

const deleteSetItemById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { setItemId } = req.params;
  try {
    if (!setItemId || isNaN(parseInt(setItemId))) {
      throw new Error('Invalid or missing Set Item ID for deleting a set item');
    }

    await prisma.setItem.delete({
      where: { id: parseInt(setItemId) },
    });

    res.json({ message: 'Set item deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export {
  createSetItem,
  getAllSetItems,
  getSetItemById,
  updateSetItemById,
  deleteSetItemById,
};
