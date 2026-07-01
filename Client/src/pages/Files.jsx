import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Navbar from '../components/Navbar';
import api from '../services/api';

// Presenter subcomponents
import FilesToolbar from '../components/files/FilesToolbar';
import FilesBreadcrumbs from '../components/files/FilesBreadcrumbs';
import FolderItem from '../components/files/FolderItem';
import FileItem from '../components/files/FileItem';
import CreateFolderModal from '../components/home/CreateFolderModal';
import ShareFileModal from '../components/home/ShareFileModal';
import RenameModal from '../components/files/RenameModal';

const Files = () => {
    const { user, isLoading } = useAuthStore();
    const navigate = useNavigate();

    // Data lists
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);

    // Navigation path state: array of { id, name }
    const [path, setPath] = useState([]);
    const activeFolderId = path.length > 0 ? path[path.length - 1].id : null;

    // UI state
    const [viewType, setViewType] = useState('grid'); // 'grid' | 'list'
    const [searchQuery, setSearchQuery] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [notification, setNotification] = useState(null);

    // Modal state
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    
    const [showShareModal, setShowShareModal] = useState(false);
    const [selectedShareFile, setSelectedShareFile] = useState('');
    const [shareEmail, setShareEmail] = useState('');
    const [shareAccess, setShareAccess] = useState('view');

    const [renameItem, setRenameItem] = useState(null); // { type: 'file' | 'folder', id, name }

    // Route Protection
    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/login');
        }
    }, [user, isLoading, navigate]);

    // Fetch files and folders under active folder ID
    const fetchFolderContents = async () => {
        if (!user) return;
        try {
            setPageLoading(true);
            const folderParams = activeFolderId ? { parentId: activeFolderId } : {};
            const fileParams = activeFolderId ? { folderId: activeFolderId } : {};

            const [foldersRes, filesRes] = await Promise.all([
                api.get('/folder', { params: folderParams }),
                api.get('/file', { params: fileParams })
            ]);

            if (foldersRes.data?.success) {
                setFolders(foldersRes.data.folders);
            } else {
                setFolders([]);
            }

            if (filesRes.data?.success) {
                setFiles(filesRes.data.files);
            } else {
                setFiles([]);
            }
        } catch (err) {
            console.error('Error fetching folder contents:', err);
            triggerToast('Failed to load files', 'error');
        } finally {
            setPageLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchFolderContents();
        }
    }, [user, activeFolderId]);

    // Toast triggers
    const triggerToast = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    // Traversals
    const handleFolderClick = (folder) => {
        setPath([...path, { id: folder.id, name: folder.name }]);
    };

    const handleBreadcrumbNavigate = (index) => {
        if (index === -1) {
            setPath([]);
        } else {
            setPath(path.slice(0, index + 1));
        }
    };

    // Upload
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        if (activeFolderId) {
            formData.append('folderId', activeFolderId);
        }

        setIsUploading(true);
        try {
            const res = await api.post('/file/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data?.success) {
                triggerToast('File uploaded successfully!');
                fetchFolderContents();
            }
        } catch (err) {
            const errMsg = err.response?.data?.error || 'Upload failed';
            triggerToast(errMsg, 'error');
        } finally {
            setIsUploading(false);
            e.target.value = null; // reset
        }
    };

    // Create Folder
    const handleCreateFolder = async (e) => {
        e.preventDefault();
        if (!newFolderName.trim()) return;

        try {
            const payload = { name: newFolderName };
            if (activeFolderId) {
                payload.parentId = activeFolderId;
            }

            const res = await api.post('/folder', payload);
            if (res.data?.success) {
                triggerToast(`Folder "${newFolderName}" created successfully!`);
                setNewFolderName('');
                setShowFolderModal(false);
                fetchFolderContents();
            }
        } catch (err) {
            triggerToast(err.response?.data?.error || 'Folder creation failed', 'error');
        }
    };

    // Share File
    const handleShareFile = async (e) => {
        e.preventDefault();
        if (!selectedShareFile || !shareEmail.trim()) return;

        try {
            const res = await api.post(`/files/${selectedShareFile}/share`, {
                email: shareEmail,
                accessLevel: shareAccess
            });
            if (res.data?.success) {
                triggerToast('File shared successfully!');
                setShareEmail('');
                setSelectedShareFile('');
                setShowShareModal(false);
            }
        } catch (err) {
            triggerToast(err.response?.data?.error || 'Failed to share file', 'error');
        }
    };

    // Download
    const handleDownload = async (fileId, filename) => {
        try {
            const response = await api.get(`/file/download/${fileId}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            triggerToast('Download started');
        } catch (err) {
            triggerToast('Download failed', 'error');
        }
    };

    // Delete folder or file
    const handleDeleteFolder = async (folderId) => {
        if (!window.confirm('Delete this folder and all its contents?')) return;
        try {
            const res = await api.delete(`/folder/${folderId}`);
            if (res.data?.success) {
                triggerToast('Folder deleted successfully');
                fetchFolderContents();
            }
        } catch (err) {
            triggerToast('Failed to delete folder', 'error');
        }
    };

    const handleDeleteFile = async (fileId) => {
        if (!window.confirm('Move this file to trash?')) return;
        try {
            const res = await api.delete(`/file/${fileId}`);
            if (res.data?.success) {
                triggerToast('File moved to trash');
                fetchFolderContents();
            }
        } catch (err) {
            triggerToast('Failed to delete file', 'error');
        }
    };

    // Rename submit handler
    const handleRenameSubmit = async (newName) => {
        if (!renameItem) return;
        try {
            const endpoint = renameItem.type === 'file' 
                ? `/file/${renameItem.id}/rename` 
                : `/folder/${renameItem.id}/rename`;
            
            const res = await api.put(endpoint, { name: newName });
            if (res.data?.success) {
                triggerToast('Item renamed successfully');
                setRenameItem(null);
                fetchFolderContents();
            }
        } catch (err) {
            triggerToast(err.response?.data?.error || 'Rename failed', 'error');
        }
    };

    // Client side filtering for search
    const filteredFolders = folders.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredFiles = files.filter(f => f.original_name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] flex flex-col justify-center items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black"></div>
                <span className="mt-3 text-sm text-gray-500 font-semibold select-none">Checking authorization...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col p-4 md:p-6 text-black select-none">
            <Navbar />

            {/* Notification Toast */}
            {notification && (
                <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border text-sm font-semibold transition-all ${
                    notification.type === 'error' 
                        ? 'bg-red-50 text-red-700 border-red-100' 
                        : 'bg-green-50 text-green-700 border-green-100'
                }`}>
                    <span>{notification.message}</span>
                </div>
            )}

            {/* Content Container */}
            <main className="w-full max-w-7xl mx-auto grow flex flex-col gap-5 mt-2">
                
                {/* Header Row */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-extrabold tracking-tight text-black">File Explorer</h1>
                    <FilesBreadcrumbs path={path} onNavigate={handleBreadcrumbNavigate} />
                </div>

                {/* Toolbar */}
                <FilesToolbar 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    viewType={viewType}
                    setViewType={setViewType}
                    onUploadClick={handleFileUpload}
                    onCreateFolderClick={() => setShowFolderModal(true)}
                    isUploading={isUploading}
                />

                {/* Items Grid/List Section */}
                <div className="grow">
                    {pageLoading ? (
                        <div className="flex flex-col items-center justify-center py-24">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
                            <span className="mt-2 text-xs text-gray-400 font-semibold">Loading contents...</span>
                        </div>
                    ) : filteredFolders.length === 0 && filteredFiles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-200 rounded-3xl bg-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5M5 19v-2a2 2 0 002-2h2a2 2 0 002-2V5m-6 0h4a2 2 0 012 2v2" />
                            </svg>
                            <span className="text-xs text-gray-400 font-bold">This folder is empty</span>
                        </div>
                    ) : (
                        <div className={viewType === 'grid' 
                            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 items-stretch"
                            : "flex flex-col gap-2.5"
                        }>
                            {/* Render Folders */}
                            {filteredFolders.map(folder => (
                                <FolderItem
                                    key={folder.id}
                                    folder={folder}
                                    onClick={() => handleFolderClick(folder)}
                                    onRename={(id, name) => setRenameItem({ type: 'folder', id, name })}
                                    onDelete={handleDeleteFolder}
                                    viewType={viewType}
                                />
                            ))}

                            {/* Render Files */}
                            {filteredFiles.map(file => (
                                <FileItem
                                    key={file.id}
                                    file={file}
                                    viewType={viewType}
                                    onDownload={handleDownload}
                                    onShare={(id) => {
                                        setSelectedShareFile(id);
                                        setShowShareModal(true);
                                    }}
                                    onRename={(id, name) => setRenameItem({ type: 'file', id, name })}
                                    onDelete={handleDeleteFile}
                                />
                            ))}
                        </div>
                    )}
                </div>

            </main>

            {/* Modals */}
            <CreateFolderModal 
                isOpen={showFolderModal}
                onClose={() => setShowFolderModal(false)}
                folderName={newFolderName}
                setFolderName={setNewFolderName}
                onSubmit={handleCreateFolder}
            />

            <ShareFileModal 
                isOpen={showShareModal}
                onClose={() => {
                    setShowShareModal(false);
                    setSelectedShareFile('');
                }}
                files={files}
                selectedFile={selectedShareFile}
                setSelectedFile={setSelectedShareFile}
                email={shareEmail}
                setEmail={setShareEmail}
                access={shareAccess}
                setAccess={setShareAccess}
                onSubmit={handleShareFile}
            />

            <RenameModal 
                isOpen={!!renameItem}
                onClose={() => setRenameItem(null)}
                currentName={renameItem?.name || ''}
                onSubmit={handleRenameSubmit}
            />
        </div>
    );
};

export default Files;
