import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';

/**
 * Storage service specifically for handling sensitive data.
 * Note: In a production environment with higher security requirements,
 * we should switch `AsyncStorage` to `react-native-encrypted-storage` or `react-native-keychain`.
 * For now, using AsyncStorage as the standard persistence layer.
 */
export const storage = {
    async setToken(token: string): Promise<void> {
        try {
            await AsyncStorage.setItem(TOKEN_KEY, token);
        } catch (error) {
            console.error('Error saving token', error);
            throw error;
        }
    },

    async getToken(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(TOKEN_KEY);
        } catch (error) {
            console.error('Error getting token', error);
            return null;
        }
    },

    async clearToken(): Promise<void> {
        try {
            await AsyncStorage.removeItem(TOKEN_KEY);
        } catch (error) {
            console.error('Error clearing token', error);
        }
    },
};
