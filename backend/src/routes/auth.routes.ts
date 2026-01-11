import { Router } from 'express';
import { register, login, forgotPassword, resetPassword, verifyEmail } from '../controllers/auth.controller';
import rateLimit from 'express-rate-limit';

const router = Router();

const authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit: 5, // Limit each IP to 5 requests per 15 minutes
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many login/register attempts. Please try again later.'
    }
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
// router.post('/logout', logout); // Removed
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify-email', verifyEmail);

export default router;
