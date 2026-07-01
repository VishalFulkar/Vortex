import { create } from 'zustand';
import api from '../services/api';

const useFolderStore = create((set, get) => ({
    folders: [],
    isLoading: false,
    
    // Fetch folders
    fetchFolders: async (parentId = null) => {
        set({ isLoading: true });
        try {
            const params = parentId ? { parentId } : {};
            const res = await api.get('/folder', { params });
            if (res.data?.success) {
                set({ folders: res.data.folders });
            } else {
                set({ folders: [] });
            }
        } catch (err) {
            console.error('fetchFolders error:', err);
            set({ folders: [] });
        } finally {
            set({ isLoading: false });
        }
    },
    
    // Create new folder
    createFolder: async (name, parentId = null) => {
        try {
            const payload = { name };
            if (parentId) payload.parentId = parentId;
            
            const res = await api.post('/folder', payload);
            if (res.data?.success) {
                await get().fetchFolders(parentId); // Re-fetch current directory
                return { success: true };
            }
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Folder creation failed' };
        }
        return { success: false, error: 'Unknown error occurred' };
    },
    
    // Move folder to a different parent
    moveFolder: async (folderId, newParentId, currentParentId = null) => {
        try {
            const res = await api.patch(`/folder/${folderId}/move`, { parentId: newParentId });
            if (res.data?.success) {
                await get().fetchFolders(currentParentId);
                return { success: true };
            }
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Failed to move folder' };
        }
        return { success: false, error: 'Unknown error occurred' };
    },
    
    // Delete folder
    deleteFolder: async (folderId, currentParentId = null) => {
        try {
            const res = await api.delete(`/folder/${folderId}`);
            if (res.data?.success) {
                await get().fetchFolders(currentParentId);
                return { success: true };
            }
        } catch (err) {
            return { success: false, error: 'Failed to delete folder' };
        }
        return { success: false, error: 'Unknown error occurred' };
    },
    
    // Rename folder
    renameFolder: async (folderId, newName, currentParentId = null) => {
        try {
            const res = await api.put(`/folder/${folderId}/rename`, { name: newName });
            if (res.data?.success) {
                await get().fetchFolders(currentParentId);
                return { success: true };
            }
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Rename failed' };
        }
        return { success: false, error: 'Unknown error occurred' };
    }
}));

export default useFolderStore;
