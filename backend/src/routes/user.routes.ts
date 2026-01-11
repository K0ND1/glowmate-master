import { Router } from 'express';
import { getMe, updateMe, deleteMe, getSkincareRoutine, updateSkincareRoutine } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken); // All user routes require authentication

router.get('/me', getMe);
router.put('/me', updateMe);
router.delete('/me', deleteMe);
router.get('/me/skincare-routine', getSkincareRoutine);
router.put('/me/skincare-routine', updateSkincareRoutine);


export default router;
