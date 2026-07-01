import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
    user: null,
    isLoading: false,
    isCheckingAuth: true,
    error: null,

    register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            set({
                user: data.user,
                isLoading: false
            });
            return { success: true };
        }
        catch (err) {
            const message = err.response?.data?.message || 'Registration failed';
            set({
                error: message,
                isLoading: false
            });
            return {
                success: false,
                message
            };
        }
    },

    login: async (email, password) => {
        set({
            isLoading: true,
            error: null
        });
        try {
            const { data } = await api.post('/auth/login', { email, password });
            set({
                user: data.user,
                isLoading: false
            });
            return { success: true };
        }
        catch (err) {
            const message = err.response?.data?.message || 'Login failed';
            set({
                error: message,
                isLoading: false
            });
            return {
                success: false,
                message
            };
        }
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
        } catch {
            // ignore — cookie will expire naturally
        } finally {
            set({ user: null, error: null });
        }
    },

    fetchUser: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const { data } = await api.get('/auth/me');
            set({ user: data.user, isCheckingAuth: false });
            return { success: true };
        } catch {
            // 401 = no valid session — not an error worth surfacing
            set({ user: null, isCheckingAuth: false });
            return { success: false };
        }
    },

    clearError: () => set({ error: null }),
}));

// Selectors
export const selectIsAuthenticated = (s) => !!s.user;
export const selectUser            = (s) => s.user;
export const selectAuthLoading     = (s) => s.isLoading;
export const selectAuthError       = (s) => s.error;

export default useAuthStore;