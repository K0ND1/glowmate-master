import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../db/prisma';

// GET /users/me
export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user || user.deletedAt) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const skinProfileData = user.skinProfile as any || {};

        res.status(200).json({
            id: user.id,
            email: user.email,
            name: user.name,
            age: user.age || 0,
            skinType: skinProfileData.skinType || 'normal',
            skinConditions: skinProfileData.skinConditions || [],
            allergens: skinProfileData.allergens || [],
            isPremium: user.isPremium,
            createdAt: user.createdAt
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Internal server error' });
    }
};

// PUT /users/me
export const updateMe = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { name, age, skinType, skinConditions, allergens } = req.body;

        // Validation
        if (name && (name.length < 1 || name.length > 100)) {
            res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Name must be between 1 and 100 characters' });
            return;
        }
        if (age !== undefined && (!Number.isInteger(age) || age < 13 || age > 120)) {
            res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Age must be an integer between 13 and 120' });
            return;
        }
        const validSkinTypes = ['normal', 'dry', 'oily', 'combination', 'sensitive', 'mature'];
        if (skinType && !validSkinTypes.includes(skinType)) {
            res.status(400).json({ code: 'VALIDATION_ERROR', message: `SkinType must be one of: ${validSkinTypes.join(', ')}` });
            return;
        }

        // Prepare update data
        const updateData: any = {};
        if (name) updateData.name = name;
        if (age !== undefined) updateData.age = age;

        // Handle skin profile updates
        if (skinType || skinConditions || allergens) {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            const currentProfile = user?.skinProfile as any || {};

            updateData.skinProfile = {
                skinType: skinType || currentProfile.skinType,
                skinConditions: skinConditions || currentProfile.skinConditions || [],
                allergens: allergens || currentProfile.allergens || []
            };
        }

        await prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        res.status(200).json({ message: 'Profile updated.' });
    } catch (error) {
        console.error('Update me error:', error);
        res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Internal server error' });
    }
};

// DELETE /users/me
export const deleteMe = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;

        // Soft delete
        await prisma.user.update({
            where: { id: userId },
            data: { deletedAt: new Date() }
        });

        res.status(204).send();
    } catch (error) {
        console.error('Delete me error:', error);
        res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Internal server error' });
    }
};

// GET /users/me/skincare-routine
export const getSkincareRoutine = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;

        const routines = await prisma.skincareRoutine.findMany({
            where: { userId },
            orderBy: { orderIndex: 'asc' }
        });

        const morning = routines
            .filter(r => r.timeOfDay === 'morning')
            .map(r => r.productId);

        const evening = routines
            .filter(r => r.timeOfDay === 'evening')
            .map(r => r.productId);

        res.status(200).json({ morning, evening });
    } catch (error) {
        console.error('Get routine error:', error);
        res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Internal server error' });
    }
};

// PUT /users/me/skincare-routine
export const updateSkincareRoutine = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { morning, evening } = req.body;

        if (!Array.isArray(morning) || !Array.isArray(evening)) {
            res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Morning and evening must be arrays of product IDs' });
            return;
        }

        if (morning.length > 20 || evening.length > 20) {
            res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Maximum 20 items per routine' });
            return;
        }

        // Transaction to replace routines
        await prisma.$transaction(async (tx) => {
            // Delete existing routines
            await tx.skincareRoutine.deleteMany({
                where: { userId }
            });

            // Insert morning routine
            if (morning.length > 0) {
                await tx.skincareRoutine.createMany({
                    data: morning.map((productId, index) => ({
                        userId,
                        productId,
                        timeOfDay: 'morning',
                        orderIndex: index
                    }))
                });
            }

            // Insert evening routine
            if (evening.length > 0) {
                await tx.skincareRoutine.createMany({
                    data: evening.map((productId, index) => ({
                        userId,
                        productId,
                        timeOfDay: 'evening',
                        orderIndex: index
                    }))
                });
            }
        });

        res.status(200).json({ message: 'Routine updated.' });
    } catch (error) {
        console.error('Update routine error:', error);
        // Check for foreign key constraint (invalid product ID)
        if ((error as any).code === 'P2003') {
            res.status(400).json({ code: 'VALIDATION_ERROR', message: 'One or more product IDs are invalid' });
            return;
        }
        res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Internal server error' });
    }
};
