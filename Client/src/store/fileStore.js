import { create } from 'zustand';
import api from '../services/api';

const useFileStore = create((set, get) => ({
    files: [],
    trashedFiles: [],
    isLoading: false,
    
    // Fetch files (defaults to root if folderId is null)
    fetchFiles: async (folderId = null) => {
        set({ isLoading: true });
        try {
            const params = folderId ? { folderId } : {};
            const res = await api.get('/file', { params });
            if (res.data?.success) {
                set({ files: res.data.files });
            } else {
                set({ files: [] });
            }
        } catch (err) {
            console.error('fetchFiles error:', err);
            set({ files: [] });
        } finally {
            set({ isLoading: false });
        }
    },
    
    // Upload a new file
    uploadFile: async (file, folderId = null) => {
        const formData = new FormData();
        formData.append('file', file);
        if (folderId) formData.append('folderId', folderId);

        try {
            const res = await api.post('/file/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data?.success) {
                await get().fetchFiles(folderId); // Re-fetch current directory
                return { success: true };
            }
        } catch (err) {
            if (err.response?.status === 409) {
                return { success: false, error: `File already exists: ${err.response.data.existingFile?.name}` };
            }
            return { success: false, error: err.response?.data?.error || 'Upload failed' };
        }
        return { success: false, error: 'Unknown error occurred' };
    },
    
    // Move file to a different folder
    moveFile: async (fileId, newFolderId, currentFolderId) => {
        try {
            const res = await api.patch(`/file/${fileId}/move`, { folderId: newFolderId });
            if (res.data?.success) {
                await get().fetchFiles(currentFolderId);
                return { success: true };
            }
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Failed to move file' };
        }
        return { success: false, error: 'Unknown error occurred' };
    },
    
    // Move to trash
    deleteFile: async (fileId, currentFolderId) => {
        try {
            const res = await api.delete(`/file/${fileId}`);
            if (res.data?.success) {
                await get().fetchFiles(currentFolderId);
                return { success: true };
            }
        } catch (err) {
            return { success: false, error: 'Failed to delete file' };
        }
        return { success: false, error: 'Unknown error occurred' };
    },
    
    // Fetch trashed files
    fetchTrashedFiles: async () => {
        set({ isLoading: true });
        try {
            const res = await api.get('/file/trash');
            if (res.data?.success) {
                set({ trashedFiles: res.data.files });
            } else {
                set({ trashedFiles: [] });
            }
        } catch (err) {
            console.error('fetchTrashedFiles error:', err);
            set({ trashedFiles: [] });
        } finally {
            set({ isLoading: false });
        }
    },

    // Restore file
    restoreFile: async (fileId) => {
        try {
            const res = await api.patch(`/file/${fileId}/restore`);
            if (res.data?.success) {
                await get().fetchTrashedFiles();
                return { success: true };
            }
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Failed to restore file' };
        }
        return { success: false, error: 'Unknown error occurred' };
    },
    
    // Permanent Delete
    permanentDeleteFile: async (fileId) => {
        try {
            const res = await api.delete(`/file/${fileId}/permanent`);
            if (res.data?.success) {
                await get().fetchTrashedFiles();
                return { success: true };
            }
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Failed to permanently delete file' };
        }
        return { success: false, error: 'Unknown error occurred' };
    },

    // View file inline
    viewFile: async (fileId) => {
        const newTab = window.open('', '_blank');
        try {
            const res = await api.get(`/file/view/${fileId}`, { responseType: 'blob' });
            const contentType = res.headers['content-type'];
            const url = window.URL.createObjectURL(new Blob([res.data], { type: contentType }));
            newTab.location.href = url;
            return { success: true };
        } catch (err) {
            newTab.close();
            return { success: false, error: err.response?.data?.error || 'Failed to view file' };
        }
    },
    
    // Rename file
    renameFile: async (fileId, newName, currentFolderId) => {
        try {
            const res = await api.put(`/file/${fileId}/rename`, { name: newName });
            if (res.data?.success) {
                await get().fetchFiles(currentFolderId);
                return { success: true };
            }
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Rename failed' };
        }
        return { success: false, error: 'Unknown error occurred' };
    },
    
    // Share file
    shareFile: async (fileId, email, accessLevel) => {
        try {
            const res = await api.post(`/files/${fileId}/share`, { email, accessLevel });
            if (res.data?.success) {
                return { success: true };
            }
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Failed to share file' };
        }
        return { success: false, error: 'Unknown error occurred' };
    },
    
    // Download Blob
    downloadFile: async (fileId, filename) => {
        try {
            const response = await api.get(`/file/download/${fileId}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            return { success: true };
        } catch (err) {
            return { success: false, error: 'Download failed' };
        }
    }
}));

export default useFileStore;
