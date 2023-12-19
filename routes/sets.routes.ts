import express from 'express';
import {
  createSet,
  getAllSets,
  getSetById,
  updateSetById,
  deleteSetById,
} from '../controllers/sets.controller';

const router = express.Router();

router.post('/', createSet);
router.get('/', getAllSets);
router.get('/:setId', getSetById);
router.put('/:setId', updateSetById);
router.delete('/:setId', deleteSetById);

export default router;
