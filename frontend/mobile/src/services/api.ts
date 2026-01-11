import { storage } from './storage';

// In Android Emulator, localhost is 10.0.2.2.
// In iOS Simulator, it's localhost.
// Real device: Use your machine's IP.
const API_URL = 'http://10.0.2.2:3000/v1';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
    method?: RequestMethod;
    body?: any;
    headers?: Record<string, string>;
    requiresAuth?: boolean;
}

/**
 * Generic API Client
 */
export const api = {
    async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const { method = 'GET', body, headers = {}, requiresAuth = true } = options;

        const finalHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
            ...headers,
        };

        if (requiresAuth) {
            const token = await storage.getToken();
            if (token) {
                finalHeaders['Authorization'] = `Bearer ${token}`;
            }
        }

        const config: RequestInit = {
            method,
            headers: finalHeaders,
            body: body ? JSON.stringify(body) : undefined,
        };

        console.log(`API Request: ${method} ${API_URL}${endpoint}`);

        try {
            const response = await fetch(`${API_URL}${endpoint}`, config);

            const contentType = response.headers.get('content-type');
            let data;
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
            }

            console.log('API Success:', endpoint, data);
            return data as T;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    get<T>(endpoint: string, requiresAuth = true) {
        return this.request<T>(endpoint, { method: 'GET', requiresAuth });
    },

    post<T>(endpoint: string, body: any, requiresAuth = true) {
        return this.request<T>(endpoint, { method: 'POST', body, requiresAuth });
    },
};
