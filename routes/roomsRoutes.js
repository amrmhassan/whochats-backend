import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import * as auth from '../controllers/auth.js';
import * as roomController from '../controllers/roomsController.js';
const router = Router();

//? routes for logged in users
router.use(auth.protectNormalUser);
router.route('/getMyRooms').get(roomController.getMyRooms);
router.route('/createNewRoom').post(roomController.createRoom);

export default router;
