import React from 'react';
import { Link } from 'react-router-dom';

const ActivityLogs = ({ logs, userName }) => {
    const formatTimeAgo = (dateString) => {
        const now = new Date();
        const past = new Date(dateString);
        const diffMs = now - past;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays === 1) return 'Yesterday';
        return `${diffDays} days ago`;
    };

    return (
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col gap-5">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-extrabold text-black tracking-tight">Recent Activity</h2>
                <Link to="/activity" className="text-xs font-bold text-gray-400 hover:text-black transition-colors">
                    View All
                </Link>
            </div>

            <div className="flex flex-col gap-4">
                {logs.length === 0 ? (
                    <div className="text-xs text-gray-400 font-medium py-4 text-center">
                        No recent actions recorded.
                    </div>
                ) : (
                    logs.map((log) => (
                        <div key={log.id} className="flex justify-between items-start text-xs border-b border-gray-50 pb-3 last:border-b-0 last:pb-0">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#f3f4f6] text-black flex items-center justify-center font-bold">
                                    {userName ? userName[0].toUpperCase() : 'U'}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-black">{userName}</span>
                                    <span className="text-gray-400 mt-0.5">
                                        {log.action === 'upload' && `Uploaded ${log.file_name}`}
                                        {log.action === 'download' && `Downloaded ${log.file_name}`}
                                        {log.action === 'share' && `Shared ${log.file_name}`}
                                        {log.action === 'delete' && `Deleted ${log.file_name}`}
                                        {log.action === 'restore' && `Restored ${log.file_name}`}
                                        {!['upload', 'download', 'share', 'delete', 'restore'].includes(log.action) && `${log.action} ${log.file_name}`}
                                    </span>
                                </div>
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium shrink-0 pt-0.5">
                                {formatTimeAgo(log.created_at)}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ActivityLogs;
