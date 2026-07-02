import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useFileStore from '../store/fileStore';
import useFolderStore from '../store/folderStore';
import Navbar from '../components/Navbar';

import FilesToolbar from '../components/files/FilesToolbar';
import FilesBreadcrumbs from '../components/files/FilesBreadcrumbs';
import FolderItem from '../components/files/FolderItem';
import FileItem from '../components/files/FileItem';
import CreateFolderModal from '../components/home/CreateFolderModal';
import ShareFileModal from '../components/home/ShareFileModal';
import RenameModal from '../components/files/RenameModal';
import MoveModal from '../components/files/MoveModal';
import ConfirmModal from '../components/common/ConfirmModal';
import FileHistoryModal from '../components/files/FileHistoryModal';

const Files = () => {
  const { user } = useAuthStore();
  
  // Bind Zustand Stores
  const { files, isLoading: filesLoading, fetchFiles, uploadFile, deleteFile, renameFile, moveFile, shareFile, downloadFile, viewFile } = useFileStore();
  const { folders, isLoading: foldersLoading, fetchFolders, createFolder, deleteFolder, renameFolder, moveFolder } = useFolderStore();
  
  const pageLoading = filesLoading || foldersLoading;

  // Navigation
  const [path, setPath] = useState([]);
  const activeFolderId = path.length > 0 ? path[path.length - 1].id : null;

  // UI state
  const [viewType, setViewType] = useState('grid');
  
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const setSearchQuery = (val) => {
    if (val) {
      searchParams.set('q', val);
      setSearchParams(searchParams, { replace: true });
    } else {
      searchParams.delete('q');
      setSearchParams(searchParams, { replace: true });
    }
  };

  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Modals
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedShareFile, setSelectedShareFile] = useState(null);
  const [shareEmail, setShareEmail] = useState('');
  const [shareAccess, setShareAccess] = useState('view');

  const [renameItem, setRenameItem] = useState(null);
  const [moveItem, setMoveItem] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyFile, setHistoryFile] = useState(null);

  // Fetch data on mount or path change
  useEffect(() => {
    if (user) {
      fetchFiles(activeFolderId);
      fetchFolders(activeFolderId);
    }
  }, [user, activeFolderId, fetchFiles, fetchFolders]);

  const triggerToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleFolderClick = (folder) => {
    setPath(prev => [...prev, { id: folder.id, name: folder.name }]);
  };

  const handleBreadcrumbNavigate = (index) => {
    setPath(index === -1 ? [] : prev => prev.slice(0, index + 1));
  };

  // Mutator Wrappers consuming Zustand
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const res = await uploadFile(file, activeFolderId);
    setIsUploading(false);
    
    if (res.success) {
      triggerToast('File uploaded successfully!');
    } else {
      triggerToast(res.error, 'error');
    }
    e.target.value = null;
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const res = await createFolder(newFolderName, activeFolderId);
    if (res.success) {
      triggerToast(`Folder "${newFolderName}" created!`);
      setNewFolderName('');
      setShowFolderModal(false);
    } else {
      triggerToast(res.error, 'error');
    }
  };

  const handleShareFile = async (e) => {
    e.preventDefault();
    if (!selectedShareFile || !shareEmail.trim()) return;

    const res = await shareFile(selectedShareFile, shareEmail, shareAccess);
    if (res.success) {
      triggerToast('File shared successfully!');
      setShareEmail('');
      setSelectedShareFile(null);
      setShowShareModal(false);
    } else {
      triggerToast(res.error, 'error');
    }
  };

  const handleDownload = async (fileId, filename) => {
    const res = await downloadFile(fileId, filename);
    if (res.success) {
      triggerToast('Download started');
    } else {
      triggerToast(res.error, 'error');
    }
  };

  const handleView = async (id) => {
    const res = await viewFile(id);
    if (!res.success) {
      triggerToast(res.error || 'Failed to open file', 'error');
    }
  };

  const handleHistory = (fileId, fileName) => {
    setHistoryFile({ id: fileId, name: fileName });
    setShowHistoryModal(true);
  };

  const handleDeleteFolder = (folderId) => {
    setConfirmAction({
      message: 'Delete this folder and all its contents?',
      onConfirm: async () => {
        const res = await deleteFolder(folderId, activeFolderId);
        if (res.success) {
          triggerToast('Folder deleted');
        } else {
          triggerToast(res.error, 'error');
        }
        setConfirmAction(null);
      }
    });
  };

  const handleDeleteFile = (fileId) => {
    setConfirmAction({
      message: 'Move this file to trash?',
      onConfirm: async () => {
        const res = await deleteFile(fileId, activeFolderId);
        if (res.success) {
          triggerToast('File moved to trash');
        } else {
          triggerToast(res.error, 'error');
        }
        setConfirmAction(null);
      }
    });
  };

  const handleRenameSubmit = async (newName) => {
    if (!renameItem) return;
    
    const res = renameItem.type === 'file'
      ? await renameFile(renameItem.id, newName, activeFolderId)
      : await renameFolder(renameItem.id, newName, activeFolderId);

    if (res.success) {
      triggerToast('Renamed successfully');
      setRenameItem(null);
    } else {
      triggerToast(res.error, 'error');
    }
  };

  const handleMoveSubmit = async (destinationId) => {
    if (!moveItem) return;
    
    const res = moveItem.type === 'file'
      ? await moveFile(moveItem.id, destinationId, activeFolderId)
      : await moveFolder(moveItem.id, destinationId, activeFolderId);

    if (res.success) {
      triggerToast('Moved successfully');
      setMoveItem(null);
    } else {
      triggerToast(res.error, 'error');
    }
  };

  // Filters
  const filteredFolders = folders.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredFiles = files.filter(f =>
    f.original_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col p-4 md:p-6 text-black select-none">
      <Navbar />

      {notification && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border text-sm font-semibold transition-all ${
          notification.type === 'error'
            ? 'bg-red-50 text-red-700 border-red-100'
            : 'bg-green-50 text-green-700 border-green-100'
        }`}>
          {notification.message}
        </div>
      )}

      <main className="w-full max-w-7xl mx-auto grow flex flex-col gap-5 mt-2">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-black">File Explorer</h1>
          <FilesBreadcrumbs path={path} onNavigate={handleBreadcrumbNavigate} />
        </div>

        <FilesToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewType={viewType}
          setViewType={setViewType}
          onUploadClick={handleFileUpload}
          onCreateFolderClick={() => setShowFolderModal(true)}
          isUploading={isUploading}
        />

        <div className="grow">
          {pageLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black" />
              <span className="mt-2 text-xs text-gray-400 font-semibold">Loading contents...</span>
            </div>
          ) : filteredFolders.length === 0 && filteredFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-200 rounded-3xl bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5" />
              </svg>
              <span className="text-xs text-gray-400 font-bold">This folder is empty</span>
            </div>
          ) : (
            <div className={viewType === 'grid'
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 items-stretch"
              : "flex flex-col gap-2.5"
            }>
              {filteredFolders.map(folder => (
                <FolderItem
                  key={folder.id}
                  folder={folder}
                  onClick={() => handleFolderClick(folder)}
                  onRename={(id, name) => setRenameItem({ type: 'folder', id, name })}
                  onMove={(id, name) => setMoveItem({ type: 'folder', id, name })}
                  onDelete={handleDeleteFolder}
                  viewType={viewType}
                />
              ))}
              {filteredFiles.map(file => (
                <FileItem
                  key={file.id}
                  file={file}
                  viewType={viewType}
                  onView={handleView}
                  onHistory={handleHistory}
                  onDownload={handleDownload}
                  onShare={(id) => { setSelectedShareFile(id); setShowShareModal(true); }}
                  onRename={(id, name) => setRenameItem({ type: 'file', id, name })}
                  onMove={(id, name) => setMoveItem({ type: 'file', id, name })}
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
        onClose={() => { setShowShareModal(false); setSelectedShareFile(null); }}
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

      <MoveModal
        isOpen={!!moveItem}
        onClose={() => setMoveItem(null)}
        itemToMove={moveItem}
        onSubmit={handleMoveSubmit}
      />

      {confirmAction && (
        <ConfirmModal
          message={confirmAction.message}
          onConfirm={confirmAction.onConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {historyFile && (
        <FileHistoryModal
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          fileId={historyFile.id}
          fileName={historyFile.name}
        />
      )}
    </div>
  );
};

export default Files;
