import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../db/prisma';
import { getAiProductAdvice } from '../services/ai.service';

// POST /ai/analyze-routine
export const analyzeRoutine = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { productBarcodes } = req.body;

        if (!Array.isArray(productBarcodes)) {
            res.status(400).json({ code: 'VALIDATION_ERROR', message: 'productBarcodes must be an array' });
            return;
        }

        // Fetch products
        const products = await prisma.product.findMany({
            where: {
                barcode: { in: productBarcodes }
            }
        });

        // Mock AI analysis
        const analysis = {
            overallScore: 85,
            strengths: [
                'Good hydration coverage with multiple humectants',
                'Balanced actives for anti-aging',
                'No conflicting ingredients detected'
            ],
            concerns: [
                'Consider adding a dedicated sunscreen for daytime',
                'Retinol and AHA should not be used together in the same routine'
            ],
            recommendations: [
                'Move AHA exfoliant to evening routine only',
                'Add a broad-spectrum SPF 30+ product for morning'
            ],
            ingredientInteractions: {
                positive: ['Niacinamide + Hyaluronic Acid'],
                negative: ['Retinol + AHA (use separately)']
            }
        };

        // Save analysis to database
        await prisma.aiAnalysis.create({
            data: {
                userId,
                analysisType: 'routine',
                inputData: { productBarcodes },
                result: analysis
            }
        });

        res.status(200).json(analysis);

    } catch (error) {
        console.error('AI analysis error:', error);
        res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Internal server error' });
    }
};

// POST /ai/ask-product
export const askProductQuestion = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { productId, question } = req.body;

        if (!productId || typeof productId !== 'string' || !question || typeof question !== 'string') {
            res.status(400).json({ code: 'VALIDATION_ERROR', message: 'productId and question are required strings.' });
            return;
        }

        // 1. Fetch user and product data in parallel
        const [user, product] = await Promise.all([
            prisma.user.findUnique({
                where: { id: userId },
            }),
            prisma.product.findUnique({
                where: { id: productId },
                include: { ingredients: true } // Include ingredients for the AI prompt
            })
        ]);

        if (!user) {
            return res.status(404).json({ code: 'NOT_FOUND', message: 'Authenticated user not found.' });
        }
        if (!product) {
            return res.status(404).json({ code: 'NOT_FOUND', message: 'Product not found.' });
        }

        // 2. Get advice from the AI service
        const advice = await getAiProductAdvice(product, user, question);

        // 3. Save the analysis for future reference
        await prisma.aiAnalysis.create({
            data: {
                userId,
                analysisType: 'product_question',
                inputData: { productId, question },
                result: { answer: advice },
            }
        });

        // 4. Return the response
        res.status(200).json({ answer: advice });

    } catch (error: any) {
        console.error('AI product question error:', error);
        res.status(500).json({ code: 'INTERNAL_ERROR', message: error.message || 'Internal server error' });
    }
};
