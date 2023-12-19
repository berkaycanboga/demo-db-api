import express from 'express';
import {
  createSetItem,
  getAllSetItems,
  getSetItemById,
  updateSetItemById,
  deleteSetItemById,
} from '../controllers/setItems.controller';

const router = express.Router();

router.post('/', createSetItem);
router.get('/', getAllSetItems);
router.get('/:setItemId', getSetItemById);
router.put('/:setItemId', updateSetItemById);
router.delete('/:setItemId', deleteSetItemById);

export default router;
