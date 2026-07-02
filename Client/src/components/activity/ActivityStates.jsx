import React from 'react';

export const ActivityLoading = () => (
    <div className="flex flex-col items-center justify-center py-24 m-auto">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black" />
        <span className="mt-4 text-sm text-gray-400 font-semibold">Loading activity...</span>
    </div>
);

export const ActivityError = ({ error }) => (
    <div className="flex flex-col items-center justify-center py-24 m-auto text-center px-4">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <p className="text-sm text-gray-500 font-semibold">{error}</p>
    </div>
);

export const ActivityEmpty = () => (
    <div className="flex flex-col items-center justify-center py-24 m-auto text-center px-4">
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">No Activity Yet</h3>
        <p className="text-sm text-gray-500 max-w-xs mx-auto">Your recent file actions will appear here once you start using Vortex.</p>
    </div>
);
