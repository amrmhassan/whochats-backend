import { Router } from 'express';
import * as auth from '../controllers/auth.js';
import * as roomController from '../controllers/roomsController.js';
const router = Router();

//? routes for logged in users
router.use(auth.protectNormalUser);
router.route('/getMyRooms').get(roomController.getMyRooms);
router.route('/createNewRoom').post(roomController.createRoom);
router.route('/acceptRoom').post(roomController.acceptRoom);

router.route('/:id').get(roomController.getOneRoom);
router.route('/:id').delete(roomController.deleteChat);

export default router;
