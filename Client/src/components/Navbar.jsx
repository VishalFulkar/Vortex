import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Navbar = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="w-full max-w-7xl mx-auto mb-6">
            <div className="bg-white px-6 py-3 rounded-full flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100">
                {/* Logo */}
                <Link to="/" className="text-xl font-extrabold tracking-wider text-black hover:opacity-80 transition-opacity">
                    VORTEX
                </Link>

                {/* Nav Links - hidden on small mobile screen, visible on md+ */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
                    <Link to="/" className="hover:text-black transition-colors">Home</Link>
                    <Link to="/files" className="relative group cursor-pointer hover:text-black transition-colors flex items-center gap-1">
                        <span>All Files</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </Link>
                    <Link to="/shared" className="hover:text-black transition-colors">Shared</Link>
                    <Link to="/activity" className="hover:text-black transition-colors">Activity</Link>
                </nav>

                {/* Search bar & Actions */}
                <div className="flex items-center gap-4">
                    {/* Search Input */}
                    <div className="relative hidden sm:block">
                        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Search cloud files..."
                            className="bg-[#f3f4f6] text-sm text-gray-700 placeholder-gray-400 pl-10 pr-4 py-2 rounded-full w-56 focus:outline-none focus:ring-1 focus:ring-black/20 focus:bg-white transition-all border border-transparent focus:border-gray-200"
                        />
                    </div>

                    {/* User profile / Logout / Login */}
                    {user ? (
                        <div className="flex items-center gap-3 border-l border-gray-100 pl-4">
                            {/* Avatar */}
                            <div className="w-8 h-8 rounded-full bg-[#1c3f10] text-[#d2ff72] flex items-center justify-center font-bold text-xs shadow-sm select-none">
                                {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                            </div>

                            {/* User details */}
                            <div className="hidden lg:flex flex-col text-left">
                                <span className="text-[11px] font-bold text-black leading-tight select-none">
                                    {user.name}
                                </span>
                                <span className="text-[9px] text-gray-400 font-semibold select-none uppercase tracking-wider">
                                    Owner
                                </span>
                            </div>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="bg-[#d2ff72] text-black text-xs font-bold px-4 py-2 rounded-full hover:bg-[#c3f05e] active:scale-95 transition-all shadow-[0_4px_12px_rgba(210,255,114,0.2)] ml-1 cursor-pointer"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-[#d2ff72] text-black text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#c3f05e] active:scale-95 transition-all shadow-[0_4px_14px_rgba(210,255,114,0.3)]"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
