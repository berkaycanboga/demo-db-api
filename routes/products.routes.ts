import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
} from '../controllers/products.controller';

const router = express.Router();

router.post('/api/v1/products', createProduct);
router.get('/api/v1/products', getAllProducts);
router.get('/api/v1/products/:productId', getProductById);
router.put('/api/v1/products/:productId', updateProductById);
router.delete('/api/v1/products/:productId', deleteProductById);

export default router;
