import type { Request, Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../db/prisma';
import { Prisma } from '@prisma/client';

// GET /products
export const getProducts = async (req: Request, res: Response) => {
    try {
        const {
            q,
            page = '1',
            limit = '20',
            sort = 'rating_desc',
            includeIngredients,
            excludeIngredients,
            tags,
            tagsLogic = 'any',
            minRating,
            minPrice,
            maxPrice,
            brand,
            category
        } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        // Build where clause
        const where: Prisma.ProductWhereInput = {};

        // Search query
        if (q) {
            where.OR = [
                { name: { contains: q as string, mode: 'insensitive' } },
                { brand: { contains: q as string, mode: 'insensitive' } }
            ];
        }

        // Brand filter
        if (brand) {
            where.brand = { equals: brand as string, mode: 'insensitive' };
        }

        // Category filter
        if (category) {
            where.category = { equals: category as string, mode: 'insensitive' };
        }

        // Price range
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = parseFloat(minPrice as string);
            if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
        }

        // Rating
        if (minRating) {
            where.averageRating = { gte: parseFloat(minRating as string) };
        }

        // Tags filtering
        if (tags) {
            const tagList = (tags as string).split(',').map(t => t.trim());
            if (tagsLogic === 'all') {
                where.AND = tagList.map(tag => ({
                    tags: { array_contains: tag }
                }));
            } else {
                // Prisma doesn't support OR for array_contains directly in the same way for JSON arrays easily in all versions,
                // but for JSONB in Postgres we can use array_contains.
                // However, "OR" logic for "contains any of these tags" in a JSON array is tricky with standard Prisma operators.
                // We might need raw query or multiple OR conditions if we assume tags structure.
                // For simplicity and standard Prisma usage with JSON, we'll use OR with multiple array_contains if possible,
                // or fallback to fetching and filtering in memory if the dataset is small (not recommended for prod).
                // Better approach for 'any':
                where.OR = tagList.map(tag => ({
                    tags: { array_contains: tag }
                }));
            }
        }

        // Ingredient filtering (JSON array)
        // This is complex with Prisma JSON filters.
        // includeIngredients (AND logic)
        if (includeIngredients) {
            const ingredients = (includeIngredients as string).split(',').map(i => i.trim());
            // We need to ensure ALL these ingredients are present.
            // We can add to the AND clause.
            const ingredientFilters = ingredients.map(ing => ({
                ingredients: { array_contains: ing } // Assuming ingredients is simple array of strings or objects? Schema says Json default "[]"
            }));

            if (where.AND) {
                if (Array.isArray(where.AND)) {
                    where.AND.push(...ingredientFilters);
                } else {
                    where.AND = [where.AND, ...ingredientFilters];
                }
            } else {
                where.AND = ingredientFilters;
            }
        }

        // excludeIngredients (NOT logic)
        if (excludeIngredients) {
            const ingredients = (excludeIngredients as string).split(',').map(i => i.trim());
            // We want to exclude products that contain ANY of these.
            // NOT { OR: [ { ingredients: contains: ing1 }, ... ] }
            where.NOT = ingredients.map(ing => ({
                ingredients: { array_contains: ing }
            }));
        }

        // Sorting
        let orderBy: Prisma.ProductOrderByWithRelationInput = {};
        switch (sort) {
            case 'price_asc': orderBy = { price: 'asc' }; break;
            case 'price_desc': orderBy = { price: 'desc' }; break;
            case 'rating_desc': orderBy = { averageRating: 'desc' }; break;
            case 'newest': orderBy = { createdAt: 'desc' }; break;
            default: orderBy = { averageRating: 'desc' };
        }

        const [products, total] = await prisma.$transaction([
            prisma.product.findMany({
                where,
                skip,
                take: limitNum,
                orderBy
            }),
            prisma.product.count({ where })
        ]);

        res.status(200).json({
            data: products,
            meta: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        });

    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Internal server error' });
    }
};

// POST /products
export const createProduct = async (req: AuthRequest, res: Response) => {
    try {
        const { name, brand, category, description, ingredients, tags, imageUrl, price, barcode } = req.body;

        if (!name) {
            res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Name is required' });
            return;
        }

        // Check barcode uniqueness
        if (barcode) {
            const existing = await prisma.product.findUnique({ where: { barcode } });
            if (existing) {
                res.status(409).json({ code: 'DUPLICATE_ENTRY', message: 'Product with this barcode already exists' });
                return;
            }
        }

        const product = await prisma.product.create({
            data: {
                name,
                brand,
                category,
                description,
                ingredients: ingredients || [],
                tags: tags || [],
                imageUrl,
                price,
                barcode
            }
        });

        res.status(201).json(product);

    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Internal server error' });
    }
};

// GET /products/for-me
export const getRecommendations = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const skinProfile = user.skinProfile as any || {};
        const { skinType, skinConditions = [], allergens = [] } = skinProfile;

        // Simple recommendation logic:
        // 1. Filter by skin type tags (if products are tagged with skin types)
        // 2. Exclude allergens
        // 3. Boost products with high rating

        const where: Prisma.ProductWhereInput = {
            AND: [
                // Exclude allergens
                ...allergens.map((allergen: string) => ({
                    NOT: { ingredients: { array_contains: allergen } }
                }))
            ]
        };

        // If we had tags for skin types, we would add them here.
        // For now, let's just return top rated products that don't contain allergens.

        const products = await prisma.product.findMany({
            where,
            take: 10,
            orderBy: { averageRating: 'desc' }
        });

        res.status(200).json(products);

    } catch (error) {
        console.error('Get recommendations error:', error);
        res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Internal server error' });
    }
};

// GET /products/{barcode}
export const getProductByBarcode = async (req: Request, res: Response) => {
    try {
        const { barcode } = req.params;

        let product = await prisma.product.findUnique({
            where: { barcode }
        });

        if (product) {
            res.status(200).json(product);
            return;
        }

        // Not found in DB, try OpenBeautyFacts
        console.log(`Product ${barcode} not found locally, fetching from OpenBeautyFacts...`);

        try {
            const obfResponse = await fetch(`https://world.openbeautyfacts.org/api/v2/product/${barcode}.json`);

            if (obfResponse.ok) {
                const data = await obfResponse.json();

                if (data.status === 1 && data.product) {
                    const p = data.product;

                    // Map fields
                    const name = p.product_name || p.product_name_en || 'Unknown Product';
                    const brand = p.brands || 'Unknown Brand';
                    const imageUrl = p.image_url || p.image_front_url || '';
                    const ingredientsText = p.ingredients_text || p.ingredients_text_en || '';
                    // Simple split for ingredients array
                    const ingredients = ingredientsText.split(',').map((i: string) => i.trim()).filter((i: string) => i.length > 0);

                    // Create new product
                    product = await prisma.product.create({
                        data: {
                            name,
                            brand,
                            barcode,
                            category: 'Uncategorized', // Default
                            description: 'Imported from OpenBeautyFacts',
                            imageUrl,
                            ingredients,
                            tags: p.categories_tags || [],
                            price: 0 // Unknown price
                        }
                    });

                    console.log(`Product ${barcode} created from external API`);
                    res.status(200).json(product);
                    return;
                }
            }
        } catch (apiError) {
            console.error('External API error:', apiError);
            // Fallthrough to 404
        }

        res.status(404).json({ code: 'NOT_FOUND', message: 'Product not found' });

    } catch (error) {
        console.error('Get product by barcode error:', error);
        res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Internal server error' });
    }
};
