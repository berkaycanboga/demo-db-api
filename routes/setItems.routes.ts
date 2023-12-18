import express from 'express';
import {
  createSetItem,
  getAllSetItems,
  getSetItemById,
  updateSetItemById,
  deleteSetItemById,
} from '../controllers/setItems.controller';

const router = express.Router();

router.post('/api/v1/set_items', createSetItem);
router.get('/api/v1/set_items', getAllSetItems);
router.get('/api/v1/set_items/:setItemId', getSetItemById);
router.put('/api/v1/set_items/:setItemId', updateSetItemById);
router.delete('/api/v1/set_items/:setItemId', deleteSetItemById);

export default router;
