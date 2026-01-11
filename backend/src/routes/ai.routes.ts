import { Router } from 'express';
import { analyzeRoutine, askProductQuestion } from '../controllers/ai.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/analyze-routine', authenticateToken, analyzeRoutine);
router.post('/ask-product', authenticateToken, askProductQuestion);

export default router;
