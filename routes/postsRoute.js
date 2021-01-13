import { Router } from 'express';
const router = Router();
import '../controllers/postsController.js';
import * as postsController from '../controllers/postsController.js';
import * as auth from '../controllers/auth.js';

router
  .route('/')
  .get(
    auth.protectNormalUser,
    auth.restrictTo('admin'),
    postsController.getPosts
  )
  .post(auth.protectNormalUser, postsController.createPost);

export default router;
