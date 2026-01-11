import { api } from './api';

export interface User {
    id: string;
    email: string;
    name: string;
    skin_type?: string;
    skin_concerns?: string[];
    is_premium?: boolean;
}

export interface RoutineStep {
    product_id: string;
    product_name: string; // for display
    step_number: number;
    notes?: string;
}

export interface SkincareRoutine {
    am: RoutineStep[];
    pm: RoutineStep[];
}

export const userService = {
    getProfile: () => {
        return api.get<User>('/users/me');
    },

    updateProfile: (data: Partial<User>) => {
        return api.request<User>('/users/me', { method: 'PUT', body: data });
    },

    getRoutine: () => {
        return api.get<SkincareRoutine>('/users/me/skincare-routine');
    },

    updateRoutine: (routine: SkincareRoutine) => {
        return api.request<SkincareRoutine>('/users/me/skincare-routine', { method: 'PUT', body: routine });
    }
};
