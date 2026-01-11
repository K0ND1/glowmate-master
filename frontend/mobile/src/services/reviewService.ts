import { api } from './api';

export interface Review {
    id: string;
    userId: string;
    userName: string;
    items: string[]; // Barcode
    rating: number;
    comment: string;
    createdAt: string;
}

export const reviewService = {
    getProductReviews: async (barcode: string): Promise<Review[]> => {
        return api.get<Review[]>(`/products/${barcode}/reviews`);
    },

    createReview: async (barcode: string, rating: number, comment: string): Promise<Review> => {
        return api.post<Review>(`/products/${barcode}/reviews`, { rating, comment });
    },

    getMyReviews: async (): Promise<Review[]> => {
        return api.get<Review[]>('/me/reviews');
    }
};
