import { Router } from 'express';
const router = Router();
import sendSMS from '../utils/sms.js';

router.route('/').get(async (req, res, next) => {
  await sendSMS(
    'HOW ARE YOU Bahaa! \n Please WhoChats website https://amh-whatapp-clone.herokuapp.com/',
    '+201159310252'
  );
  res.send('Message sent successfully');
});

export default router;
