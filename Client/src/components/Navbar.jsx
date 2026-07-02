import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Navbar = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

    // Sync input when URL changes (e.g. going back)
    useEffect(() => {
        setSearchTerm(searchParams.get('q') || '');
    }, [searchParams]);

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = searchTerm.trim();
            if (val) {
                navigate(`/files?q=${encodeURIComponent(val)}`);
            } else {
                navigate(`/files`);
            }
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="w-full max-w-7xl mx-auto mb-6 relative z-50">
            <div className="bg-white px-6 py-3 rounded-full flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100">
                
                {/* Left side: Hamburger (mobile) + Logo */}
                <div className="flex items-center gap-3">
                    <button 
                        className="md:hidden p-1.5 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                    <Link to="/" className="text-xl font-extrabold tracking-wider text-black hover:opacity-80 transition-opacity">
                        VORTEX
                    </Link>
                </div>

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
                    <Link to="/trash" className="hover:text-black transition-colors">Trash</Link>
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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            className="bg-[#f3f4f6] text-sm text-gray-700 placeholder-gray-400 pl-10 pr-4 py-2 rounded-full w-56 focus:outline-none focus:ring-1 focus:ring-black/20 focus:bg-white transition-all border border-transparent focus:border-gray-200"
                        />
                    </div>

                    {/* User profile / Logout / Login */}
                    {user ? (
                        <div className="flex items-center gap-3 md:border-l md:border-gray-100 md:pl-4">
                            {/* Avatar */}
                            <div className="w-8 h-8 rounded-full bg-[#1c3f10] text-[#d2ff72] flex items-center justify-center font-bold text-xs shadow-sm select-none shrink-0">
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
                                className="bg-[#d2ff72] text-black text-xs font-bold px-4 py-2 rounded-full hover:bg-[#c3f05e] active:scale-95 transition-all shadow-[0_4px_12px_rgba(210,255,114,0.2)] ml-1 cursor-pointer shrink-0"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-[#d2ff72] text-black text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#c3f05e] active:scale-95 transition-all shadow-[0_4px_14px_rgba(210,255,114,0.3)] shrink-0"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-16 left-0 right-0 z-50 bg-white shadow-[0_20px_50px_rgb(0,0,0,0.1)] rounded-2xl border border-gray-100 md:hidden overflow-hidden flex flex-col mx-2 animate-in fade-in slide-in-from-top-4 duration-200">
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-black border-b border-gray-50 flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Home
                    </Link>
                    <Link to="/files" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-black border-b border-gray-50 flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        All Files
                    </Link>
                    <Link to="/shared" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-black border-b border-gray-50 flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 10.742l4.636-2.318a3 3 0 10-.203-1.028l-4.636 2.318a3 3 0 100 4.344l4.636-2.318a3 3 0 10.203-1.028l-4.636 2.318z" />
                        </svg>
                        Shared
                    </Link>
                    <Link to="/activity" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-black flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Activity
                    </Link>
                </div>
            )}
        </header>
    );
};

export default Navbar;
