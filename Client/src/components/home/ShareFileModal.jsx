import React from 'react';

const ShareFileModal = ({ 
    isOpen, 
    onClose, 
    files, 
    selectedFile, 
    setSelectedFile, 
    email, 
    setEmail, 
    access, 
    setAccess, 
    onSubmit 
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] max-w-md w-full p-6 flex flex-col gap-4 border border-gray-100">
                <h3 className="text-base font-extrabold text-black select-none">Share a File</h3>
                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    
                    {/* File Selection */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Select File</label>
                        <select
                            value={selectedFile}
                            onChange={(e) => setSelectedFile(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-150 py-2 px-3 rounded-xl text-xs text-black focus:outline-none focus:border-black"
                            required
                        >
                            <option value="">-- Choose a file --</option>
                            {files.map(f => (
                                <option key={f.id} value={f.id}>{f.original_name}</option>
                            ))}
                        </select>
                    </div>

                    {/* User Email */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Recipient Email</label>
                        <input
                            type="email"
                            placeholder="friend@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-150 py-2 px-3 rounded-xl text-xs text-black focus:outline-none focus:border-black"
                            required
                        />
                    </div>

                    {/* Access Level */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Access Level</label>
                        <select
                            value={access}
                            onChange={(e) => setAccess(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-150 py-2 px-3 rounded-xl text-xs text-black focus:outline-none focus:border-black"
                        >
                            <option value="view">Viewer</option>
                            <option value="edit">Editor</option>
                        </select>
                    </div>

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
                            className="bg-[#d2ff72] text-black px-5 py-2.5 text-xs font-extrabold rounded-full hover:bg-[#c3f05e] transition-colors cursor-pointer shadow-sm"
                        >
                            Share File
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ShareFileModal;
