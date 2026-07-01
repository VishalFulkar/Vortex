import React, { useRef } from 'react';

const QuickActions = ({ isUploading, handleFileUpload, setShowFolderModal, setShowShareModal }) => {
    const fileInputRef = useRef(null);

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col gap-5">
            <h2 className="text-lg font-extrabold text-black tracking-tight">Quick Actions</h2>
            
            <div className="flex flex-col gap-3">
                {/* Input File Element */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                />

                {/* Upload Files Button */}
                <button
                    onClick={handleUploadClick}
                    disabled={isUploading}
                    className="w-full bg-[#d2ff72] text-black font-extrabold py-3.5 rounded-2xl hover:bg-[#c3f05e] active:scale-[0.98] transition-all text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(210,255,114,0.2)] cursor-pointer disabled:bg-gray-200 disabled:cursor-not-allowed"
                >
                    {isUploading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-black"></div>
                            <span>Uploading File...</span>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span>Upload Files</span>
                        </>
                    )}
                </button>

                {/* Create Folder Button */}
                <button
                    onClick={() => setShowFolderModal(true)}
                    className="w-full bg-[#f3f4f6] text-black font-bold py-3.5 rounded-2xl hover:bg-gray-200 active:scale-[0.98] transition-all text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer border border-gray-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <span>Create Folder</span>
                </button>

                {/* Share Files Button */}
                <button
                    onClick={() => setShowShareModal(true)}
                    className="w-full bg-[#f3f4f6] text-black font-bold py-3.5 rounded-2xl hover:bg-gray-200 active:scale-[0.98] transition-all text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer border border-gray-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.636-2.318a3 3 0 10-.203-1.028l-4.636 2.318a3 3 0 100 4.344l4.636-2.318a3 3 0 10.203-1.028l-4.636 2.318z" />
                    </svg>
                    <span>Share Files</span>
                </button>
            </div>
        </div>
    );
};

export default QuickActions;
