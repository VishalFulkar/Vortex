import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const FileHistoryModal = ({ isOpen, onClose, fileId, fileName }) => {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isOpen || !fileId) return;

        const fetchLogs = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await api.get(`/logs/file/${fileId}`);
                if (response.data.success) {
                    setLogs(response.data.logs || []);
                }
            } catch (err) {
                console.error('Error fetching file history:', err);
                setError('Failed to load file history.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLogs();
    }, [isOpen, fileId]);

    if (!isOpen) return null;

    const formatDate = (dateString) => {
        const d = new Date(dateString);
        return {
            date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
            time: d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
        };
    };

    const renderActionBadge = (action) => {
        const styles = {
            upload: "bg-green-100 text-green-700",
            download: "bg-blue-100 text-blue-700",
            delete: "bg-red-100 text-red-700",
            delete_permanent: "bg-red-200 text-red-800",
            restore: "bg-indigo-100 text-indigo-700",
            rename: "bg-yellow-100 text-yellow-700",
            move: "bg-purple-100 text-purple-700",
            view: "bg-gray-100 text-gray-700"
        };
        const style = styles[action] || "bg-gray-100 text-gray-700";
        return (
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${style}`}>
                {action.replace('_', ' ')}
            </span>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] max-w-md w-full flex flex-col border border-gray-100 overflow-hidden h-[500px]">
                
                {/* Header */}
                <div className="p-6 pb-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="text-base font-extrabold text-black select-none">File History</h3>
                        <p className="text-xs font-semibold text-gray-400 mt-1 truncate max-w-[250px]">{fileName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full text-gray-400 hover:text-black transition-colors cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto grow bg-white">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black" />
                            <span className="text-xs font-semibold text-gray-400">Loading history...</span>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-full text-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-bold text-red-500">{error}</span>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-bold text-gray-400">No activity recorded yet</span>
                        </div>
                    ) : (
                        <div className="relative border-l-2 border-gray-100 ml-3 pl-6 space-y-6">
                            {logs.map((log) => {
                                const { date, time } = formatDate(log.created_at);
                                return (
                                    <div key={log.id} className="relative">
                                        <div className="absolute left-[-31px] top-1 h-3 w-3 rounded-full bg-white border-2 border-[#d2ff72]" />
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-3">
                                                {renderActionBadge(log.action)}
                                                <span className="text-[10px] font-semibold text-gray-400">{time}</span>
                                            </div>
                                            <div className="text-sm font-bold text-black mt-1">
                                                <span className="text-gray-500">{log.user_name}</span> performed <span className="font-extrabold">{log.action.replace('_', ' ')}</span>
                                            </div>
                                            <div className="text-[11px] font-semibold text-gray-400 flex gap-2">
                                                <span>{date}</span>
                                                <span>•</span>
                                                <span>IP: {log.ip_address}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileHistoryModal;
