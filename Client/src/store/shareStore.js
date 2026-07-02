import { create } from 'zustand';
import api from '../services/api';

const useShareStore = create((set, get) => ({
    sharedFiles: [],
    myShares: [],
    isLoading: false,
    error: null,

    fetchSharedFiles: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/files/shared-with-me');
            if (response.data.success) {
                set({ sharedFiles: response.data.files, isLoading: false });
                return { success: true };
            }
        } catch (error) {
            set({ 
                error: error.response?.data?.error || 'Failed to fetch shared files',
                isLoading: false
            });
            return { success: false, error: error.response?.data?.error };
        }
    },

    fetchMyShares: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/files/my-shares');
            if (response.data.success) {
                set({ myShares: response.data.files, isLoading: false });
                return { success: true };
            }
        } catch (error) {
            set({ 
                error: error.response?.data?.error || 'Failed to fetch your shares',
                isLoading: false
            });
            return { success: false, error: error.response?.data?.error };
        }
    },

    getFileShares: async (fileId) => {
        try {
            const response = await api.get(`/files/${fileId}/shares`);
            if (response.data.success) {
                return { success: true, shares: response.data.shares };
            }
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Failed to fetch file shares' };
        }
    },

    revokeShare: async (fileId, targetUserId) => {
        try {
            const response = await api.delete(`/files/${fileId}/share/${targetUserId}`);
            if (response.data.success) {
                // Filter out the revoked share from myShares
                set((state) => ({
                    myShares: state.myShares.filter(
                        (share) => !(share.id === fileId && share.target_user_id === targetUserId)
                    )
                }));
                return { success: true };
            }
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Failed to revoke access' };
        }
    },

    updateShareAccess: async (fileId, email, accessLevel) => {
        try {
            const response = await api.post(`/files/${fileId}/share`, { email, accessLevel });
            if (response.data.success) {
                // Update myShares local state
                set((state) => ({
                    myShares: state.myShares.map(share => 
                        (share.id === fileId && share.shared_with_email === email)
                            ? { ...share, access_level: accessLevel }
                            : share
                    )
                }));
                return { success: true };
            }
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Failed to update access level' };
        }
    }
}));

export default useShareStore;
