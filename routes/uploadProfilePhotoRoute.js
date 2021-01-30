import express from 'express';
import MulterConfig from '../utils/MulterConfig.js';

const router = express.Router();
const mc = new MulterConfig(
  'image',
  'uploads/images/profile_photos/',
  'Images Only'
);

router.post(
  '/',
  mc.upload().single('photo'),
  mc.resizeImage,
  (req, res, next) => {
    res.status(200).json({
      status: 'success',
      path: `${req.protocol}://${req.get('host')}/${req.file.path}`,
    });
  }
);

export default router;
