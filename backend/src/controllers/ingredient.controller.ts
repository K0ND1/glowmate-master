import type { Request, Response } from 'express';
import prisma from '../db/prisma';

// GET /ingredients/suggest
export const suggestIngredients = async (req: Request, res: Response) => {
    try {
        const { q, limit = '10' } = req.query;

        if (!q || typeof q !== 'string') {
            res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Query parameter "q" is required' });
            return;
        }

        const limitNum = Math.min(parseInt(limit as string), 20); // Max 20 suggestions

        const ingredients = await prisma.ingredient.findMany({
            where: {
                name: {
                    contains: q,
                    mode: 'insensitive'
                }
            },
            take: limitNum,
            select: {
                id: true,
                name: true,
                category: true
            },
            orderBy: {
                name: 'asc'
            }
        });

        res.status(200).json(ingredients);

    } catch (error) {
        console.error('Suggest ingredients error:', error);
        res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Internal server error' });
    }
};
