import React, { useRef } from 'react';

const FilesToolbar = ({
    searchQuery,
    setSearchQuery,
    viewType,
    setViewType,
    onUploadClick,
    onCreateFolderClick,
    isUploading
}) => {
    const fileInputRef = useRef(null);

    const triggerUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] select-none">
            {/* Search Input */}
            <div className="relative flex items-center max-w-md w-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute left-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    placeholder="Search files and folders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 hover:bg-gray-100/50 focus:bg-white focus:border-black rounded-2xl py-2.5 pl-10 pr-4 text-xs font-semibold text-black focus:outline-none transition-all placeholder-gray-400"
                />
            </div>

            {/* Actions: View Toggle + Add Operations */}
            <div className="flex items-center gap-3 self-end md:self-auto">
                {/* Grid / List View Toggle */}
                <div className="flex items-center bg-gray-50 border border-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => setViewType('grid')}
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                            viewType === 'grid' 
                                ? 'bg-white text-black shadow-xs font-bold' 
                                : 'text-gray-400 hover:text-black'
                        }`}
                        title="Grid View"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setViewType('list')}
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                            viewType === 'list' 
                                ? 'bg-white text-black shadow-xs font-bold' 
                                : 'text-gray-400 hover:text-black'
                        }`}
                        title="List View"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Create Folder button */}
                <button
                    onClick={onCreateFolderClick}
                    className="bg-gray-50 text-black border border-gray-100 hover:bg-gray-100/50 hover:border-gray-200 active:scale-[0.98] py-2 px-3.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <span className="hidden sm:inline">New Folder</span>
                </button>

                {/* Upload File button */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onUploadClick}
                    className="hidden"
                />
                <button
                    onClick={triggerUpload}
                    disabled={isUploading}
                    className="bg-[#d2ff72] text-black hover:bg-[#c3f05e] active:scale-[0.98] py-2 px-4 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_2px_8px_rgba(210,255,114,0.15)] disabled:bg-gray-200 disabled:cursor-not-allowed"
                >
                    {isUploading ? (
                        <>
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-t-transparent border-black"></div>
                            <span>Uploading...</span>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span>Upload File</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default FilesToolbar;
