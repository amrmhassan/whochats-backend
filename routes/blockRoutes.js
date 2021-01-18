import * as auth from '../controllers/auth.js';
import * as blocksController from '../controllers/blocksController.js';
import express from 'express';

const router = express.Router();

//? this router will only be used for logged in users
router.use(auth.protectNormalUser);

router.route('/').post(blocksController.createBlock);
router.route('/deleteBlock').post(blocksController.deleteBlock);

export default router;
