import React from 'react';

const FilesBreadcrumbs = ({ path, onNavigate }) => {
    return (
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold select-none py-1">
            {/* Root Breadcrumb */}
            <button
                onClick={() => onNavigate(-1)}
                className="flex items-center gap-1 hover:text-black transition-colors cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>All Files</span>
            </button>

            {/* Path Items */}
            {path.map((folder, index) => (
                <React.Fragment key={folder.id}>
                    <span className="text-gray-300 font-normal">/</span>
                    <button
                        onClick={() => onNavigate(index)}
                        className={`hover:text-black transition-colors truncate max-w-[120px] cursor-pointer ${
                            index === path.length - 1 ? 'text-black font-extrabold' : ''
                        }`}
                    >
                        {folder.name}
                    </button>
                </React.Fragment>
            ))}
        </div>
    );
};

export default FilesBreadcrumbs;
