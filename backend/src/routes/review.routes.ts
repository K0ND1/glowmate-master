import { Router } from 'express';
import { getMyReviews, getProductReviews, createReview, updateReview, deleteReview } from '../controllers/review.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// User's reviews
router.get('/me/reviews', authenticateToken, getMyReviews);

// Product reviews
router.get('/products/:barcode/reviews', getProductReviews);
router.post('/products/:barcode/reviews', authenticateToken, createReview);

// Individual review
router.put('/:reviewId', authenticateToken, updateReview);
router.delete('/:reviewId', authenticateToken, deleteReview);

export default router;
