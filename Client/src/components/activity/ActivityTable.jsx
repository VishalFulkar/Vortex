import React from 'react';
import ActionIcon from './ActionIcon';
import { formatBytes } from '../../utils/formatters';

const ActivityTable = ({ logs }) => {
    return (
        <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-100">
                        <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Action</th>
                        <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">File Name</th>
                        <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">IP Address</th>
                        <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="py-4 px-6 align-middle">
                                <div className="flex items-center gap-3">
                                    <ActionIcon action={log.action} />
                                    <div>
                                        <p className="text-sm font-bold text-gray-800 capitalize">{log.action}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-4 px-6 align-middle">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-800 truncate max-w-[200px] md:max-w-[300px]">
                                        {log.file_name || 'Unknown File'}
                                    </span>
                                    {log.file_size && (
                                        <span className="text-[11px] text-gray-400 font-semibold">
                                            {formatBytes(log.file_size)}
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td className="py-4 px-6 align-middle hidden sm:table-cell">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 text-gray-500 text-xs font-mono font-medium border border-gray-100">
                                    {log.ip_address === '::1' ? '127.0.0.1' : log.ip_address}
                                </span>
                            </td>
                            <td className="py-4 px-6 align-middle">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-700">
                                        {new Date(log.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    <span className="text-[11px] text-gray-400 font-semibold">
                                        {new Date(log.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ActivityTable;
