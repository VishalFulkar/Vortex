import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const ProtectedRoute = ({ children }) => {
    const { user, isCheckingAuth } = useAuthStore();

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] flex flex-col justify-center items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black" />
                <span className="mt-3 text-sm text-gray-500 font-semibold">Checking authorization...</span>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
