import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password must be at most 128 characters'),
    name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
    age: z.number().int().min(13, 'You must be at least 13 years old').max(120, 'Invalid age'),
    skinType: z.enum(['normal', 'dry', 'oily', 'combination', 'sensitive', 'mature'] as const, {
        message: 'Please select a valid skin type',
    }),
    skinConditions: z.array(z.string().max(50)).max(10).optional(),
    allergens: z.array(z.string().max(100)).max(20).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
