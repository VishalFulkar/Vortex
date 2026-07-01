import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
import useShareStore from '../store/shareStore';
import useFileStore from '../store/fileStore';
import Navbar from '../components/Navbar';

const SharedFiles = () => {
    const { user } = useAuthStore();
    const { sharedFiles, myShares, isLoading, fetchSharedFiles, fetchMyShares, revokeShare, updateShareAccess } = useShareStore();
    const { downloadFile } = useFileStore(); // Reuse the robust download logic
    const [notification, setNotification] = useState(null);
    const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' | 'outgoing'

    useEffect(() => {
        if (user) {
            fetchSharedFiles();
            fetchMyShares();
        }
    }, [user, fetchSharedFiles, fetchMyShares]);

    const triggerToast = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const handleDownload = async (fileId, filename) => {
        const res = await downloadFile(fileId, filename);
        if (res.success) {
            triggerToast('Download started');
        } else {
            triggerToast(res.error, 'error');
        }
    };

    const handleRevoke = async (fileId, targetUserId) => {
        if (!window.confirm('Are you sure you want to revoke access?')) return;
        const res = await revokeShare(fileId, targetUserId);
        if (res.success) {
            triggerToast('Access revoked successfully');
        } else {
            triggerToast(res.error, 'error');
        }
    };

    const handleToggleAccess = async (fileId, email, currentAccess) => {
        const newAccess = currentAccess === 'view' ? 'edit' : 'view';
        const res = await updateShareAccess(fileId, email, newAccess);
        if (res.success) {
            triggerToast(`Access updated to ${newAccess}`);
        } else {
            triggerToast(res.error, 'error');
        }
    };

    const formatBytes = (bytes, decimals = 1) => {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const docMimeTypes = [
        'application/pdf', 'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
        'text/plain', 'text/html', 'application/rtf'
    ];

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col p-4 md:p-6 text-black select-none">
            <Navbar />

            {notification && (
                <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border text-sm font-semibold transition-all animate-in slide-in-from-top-4 ${
                    notification.type === 'error'
                        ? 'bg-red-50 text-red-700 border-red-100'
                        : 'bg-green-50 text-green-700 border-green-100'
                }`}>
                    {notification.message}
                </div>
            )}

            <main className="w-full max-w-7xl mx-auto grow flex flex-col gap-5 mt-2">
                <div className="flex flex-col gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-black">Shared Files</h1>
                        <p className="text-sm font-semibold text-gray-500">Manage files you share and files shared with you.</p>
                    </div>

                    <div className="flex items-center gap-2 border-b border-gray-200 pb-px">
                        <button 
                            onClick={() => setActiveTab('incoming')}
                            className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'incoming' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            Shared with Me
                        </button>
                        <button 
                            onClick={() => setActiveTab('outgoing')}
                            className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'outgoing' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            My Shares
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] grow">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-24">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black" />
                            <span className="mt-2 text-xs text-gray-400 font-semibold">Loading...</span>
                        </div>
                    ) : (activeTab === 'incoming' && sharedFiles.length === 0) || (activeTab === 'outgoing' && myShares.length === 0) ? (
                        <div className="flex flex-col items-center justify-center py-32 border border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.636-2.318a3 3 0 10-.203-1.028l-4.636 2.318a3 3 0 100 4.344l4.636-2.318a3 3 0 10.203-1.028l-4.636 2.318z" />
                            </svg>
                            <span className="text-sm text-gray-500 font-bold">
                                {activeTab === 'incoming' ? 'No files shared with you yet' : "You haven't shared any files yet"}
                            </span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {(activeTab === 'incoming' ? sharedFiles : myShares).map(file => {
                                const isDoc = docMimeTypes.includes(file.mimetype);
                                return (
                                    <div key={file.id + (file.target_user_id || 'inc')} className="flex justify-between items-center p-4 rounded-2xl bg-gray-50/50 hover:bg-gray-100/50 transition-colors border border-gray-100/50 group">
                                        <div className="flex items-center gap-4 overflow-hidden w-2/3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                                isDoc ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'
                                            }`}>
                                                {isDoc ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="flex flex-col truncate">
                                                <span className="text-sm font-bold text-black truncate select-text">{file.original_name}</span>
                                                <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500 font-medium">
                                                    <span>{formatBytes(file.size)}</span>
                                                    <span>•</span>
                                                    {activeTab === 'incoming' ? (
                                                        <span>Shared by <span className="font-bold text-black">{file.owner_name}</span></span>
                                                    ) : (
                                                        <span className="truncate">Shared with <span className="font-bold text-black">{file.shared_with_email}</span></span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {/* Access badge */}
                                            {activeTab === 'incoming' ? (
                                                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${
                                                    file.access_level === 'edit' ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-600'
                                                }`}>
                                                    {file.access_level}
                                                </span>
                                            ) : (
                                                <button 
                                                    onClick={() => handleToggleAccess(file.id, file.shared_with_email, file.access_level)}
                                                    title="Click to toggle permission"
                                                    className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md transition-colors cursor-pointer hover:opacity-80 ${
                                                        file.access_level === 'edit' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                                    }`}>
                                                    {file.access_level}
                                                </button>
                                            )}

                                            {activeTab === 'incoming' ? (
                                                file.access_level === 'edit' ? (
                                                    <button
                                                        onClick={() => handleDownload(file.id, file.original_name)}
                                                        className="p-2 hover:bg-gray-200 rounded-xl text-gray-500 hover:text-black transition-colors cursor-pointer"
                                                        title="Download"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                        </svg>
                                                    </button>
                                                ) : (
                                                    <div className="w-8" /> // Placeholder to maintain alignment if no download button
                                                )
                                            ) : (
                                                <button
                                                    onClick={() => handleRevoke(file.id, file.target_user_id)}
                                                    className="p-2 hover:bg-red-100 rounded-xl text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                                                    title="Revoke Access"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SharedFiles;
