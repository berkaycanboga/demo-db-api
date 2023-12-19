import express from 'express';
import {
  createAd,
  getAllAds,
  getAdById,
  updateAdById,
  deleteAdById,
} from '../controllers/ads.controller';

const router = express.Router();

router.post('/', createAd);
router.get('/', getAllAds);
router.get('/:adId', getAdById);
router.put('/:adId', updateAdById);
router.delete('/:adId', deleteAdById);

export default router;
