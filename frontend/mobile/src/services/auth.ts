import { api } from './api';
import { storage } from './storage';

export const authService = {
    async login(email: string, password: string): Promise<any> {
        const response = await api.post<{ token: string; user: any }>('/auth/login', { email, password }, false);
        console.log('DEBUG: Full Auth Response', response);
        console.log('DEBUG: Auth Response Type', typeof response);
        if (response && response.token) {
            await storage.setToken(response.token);
        }
        return response;
    },

    async register(email: string, password: string, confirmPassword: string): Promise<any> {
        // Backend typically expects email, password, confirmPassword
        return api.post('/auth/register', { email, password, confirmPassword }, false);
    },

    async logout(): Promise<void> {
        await storage.clearToken();
        // Optional: call backend logout if endpoint exists
    },
};
