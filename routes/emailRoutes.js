import express from 'express';
import * as emailController from '../controllers/emailController.js';

const router = express.Router();

router.route('/getEmails').get(emailController.getEmails);
router.route('/getEmail/:email').get(emailController.getEmailsForUser);
// router.route('/sendEmail').post(emailController.sendEmail);

export default router;
