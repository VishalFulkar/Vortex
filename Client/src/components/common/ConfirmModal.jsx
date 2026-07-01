import React from 'react';

const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 select-none">
    <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 p-6 w-full max-w-sm flex flex-col gap-5 text-center">
      <div className="mx-auto w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
      </div>
      <p className="text-sm font-bold text-gray-800">{message}</p>
      <div className="flex gap-3 justify-center mt-2">
        <button
          onClick={onCancel}
          className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-black transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer shadow-sm"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;
