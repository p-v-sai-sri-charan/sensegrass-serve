import { Router } from 'express';
import { requestOtp, login_post,  } from '../controllers/authController.js';

const router = Router();

router.post('/requestotp', requestOtp);
router.post('/login', login_post);

export default router;