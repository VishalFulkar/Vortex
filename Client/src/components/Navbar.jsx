import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
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
                    <div className="relative group cursor-pointer hover:text-black transition-colors flex items-center gap-1">
                        <span>Get started</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    <a href="#about" className="hover:text-black transition-colors">About</a>
                    <a href="#forum" className="hover:text-black transition-colors">Forum</a>
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

                    {/* Login Pill Button */}
                    <Link
                        to="/login"
                        className="bg-[#d2ff72] text-black text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#c3f05e] active:scale-95 transition-all shadow-[0_4px_14px_rgba(210,255,114,0.3)]"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
