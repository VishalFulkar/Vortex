import React from 'react';
import { Link } from 'react-router-dom';

const FileList = ({ title, files, onDownload, onDelete, emptyMessage, iconType = 'doc' }) => {
    // Format bytes helper
    const formatBytes = (bytes, decimals = 1) => {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    return (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col gap-5">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-extrabold text-black tracking-tight">{title}</h2>
                <Link to="/files" className="text-xs font-bold text-gray-400 hover:text-black transition-colors">
                    View All
                </Link>
            </div>

            <div className="flex flex-col gap-3 grow">
                {files.length === 0 ? (
                    <div className="text-xs text-gray-400 font-medium py-10 text-center grow flex items-center justify-center border border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
                        {emptyMessage}
                    </div>
                ) : (
                    files.map((file) => (
                        <div key={file.id} className="flex justify-between items-center p-3 rounded-2xl bg-gray-50/50 hover:bg-gray-100/50 transition-colors border border-gray-100/50">
                            <div className="flex items-center gap-3 overflow-hidden">
                                {iconType === 'doc' ? (
                                    /* PDF/Word custom Red Icon */
                                    <div className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                ) : (
                                    /* Green Icon for media/spreadsheets */
                                    <div className="w-8 h-8 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                                <div className="flex flex-col truncate">
                                    <span className="text-xs font-bold text-black truncate select-text">{file.original_name}</span>
                                    <span className="text-[10px] text-gray-400 font-medium mt-0.5">
                                        {formatBytes(file.size)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Download */}
                                <button 
                                    onClick={() => onDownload(file.id, file.original_name)}
                                    className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-500 hover:text-black transition-colors cursor-pointer"
                                    title="Download File"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </button>
                                {/* Delete */}
                                <button 
                                    onClick={() => onDelete(file.id)}
                                    className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                                    title="Move to Trash"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FileList;
