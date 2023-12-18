import express from 'express';
import {
  createAd,
  getAllAds,
  getAdById,
  updateAdById,
  deleteAdById,
} from '../controllers/ads.controller';

const router = express.Router();

router.post('/api/v1/ads', createAd);
router.get('/api/v1/ads', getAllAds);
router.get('/api/v1/ads/:adId', getAdById);
router.put('/api/v1/ads/:adId', updateAdById);
router.delete('/api/v1/ads/:adId', deleteAdById);

export default router;
