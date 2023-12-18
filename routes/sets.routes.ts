import express from 'express';
import {
  createSet,
  getAllSets,
  getSetById,
  updateSetById,
  deleteSetById,
} from '../controllers/sets.controller';

const router = express.Router();

router.post('/api/v1/sets', createSet);
router.get('/api/v1/sets', getAllSets);
router.get('/api/v1/sets/:setId', getSetById);
router.put('/api/v1/sets/:setId', updateSetById);
router.delete('/api/v1/sets/:setId', deleteSetById);

export default router;
