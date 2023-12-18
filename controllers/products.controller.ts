import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, price, description } = req.body;
    if (!name || typeof price !== 'number' || !description) {
      throw new Error('Invalid or missing fields for product creation');
    }

    const newProduct = await prisma.product.create({
      data: { name, price, description },
    });

    res.json(newProduct);
  } catch (error) {
    next(error);
  }
};

const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { productId } = req.params;
  try {
    if (!productId || isNaN(parseInt(productId))) {
      throw new Error('Invalid or missing Product ID for fetching a product');
    }

    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

const updateProductById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { productId } = req.params;
  const { name, price, description } = req.body;

  try {
    if (
      !productId ||
      isNaN(parseInt(productId)) ||
      !name ||
      typeof price !== 'number' ||
      !description
    ) {
      throw new Error('Invalid or missing fields for updating a product');
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(productId) },
      data: { name, price, description },
    });

    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

const deleteProductById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { productId } = req.params;
  try {
    if (!productId || isNaN(parseInt(productId))) {
      throw new Error('Invalid or missing Product ID for deleting a product');
    }

    const result = await prisma.product.delete({
      where: { id: parseInt(productId) },
    });

    console.log('Deletion Result:', result);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Deletion Error:', error);
    next(error);
  }
};

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};
