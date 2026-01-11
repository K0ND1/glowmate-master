import type { Request, Response } from 'express';
import prisma from '../db/prisma';
import crypto from 'node:crypto';
import { sendWaitlistVerificationEmail } from '../services/email.service';

export const joinWaitlist = async (req: Request, res: Response) => {
    try {
        const { email, referredBy } = req.body;

        if (!email) {
            res.status(400).json({
                code: 'VALIDATION_ERROR',
                message: 'Email is required'
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({
                code: 'VALIDATION_ERROR',
                message: 'Invalid email address'
            });
            return;
        }

        // Check if already in waitlist
        const existing = await prisma.waitlist.findUnique({
            where: { email }
        });

        if (existing) {
            // Get current position
            const position = await prisma.waitlist.count({
                where: {
                    OR: [
                        { points: { gt: existing.points } },
                        {
                            points: existing.points,
                            createdAt: { lt: existing.createdAt }
                        }
                    ]
                }
            }) + 1;

            if (!existing.isVerified) {
                let token = existing.verificationToken;

                // Ensure token exists
                if (!token) {
                    token = crypto.randomUUID();
                    await prisma.waitlist.update({
                        where: { id: existing.id },
                        data: { verificationToken: token }
                    });
                }

                // Resend verification email
                try {
                    await sendWaitlistVerificationEmail(email, token);
                    console.log(`Resent verification email to ${email}`);
                } catch (emailError) {
                    console.error("Failed to resend verification email", emailError);
                }

                res.status(200).json({
                    message: 'You are already on the waitlist. A new verification email has been sent.',
                    data: {
                        position,
                        referralCode: existing.referralCode,
                        points: existing.points,
                        isVerified: false
                    }
                });
                return;
            }

            res.status(200).json({
                message: 'You are already on the waitlist.',
                data: {
                    position,
                    referralCode: existing.referralCode,
                    points: existing.points,
                    isVerified: existing.isVerified
                }
            });
            return;
        }

        // Generate unique referral code
        // Simple strategy: email prefix + random string
        const prefix = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').slice(0, 6);
        const random = Math.random().toString(36).substring(2, 6);
        const referralCode = `${prefix}-${random}`.toLowerCase();

        // Calculate initial points
        let points = 0;
        let validReferrerId: string | undefined = undefined;

        if (referredBy) {
            const referrer = await prisma.waitlist.findUnique({
                where: { referralCode: referredBy }
            });

            if (referrer) {
                // Award points to referrer
                await prisma.waitlist.update({
                    where: { id: referrer.id },
                    data: { points: { increment: 10 } }
                });
                points = 0; // New user starts with 0
                validReferrerId = referrer.referralCode;
            }
        }

        const verificationToken = crypto.randomUUID();

        const newEntry = await prisma.waitlist.create({
            data: {
                email,
                referralCode,
                referredBy: validReferrerId,
                points,
                isVerified: false,
                verificationToken
            }
        });

        // Send verification email
        // We do not await this to not block response? Or we should to ensure it sends?
        // Let's await it to be safe for now, or fire and forget. 
        // Await is safer for feedback loop.
        try {
            await sendWaitlistVerificationEmail(email, verificationToken);
        } catch (emailError) {
            console.error("Failed to send verification email", emailError);
            // We still continue as user is created
        }

        // Calculate position
        const position = await prisma.waitlist.count({
            where: {
                OR: [
                    { points: { gt: newEntry.points } },
                    {
                        points: newEntry.points,
                        createdAt: { lt: newEntry.createdAt }
                    }
                ]
            }
        }) + 1;

        res.status(201).json({
            message: 'Successfully joined the waitlist. Please check your email to verify.',
            data: {
                position,
                referralCode: newEntry.referralCode,
                points: newEntry.points
            }
        });

    } catch (error) {
        console.error('Waitlist error:', error);
        res.status(500).json({
            code: 'INTERNAL_ERROR',
            message: 'Internal server error'
        });
    }
};

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;

        if (!token) {
            res.status(400).json({ message: 'Token is required' });
            return;
        }

        const entry = await prisma.waitlist.findUnique({
            where: { verificationToken: token }
        });

        if (!entry) {
            res.status(400).json({ message: 'Invalid or expired token' });
            return;
        }

        await prisma.waitlist.update({
            where: { id: entry.id },
            data: {
                isVerified: true,
                verificationToken: null // Consume token
            }
        });

        res.status(200).json({ message: 'Email verified successfully!' });

    } catch (error) {
        console.error('Verify error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
