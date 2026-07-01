import React from 'react';

const CreateFolderModal = ({ isOpen, onClose, folderName, setFolderName, onSubmit }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] max-w-sm w-full p-6 flex flex-col gap-4 border border-gray-100">
                <h3 className="text-base font-extrabold text-black select-none">Create New Folder</h3>
                <form onSubmit={onSubmit} className="flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="Folder name"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        className="w-full border-b border-gray-200 py-2 text-sm text-black focus:outline-none focus:border-black transition-colors"
                        autoFocus
                    />
                    <div className="flex gap-2 justify-end mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-black transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-[#d2ff72] text-black px-4 py-2 text-xs font-extrabold rounded-full hover:bg-[#c3f05e] transition-colors cursor-pointer shadow-sm"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateFolderModal;
