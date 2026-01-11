import type { Request, Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../db/prisma';

// GET /users/me/reviews
export const getMyReviews = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;

        const reviews = await prisma.review.findMany({
            where: { userId },
            include: {
                product: {
                    select: {
                        id: true,
                        barcode: true,
                        name: true,
                        brand: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json(reviews);

    } catch (error) {
        console.error('Get my reviews error:', error);
        res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Internal server error' });
    }
};

// GET /products/{barcode}/reviews
export const getProductReviews = async (req: Request, res: Response) => {
    try {
        const { barcode } = req.params;
        const { limit = '20', offset = '0' } = req.query;

        const product = await prisma.product.findUnique({
            where: { barcode }
        });

        if (!product) {
            res.status(404).json({ code: 'NOT_FOUND', message: 'Product not found' });
            return;
        }

        const [reviews, total] = await prisma.$transaction([
            prisma.review.findMany({
                where: { productId: product.id },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                take: parseInt(limit as string),
                skip: parseInt(offset as string)
            }),
            prisma.review.count({ where: { productId: product.id } })
        ]);

        res.status(200).json({
            reviews,
            total
        });

    } catch (error) {
        console.error('Get product reviews error:', error);
        res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Internal server error' });
    }
};

// POST /products/{barcode}/reviews
export const createReview = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { barcode } = req.params;
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Rating must be between 1 and 5' });
            return;
        }

        const product = await prisma.product.findUnique({
            where: { barcode }
        });

        if (!product) {
            res.status(404).json({ code: 'NOT_FOUND', message: 'Product not found' });
            return;
        }

        // Check if user already reviewed this product
        const existing = await prisma.review.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId: product.id
                }
            }
        });

        if (existing) {
            res.status(409).json({ code: 'DUPLICATE_REVIEW', message: 'You have already reviewed this product' });
            return;
        }

        const review = await prisma.review.create({
            data: {
                userId,
                productId: product.id,
                rating,
                comment
            }
        });

        // Update product average rating
        const { _avg } = await prisma.review.aggregate({
            where: { productId: product.id },
            _avg: { rating: true }
        });

        const reviewCount = await prisma.review.count({
            where: { productId: product.id }
        });

        await prisma.product.update({
            where: { id: product.id },
            data: {
                averageRating: _avg.rating || 0,
                reviewCount
            }
        });

        res.status(201).json(review);

    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Internal server error' });
    }
};

// PUT /reviews/{reviewId}
export const updateReview = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { reviewId } = req.params;
        const { rating, comment } = req.body;

        const review = await prisma.review.findUnique({
            where: { id: reviewId }
        });

        if (!review) {
            res.status(404).json({ code: 'NOT_FOUND', message: 'Review not found' });
            return;
        }

        if (review.userId !== userId) {
            res.status(403).json({ code: 'FORBIDDEN', message: 'You can only edit your own reviews' });
            return;
        }

        if (rating && (rating < 1 || rating > 5)) {
            res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Rating must be between 1 and 5' });
            return;
        }

        const updated = await prisma.review.update({
            where: { id: reviewId },
            data: {
                rating: rating !== undefined ? rating : review.rating,
                comment: comment !== undefined ? comment : review.comment
            }
        });

        // Recalculate product average rating
        const { _avg } = await prisma.review.aggregate({
            where: { productId: review.productId },
            _avg: { rating: true }
        });

        await prisma.product.update({
            where: { id: review.productId },
            data: {
                averageRating: _avg.rating || 0
            }
        });

        res.status(200).json(updated);

    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Internal server error' });
    }
};

// DELETE /reviews/{reviewId}
export const deleteReview = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { reviewId } = req.params;

        const review = await prisma.review.findUnique({
            where: { id: reviewId }
        });

        if (!review) {
            res.status(404).json({ code: 'NOT_FOUND', message: 'Review not found' });
            return;
        }

        if (review.userId !== userId) {
            res.status(403).json({ code: 'FORBIDDEN', message: 'You can only delete your own reviews' });
            return;
        }

        await prisma.review.delete({
            where: { id: reviewId }
        });

        // Recalculate product stats
        const { _avg } = await prisma.review.aggregate({
            where: { productId: review.productId },
            _avg: { rating: true }
        });

        const reviewCount = await prisma.review.count({
            where: { productId: review.productId }
        });

        await prisma.product.update({
            where: { id: review.productId },
            data: {
                averageRating: _avg.rating || 0,
                reviewCount
            }
        });

        res.status(204).send();

    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Internal server error' });
    }
};
