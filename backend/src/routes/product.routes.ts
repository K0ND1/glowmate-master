import { Router } from 'express';
import type { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware.js';
import prisma from '../lib/prisma.js';

const router = Router();

// GET /v1/products - Get all products
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, search, category } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    interface ProductWhereInput {
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' };
        brand?: { contains: string; mode: 'insensitive' };
      }>;
      category?: string;
    }

    const where: ProductWhereInput = {};
    
    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (category && typeof category === 'string') {
      where.category = category;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          brand: true,
          category: true,
          imageUrl: true,
          price: true,
          averageRating: true,
          reviewCount: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  })
);

// GET /v1/products/:id - Get product by ID
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Product not found',
      });
    }

    res.json(product);
  })
);

export default router;
