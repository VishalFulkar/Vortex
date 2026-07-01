import React, { useEffect, useState, useCallback } from 'react';
import useAuthStore from '../store/authStore';
import useFileStore from '../store/fileStore';
import useFolderStore from '../store/folderStore';
import Navbar from '../components/Navbar';
import api from '../services/api';

// Subcomponents
import StatsCard from '../components/home/StatsCard';
import ActivityLogs from '../components/home/ActivityLogs';
import QuickActions from '../components/home/QuickActions';
import FileList from '../components/home/FileList';
import CreateFolderModal from '../components/home/CreateFolderModal';
import ShareFileModal from '../components/home/ShareFileModal';
import MoveModal from '../components/files/MoveModal';
import ConfirmModal from '../components/common/ConfirmModal';

const Home = () => {
  const { user } = useAuthStore();
  const { files, fetchFiles, uploadFile, deleteFile, shareFile, moveFile, downloadFile, isLoading: filesLoading } = useFileStore();
  const { folders, fetchFolders, createFolder, isLoading: foldersLoading } = useFolderStore();

  // Dashboard data states (for non-file/folder data)
  const [storage, setStorage] = useState({ used: 0, quota: 5368709120, percentUsed: 0, remaining: 5368709120 });
  const [sharedCount, setSharedCount] = useState(0);
  const [logs, setLogs] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // Interactive states
  const [isUploading, setIsUploading] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedShareFile, setSelectedShareFile] = useState(null);
  const [shareEmail, setShareEmail] = useState('');
  const [shareAccess, setShareAccess] = useState('view');
  const [moveItem, setMoveItem] = useState(null);
  const [notification, setNotification] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  // Fetch dashboard specific data
  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    try {
      setDashboardLoading(true);

      const [storageRes, sharedRes, logsRes] = await Promise.all([
          api.get('/user/storage').catch(() => ({ data: {} })),
          api.get('/files/shared-with-me').catch(() => ({ data: {} })),
          api.get('/logs').catch(() => ({ data: {} }))
      ]);

      if (storageRes.data?.success) setStorage(storageRes.data.storage);
      if (sharedRes.data?.success) setSharedCount(sharedRes.data.files?.length || 0);
      if (logsRes.data?.success) setLogs(logsRes.data.logs?.slice(0, 5) || []);
      
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setDashboardLoading(false);
    }
  }, [user]);

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchDashboardData();
      fetchFiles();   // root files
      fetchFolders(); // root folders
    }
  }, [user, fetchDashboardData, fetchFiles, fetchFolders]);

  // Trigger notification toast
  const triggerToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Format bytes helper
  const formatBytes = (bytes, decimals = 1) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // File Upload Handler
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const res = await uploadFile(file); // uploads to root
    setIsUploading(false);

    if (res.success) {
      triggerToast('File uploaded successfully!');
      fetchDashboardData(); // update storage & logs
    } else {
      triggerToast(res.error, 'error');
    }
    e.target.value = null; // reset
  };

  // Folder Creation Handler
  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const res = await createFolder(newFolderName); // creates in root
    if (res.success) {
      triggerToast(`Folder "${newFolderName}" created successfully!`);
      setNewFolderName('');
      setShowFolderModal(false);
      fetchDashboardData(); // update logs
    } else {
      triggerToast(res.error, 'error');
    }
  };

  // File Sharing Handler
  const handleShareFile = async (e) => {
    e.preventDefault();
    if (!selectedShareFile || !shareEmail.trim()) return;

    const res = await shareFile(selectedShareFile, shareEmail, shareAccess);
    if (res.success) {
      triggerToast('File shared successfully!');
      setShareEmail('');
      setSelectedShareFile(null);
      setShowShareModal(false);
      fetchDashboardData(); // update logs
    } else {
      triggerToast(res.error, 'error');
    }
  };

  // File Download Handler
  const handleDownload = async (fileId, filename) => {
    const res = await downloadFile(fileId, filename);
    if (res.success) {
      triggerToast('Download started');
      fetchDashboardData(); // update logs
    } else {
      triggerToast(res.error, 'error');
    }
  };

  // File Move Handler
  const handleMoveSubmit = async (destinationId) => {
    if (!moveItem) return;
    
    // Home currently only renders files for moving
    const res = await moveFile(moveItem.id, destinationId, null);
    if (res.success) {
      triggerToast('Moved successfully');
      setMoveItem(null);
      fetchDashboardData();
    } else {
      triggerToast(res.error, 'error');
    }
  };

  // File Delete Handler with ConfirmModal
  const handleDelete = (fileId) => {
    setConfirmAction({
      message: 'Move this file to trash?',
      onConfirm: async () => {
        const res = await deleteFile(fileId);
        if (res.success) {
          triggerToast('File moved to trash');
          fetchDashboardData(); // update storage & logs
        } else {
          triggerToast(res.error, 'error');
        }
        setConfirmAction(null);
      }
    });
  };

  // Document classification
  const docMimeTypes = [
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain', 'text/html', 'application/rtf'
  ];

  const documentsList = files.filter(f => docMimeTypes.includes(f.mimetype)).slice(0, 3);
  const mediaList = files.filter(f => !docMimeTypes.includes(f.mimetype)).slice(0, 3);

  if (dashboardLoading || filesLoading || foldersLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black"></div>
        <span className="mt-3 text-sm text-gray-500 font-semibold select-none">Loading dashboard data...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col p-4 md:p-6 text-black select-none">
      <Navbar />

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border text-sm font-semibold transition-all ${notification.type === 'error'
            ? 'bg-red-50 text-red-700 border-red-100'
            : 'bg-green-50 text-green-700 border-green-100'
          }`}>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto grow flex flex-col gap-6">

        {/* Welcome Back & Subheader */}
        <div className="flex flex-col gap-1 mt-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-black">
            Welcome Back!
          </h1>
          <p className="text-gray-400 text-sm font-medium">
            Here's what happening with <span className="text-black font-bold">your files today</span>
          </p>
        </div>

        {/* Grid of 4 Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          <StatsCard
            title="Storage Used"
            value={formatBytes(storage.used)}
            subtext={`of ${formatBytes(storage.quota)}`}
            percentage={storage.percentUsed}
            color="#d2ff72"
          />
          <StatsCard
            title="Total Files"
            value={`${files.length} Files`}
            subtext="Active in Cloud"
            percentage={(files.length / 500) * 100}
            color="#4c7c2f"
          />
          <StatsCard
            title="Shared Files"
            value={`${sharedCount} Shared`}
            subtext="Shared with Team"
            percentage={sharedCount > 0 ? 56 : 0}
            color="#60a5fa"
          />
          <StatsCard
            title="Folders Created"
            value={`${folders.length} Folders`}
            subtext="Nested directory map"
            percentage={folders.length > 0 ? 32 : 0}
            color="#fbbf24"
          />
        </section>

        {/* Middle Section: Activity and Quick Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <ActivityLogs logs={logs} userName={user?.name} />
          <QuickActions
            isUploading={isUploading}
            handleFileUpload={handleFileUpload}
            setShowFolderModal={setShowFolderModal}
            setShowShareModal={setShowShareModal}
          />
        </section>

        {/* Bottom Section: Categorized File Listings */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-8">
          <FileList
            title="Recent Documents"
            files={documentsList}
            onDownload={handleDownload}
            onMove={(id, name) => setMoveItem({ type: 'file', id, name })}
            onDelete={handleDelete}
            emptyMessage="No documents in cloud storage."
            iconType="doc"
          />
          <FileList
            title="Recent Media & Spreadsheets"
            files={mediaList}
            onDownload={handleDownload}
            onMove={(id, name) => setMoveItem({ type: 'file', id, name })}
            onDelete={handleDelete}
            emptyMessage="No spreadsheets or media in cloud storage."
            iconType="media"
          />
        </section>

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
        onClose={() => setShowShareModal(false)}
        files={files}
        selectedFile={selectedShareFile}
        setSelectedFile={setSelectedShareFile}
        email={shareEmail}
        setEmail={setShareEmail}
        access={shareAccess}
        setAccess={setShareAccess}
        onSubmit={handleShareFile}
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
    </div>
  );
};

export default Home;