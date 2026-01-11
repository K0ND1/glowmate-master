import { Router } from 'express';
import { joinWaitlist, verifyEmail } from '../controllers/waitlist.controller';

import rateLimit from 'express-rate-limit';

const router = Router();

const aggressiveLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 requests per windowMs
    message: 'Too many requests from this IP, please try again after an hour',
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/', aggressiveLimiter, joinWaitlist);
router.post('/verify', verifyEmail);

export default router;
