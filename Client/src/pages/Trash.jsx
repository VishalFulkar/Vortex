
import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import useFileStore from "../store/fileStore";
import { formatBytes } from "../utils/formatters";
import ConfirmModal from '../components/common/ConfirmModal';

const Trash = () => {
    const { trashedFiles, isLoading, fetchTrashedFiles, restoreFile, permanentDeleteFile } = useFileStore();
    const [notification, setNotification] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);

    useEffect(() => {
        fetchTrashedFiles();
    }, [fetchTrashedFiles]);

    const triggerToast = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const handleRestore = async (fileId) => {
        const res = await restoreFile(fileId);
        if (res.success) {
            triggerToast('File restored successfully');
        } else {
            triggerToast(res.error || 'Failed to restore file', 'error');
        }
    };

    const handleDeleteForever = (fileId) => {
        setConfirmAction({
            message: 'Are you sure you want to permanently delete this file? This action cannot be undone.',
            onConfirm: async () => {
                const res = await permanentDeleteFile(fileId);
                if (res.success) {
                    triggerToast('File permanently deleted');
                } else {
                    triggerToast(res.error || 'Failed to delete file', 'error');
                }
                setConfirmAction(null);
            }
        });
    };

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

            <main className="w-full max-w-7xl mx-auto grow flex flex-col gap-6 mt-2">
                <header className="flex flex-col gap-2">
                    <h1 className="text-2xl font-extrabold tracking-tight text-black">Deleted Files</h1>
                </header>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden grow flex flex-col mb-10">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-24 m-auto">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black" />
                            <span className="mt-4 text-sm text-gray-400 font-semibold">Loading trash...</span>
                        </div>
                    ) : trashedFiles?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 m-auto text-center px-4">
                            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">Trash is empty</h3>
                            <p className="text-sm text-gray-500 max-w-xs mx-auto">Any files you delete will appear here.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">File Name</th>
                                        <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Size</th>
                                        <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Date Deleted</th>
                                        <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {trashedFiles?.map((file) => (
                                        <tr key={file.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="py-4 px-6 align-middle">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-gray-50 text-gray-500">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-800 truncate max-w-[200px] md:max-w-[300px]">
                                                        {file.original_name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 align-middle hidden sm:table-cell">
                                                <span className="text-sm font-semibold text-gray-500">
                                                    {formatBytes(file.size)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 align-middle hidden md:table-cell">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-700">
                                                        {new Date(file.deleted_at || file.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                    <span className="text-[11px] text-gray-400 font-semibold">
                                                        {new Date(file.deleted_at || file.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 align-middle text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleRestore(file.id)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-sm font-bold transition-colors cursor-pointer"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                                        </svg>
                                                        Restore
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteForever(file.id)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-bold transition-colors cursor-pointer"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Delete Forever
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

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

export default Trash;