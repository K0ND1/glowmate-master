import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../db/prisma';

// POST /premium/subscribe
export const subscribe = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { tier, paymentMethod } = req.body;

        if (!tier || !['monthly', 'yearly'].includes(tier)) {
            res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Tier must be either "monthly" or "yearly"' });
            return;
        }

        // Mock payment processing
        // In a real app, integrate with Stripe, PayPal, etc.
        const premiumExpiresAt = new Date();
        premiumExpiresAt.setMonth(premiumExpiresAt.getMonth() + (tier === 'yearly' ? 12 : 1));

        await prisma.user.update({
            where: { id: userId },
            data: {
                isPremium: true,
                premiumExpiresAt
            }
        });

        res.status(200).json({
            message: 'Successfully subscribed to premium',
            tier,
            expiresAt: premiumExpiresAt
        });

    } catch (error) {
        console.error('Premium subscribe error:', error);
        res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Internal server error' });
    }
};
