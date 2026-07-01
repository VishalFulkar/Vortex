import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Navbar from '../components/Navbar';
import api from '../services/api';

// Subcomponents
import StatsCard from '../components/home/StatsCard';
import ActivityLogs from '../components/home/ActivityLogs';
import QuickActions from '../components/home/QuickActions';
import FileList from '../components/home/FileList';
import CreateFolderModal from '../components/home/CreateFolderModal';
import ShareFileModal from '../components/home/ShareFileModal';

const Home = () => {
  const { user, isLoading } = useAuthStore();
  const navigate = useNavigate();

  // Dashboard data states
  const [storage, setStorage] = useState({ used: 0, quota: 5368709120, percentUsed: 0, remaining: 5368709120 });
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [sharedCount, setSharedCount] = useState(0);
  const [logs, setLogs] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // Interactive states
  const [isUploading, setIsUploading] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedShareFile, setSelectedShareFile] = useState('');
  const [shareEmail, setShareEmail] = useState('');
  const [shareAccess, setShareAccess] = useState('view');
  const [notification, setNotification] = useState(null);

  // Route Protection
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    if (!user) return;
    try {
      setDashboardLoading(true);

      // 1. Storage
      const storageRes = await api.get('/user/storage');
      if (storageRes.data?.success) {
        setStorage(storageRes.data.storage);
      }

      // 2. Files
      const filesRes = await api.get('/file');
      if (filesRes.data?.success) {
        setFiles(filesRes.data.files);
      }

      // 3. Folders
      const foldersRes = await api.get('/folder');
      if (foldersRes.data?.success) {
        setFolders(foldersRes.data.folders);
      }

      // 4. Shared With Me
      const sharedRes = await api.get('/files/shared-with-me');
      if (sharedRes.data?.success) {
        setSharedCount(sharedRes.data.files.length);
      }

      // 5. Activity logs
      const logsRes = await api.get('/logs');
      if (logsRes.data?.success) {
        setLogs(logsRes.data.logs.slice(0, 5));
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setDashboardLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

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

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    try {
      const res = await api.post('/file/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.success) {
        triggerToast('File uploaded successfully!');
        fetchDashboardData();
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Upload failed';
      triggerToast(errMsg, 'error');
    } finally {
      setIsUploading(false);
      e.target.value = null; // reset
    }
  };

  // Folder Creation Handler
  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      const res = await api.post('/folder', { name: newFolderName });
      if (res.data?.success) {
        triggerToast(`Folder "${newFolderName}" created successfully!`);
        setNewFolderName('');
        setShowFolderModal(false);
        fetchDashboardData();
      }
    } catch (err) {
      triggerToast(err.response?.data?.error || 'Folder creation failed', 'error');
    }
  };

  // File Sharing Handler
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
        fetchDashboardData();
      }
    } catch (err) {
      triggerToast(err.response?.data?.error || 'Failed to share file', 'error');
    }
  };

  // File Download Handler
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
      fetchDashboardData(); // update activity log
    } catch (err) {
      triggerToast('Download failed', 'error');
    }
  };

  // File Delete Handler
  const handleDelete = async (fileId) => {
    if (!window.confirm('Move this file to trash?')) return;
    try {
      const res = await api.delete(`/file/${fileId}`);
      if (res.data?.success) {
        triggerToast('File moved to trash');
        fetchDashboardData();
      }
    } catch (err) {
      triggerToast('Failed to delete file', 'error');
    }
  };

  // Document classification
  const docMimeTypes = [
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain', 'text/html', 'application/rtf'
  ];

  const documentsList = files.filter(f => docMimeTypes.includes(f.mimetype)).slice(0, 3);
  const mediaList = files.filter(f => !docMimeTypes.includes(f.mimetype)).slice(0, 3);

  if (isLoading || dashboardLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black"></div>
        <span className="mt-3 text-sm text-gray-500 font-semibold select-none">Loading dashboard data...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col p-4 md:p-6 text-black select-none">
      {/* Top Navigation Bar */}
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
            onDelete={handleDelete}
            emptyMessage="No documents in cloud storage."
            iconType="doc"
          />
          <FileList
            title="Recent Media & Spreadsheets"
            files={mediaList}
            onDownload={handleDownload}
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

    </div>
  );
};

export default Home;