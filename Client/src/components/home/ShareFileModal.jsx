import React, { useEffect, useState } from 'react';
import useShareStore from '../../store/shareStore';

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
    const { getFileShares, revokeShare, updateShareAccess } = useShareStore();
    const [currentShares, setCurrentShares] = useState([]);
    const [isLoadingShares, setIsLoadingShares] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setCurrentShares([]);
            return;
        }
        
        if (selectedFile) {
            fetchShares();
        } else {
            setCurrentShares([]);
        }
    }, [isOpen, selectedFile]);

    const fetchShares = async () => {
        setIsLoadingShares(true);
        const res = await getFileShares(selectedFile);
        if (res.success) {
            setCurrentShares(res.shares);
        }
        setIsLoadingShares(false);
    };

    const handleRevoke = async (targetUserId) => {
        if (!window.confirm('Are you sure you want to revoke access?')) return;
        const res = await revokeShare(selectedFile, targetUserId);
        if (res.success) {
            setCurrentShares(currentShares.filter(s => s.user_id !== targetUserId));
        }
    };

    const handleToggleAccess = async (email, currentAccess) => {
        const newAccess = currentAccess === 'view' ? 'edit' : 'view';
        const res = await updateShareAccess(selectedFile, email, newAccess);
        if (res.success) {
            setCurrentShares(currentShares.map(s => 
                s.email === email ? { ...s, access_level: newAccess } : s
            ));
        }
    };

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

                {/* Current Shares List */}
                {selectedFile && (
                    <div className="mt-4 border-t border-gray-100 pt-4 flex flex-col gap-3 max-h-48 overflow-y-auto">
                        <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Current Access</h4>
                        {isLoadingShares ? (
                            <div className="text-xs font-semibold text-gray-400 py-2 text-center">Loading access list...</div>
                        ) : currentShares.length === 0 ? (
                            <div className="text-xs font-semibold text-gray-400 py-2 text-center">Not shared with anyone yet</div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {currentShares.map(share => (
                                    <div key={share.user_id} className="flex items-center justify-between p-2 rounded-xl bg-gray-50/50 border border-gray-100/50">
                                        <span className="text-xs font-bold text-black truncate w-1/2">{share.email}</span>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                type="button"
                                                onClick={() => handleToggleAccess(share.email, share.access_level)}
                                                title="Click to toggle permission"
                                                className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md transition-colors cursor-pointer hover:opacity-80 ${
                                                    share.access_level === 'edit' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                                }`}>
                                                {share.access_level}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleRevoke(share.user_id)}
                                                className="p-1 hover:bg-red-100 rounded-md text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                                                title="Revoke Access"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShareFileModal;
