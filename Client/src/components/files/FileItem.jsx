import React, { useState, useEffect, useRef } from 'react';

const FileItem = ({ file, viewType, onDownload, onShare, onRename, onMove, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    // Format bytes helper
    const formatBytes = (bytes, decimals = 1) => {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleActionClick = (e, callback) => {
        e.stopPropagation();
        setShowMenu(false);
        callback();
    };

    // Document types definition
    const docMimeTypes = [
        'application/pdf', 'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
        'text/plain', 'text/html', 'application/rtf'
    ];

    const isDoc = docMimeTypes.includes(file.mimetype);

    // Render appropriate icon based on mime type
    const renderIcon = (sizeClass = "h-4 w-4") => {
        if (isDoc) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={sizeClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            );
        }
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className={sizeClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        );
    };

    if (viewType === 'list') {
        return (
            <div 
                onDoubleClick={() => onDownload(file.id, file.original_name)}
                className="flex justify-between items-center p-3 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 hover:border-gray-250 transition-all select-none group"
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isDoc ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'
                    }`}>
                        {renderIcon("h-4 w-4")}
                    </div>
                    <div className="flex flex-col truncate">
                        <span className="text-xs font-bold text-black truncate select-text">{file.original_name}</span>
                        <span className="text-[10px] text-gray-400 font-semibold mt-0.5">{formatBytes(file.size)}</span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => handleActionClick(e, () => onDownload(file.id, file.original_name))}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-black transition-all cursor-pointer"
                        title="Download"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </button>
                    <button
                        onClick={(e) => handleActionClick(e, () => onShare(file.id))}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-black transition-all cursor-pointer"
                        title="Share"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.636-2.318a3 3 0 10-.203-1.028l-4.636 2.318a3 3 0 100 4.344l4.636-2.318a3 3 0 10.203-1.028l-4.636 2.318z" />
                        </svg>
                    </button>
                    <button
                        onClick={(e) => handleActionClick(e, () => onRename(file.id, file.original_name))}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-black transition-all cursor-pointer"
                        title="Rename"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                    <button
                        onClick={(e) => handleActionClick(e, () => onMove(file.id, file.original_name))}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-black transition-all cursor-pointer"
                        title="Move"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                    </button>
                    <button
                        onClick={(e) => handleActionClick(e, () => onDelete(file.id))}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-all cursor-pointer"
                        title="Move to Trash"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

    // Grid View Card
    return (
        <div 
            onDoubleClick={() => onDownload(file.id, file.original_name)}
            className="bg-white rounded-3xl p-4 border border-gray-100 hover:border-gray-250 shadow-[0_8px_30px_rgb(0,0,0,0.005)] flex flex-col justify-between h-[120px] hover:shadow-md transition-all select-none relative group"
        >
            <div className="flex justify-between items-start">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    isDoc ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'
                }`}>
                    {renderIcon("h-5 w-5")}
                </div>

                {/* Settings Actions Menu */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                        className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-black transition-colors cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                    {showMenu && (
                        <div className="absolute right-0 mt-1 z-15 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 w-28 text-left">
                            <button
                                onClick={(e) => handleActionClick(e, () => onDownload(file.id, file.original_name))}
                                className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer font-bold"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span>Download</span>
                            </button>
                            <button
                                onClick={(e) => handleActionClick(e, () => onShare(file.id))}
                                className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer font-bold"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 10.742l4.636-2.318a3 3 0 10-.203-1.028l-4.636 2.318a3 3 0 100 4.344l4.636-2.318a3 3 0 10.203-1.028l-4.636 2.318z" />
                                </svg>
                                <span>Share</span>
                            </button>
                            <button
                                onClick={(e) => handleActionClick(e, () => onRename(file.id, file.original_name))}
                                className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer font-bold"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                <span>Rename</span>
                            </button>
                            <button
                                onClick={(e) => handleActionClick(e, () => onMove(file.id, file.original_name))}
                                className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer font-bold"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                                <span>Move</span>
                            </button>
                            <button
                                onClick={(e) => handleActionClick(e, () => onDelete(file.id))}
                                className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-1.5 cursor-pointer font-bold"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Delete</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col overflow-hidden w-full select-text mt-2">
                <span className="text-xs font-extrabold text-black truncate w-full">{file.original_name}</span>
                <span className="text-[9px] text-gray-400 font-bold mt-0.5">{formatBytes(file.size)}</span>
            </div>
        </div>
    );
};

export default FileItem;
