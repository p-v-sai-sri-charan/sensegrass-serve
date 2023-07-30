import { Router } from 'express';
import { getUser, updateUser } from '../controllers/userController.js';

const router = Router();

router.get('/me', getUser);
router.put('/me', updateUser);

export default router;