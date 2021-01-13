import * as auth from '../controllers/auth.js';
import * as messagesController from '../controllers/messagesController.js';
import express from 'express';

const router = express.Router();

//? this router will only be used for logged in users
router.use(auth.protectNormalUser);

router.route('/getRoomMessages/:id').get(messagesController.getRoomMessages);
router.route('/createMessage').post(messagesController.createMessage);

export default router;
