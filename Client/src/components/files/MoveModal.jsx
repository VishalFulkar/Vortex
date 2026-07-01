import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const MoveModal = ({ isOpen, onClose, itemToMove, onSubmit }) => {
    // Local state for the modal's mini-explorer
    const [destinationId, setDestinationId] = useState(null);
    const [path, setPath] = useState([]);
    const [modalFolders, setModalFolders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // Fetch folders for current destination
    useEffect(() => {
        if (isOpen) {
            fetchFolders(destinationId);
        } else {
            // Reset when closed
            setDestinationId(null);
            setPath([]);
            setModalFolders([]);
        }
    }, [isOpen, destinationId]);
    
    const fetchFolders = async (parentId) => {
        setIsLoading(true);
        try {
            const params = parentId ? { parentId } : {};
            const res = await api.get('/folder', { params });
            if (res.data?.success) {
                // Filter out the folder being moved so they can't move a folder into itself!
                let folders = res.data.folders || [];
                if (itemToMove && itemToMove.type === 'folder') {
                    folders = folders.filter(f => f.id !== itemToMove.id);
                }
                setModalFolders(folders);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleNavigateIn = (folder) => {
        setDestinationId(folder.id);
        setPath(prev => [...prev, { id: folder.id, name: folder.name }]);
    };
    
    const handleBreadcrumbClick = (index) => {
        if (index === -1) {
            setDestinationId(null);
            setPath([]);
        } else {
            const newPath = path.slice(0, index + 1);
            setDestinationId(newPath[newPath.length - 1].id);
            setPath(newPath);
        }
    };
    
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-lg flex flex-col h-[60vh] max-h-[600px]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Move {itemToMove?.name}</h3>
                    <button onClick={onClose} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors cursor-pointer">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {/* Mini Breadcrumbs */}
                <div className="flex items-center text-sm font-semibold text-gray-500 mb-4 bg-gray-50 px-3 py-2 rounded-xl overflow-x-auto">
                    <button onClick={() => handleBreadcrumbClick(-1)} className="hover:text-black transition-colors whitespace-nowrap cursor-pointer">
                        All Files
                    </button>
                    {path.map((segment, idx) => (
                        <React.Fragment key={segment.id}>
                            <span className="mx-2 text-gray-300">/</span>
                            <button onClick={() => handleBreadcrumbClick(idx)} className={`hover:text-black transition-colors whitespace-nowrap cursor-pointer ${idx === path.length - 1 ? 'text-black' : ''}`}>
                                {segment.name}
                            </button>
                        </React.Fragment>
                    ))}
                </div>
                
                {/* Folder List */}
                <div className="grow overflow-y-auto border border-gray-100 rounded-2xl p-2 mb-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black" />
                        </div>
                    ) : modalFolders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5" />
                            </svg>
                            <span className="text-sm font-semibold">No folders here</span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1">
                            {modalFolders.map(folder => (
                                <div key={folder.id} onClick={() => handleNavigateIn(folder)} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer group transition-colors">
                                    <svg className="w-6 h-6 text-[#d2ff72]" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                                    </svg>
                                    <span className="font-semibold text-gray-700 group-hover:text-black">{folder.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Action Footer */}
                <div className="flex justify-end gap-3 pt-2">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer">
                        Cancel
                    </button>
                    <button onClick={() => onSubmit(destinationId)} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[#d2ff72] text-black hover:bg-[#c2ef62] transition-colors cursor-pointer shadow-sm">
                        Move Here
                    </button>
                </div>
            </div>
        </div>
    );
};
export default MoveModal;
