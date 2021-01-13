import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import * as auth from '../controllers/auth.js';
const router = Router();

//? routes for anyone
router.route('/signup').post(auth.signUp);
router.route('/login').post(auth.login);
router.route('/loginWithToken').post(auth.loginWithToken);
router.post('/forgotPassword', auth.forgotPassword);
router.post('/resetPassword/:token', auth.resetPassword);

//? routes for logged in users only
router.use(auth.protectNormalUser);
router.post('/updatePassword', auth.protectNormalUser, auth.updatePassword);
router.get('/me', auth.protectNormalUser, auth.getMe);

//? routes for admins only
router.use(auth.restrictTo('admin'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.addNewUser);
router.route('/:id').patch(userController.updateUser);

export default router;
