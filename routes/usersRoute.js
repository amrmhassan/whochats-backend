import { Router } from 'express';
import multer from 'multer';
import * as userController from '../controllers/userController.js';
import * as auth from '../controllers/auth.js';

const router = Router();
const upload = multer({ dest: '../../uploads/users' });

//? routes for anyone
router.route('/signup').post(auth.signUp);
router.route('/login').post(auth.login);
router.route('/loginWithToken').post(auth.loginWithToken);
router.post('/forgotPassword', auth.forgotPassword);
router.post('/resetPassword/:token', auth.resetPassword);

//? routes for logged in users only
router.use(auth.protectNormalUser);
router.post('/updatePassword', auth.updatePassword);
router.get('/me', auth.getMe);
router.get('/getUserData/:id', userController.userGetAnotherUserData);

//? routes for admins only
router.use(auth.restrictTo('admin'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.addNewUser);
router.route('/:id').patch(userController.updateUser);

export default router;
