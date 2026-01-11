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

/**
 * @swagger
 * /v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     description: Creates a new user account along with their detailed skin profile.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *               - age
 *               - skinType
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password (min 8 characters).
 *               name:
 *                 type: string
 *                 description: User's full name.
 *               age:
 *                  type: integer
 *                  description: User's age.
 *               skinType:
 *                  type: string
 *                  enum: [normal, dry, oily, combination, sensitive]
 *               skinConditions:
 *                  type: array
 *                  items:
 *                      type: string
 *               allergens:
 *                  type: array
 *                  items:
 *                      type: string
 *     responses:
 *       '201':
 *         description: User registered successfully. Returns a JWT token and user object.
 *       '400':
 *         description: Validation error (e.g., missing fields, invalid email).
 *       '409':
 *         description: Conflict (e.g., email already exists).
 */
router.post('/register', authLimiter, register);

/**
 * @swagger
 * /v1/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     description: Authenticates a user and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       '200':
 *         description: Successful login. Returns JWT token and user object.
 *       '401':
 *         description: Invalid credentials.
 */
router.post('/login', authLimiter, login);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify-email', verifyEmail);

export default router;
