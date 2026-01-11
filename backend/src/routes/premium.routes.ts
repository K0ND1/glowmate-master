import { Router } from 'express';
import { subscribe } from '../controllers/premium.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/subscribe', authenticateToken, subscribe);

export default router;
