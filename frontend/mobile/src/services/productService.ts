import { api } from './api';

export interface Product {
    id: string;
    name: string;
    brand: string;
    barcode?: string;
    image_url?: string;
    ingredients?: string[];
    description?: string;
}

export const productService = {
    getAll: (query?: string) => {
        const queryString = query ? `?search=${encodeURIComponent(query)}` : '';
        return api.get<Product[]>(`/products${queryString}`);
    },

    getByBarcode: (barcode: string) => {
        return api.get<Product>(`/products/${barcode}`);
    },

    create: (data: Partial<Product>) => {
        return api.post<Product>('/products', data);
    },

    getRecommendations: () => {
        return api.get<Product[]>('/products/for-me');
    }
};
