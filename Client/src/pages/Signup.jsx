import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import aboutUsVault from '../assets/holographic_passcard.png';
import rightColumnVault from '../assets/holographic_data_sphere.png';


const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');

    const navigate = useNavigate();
    const { register, isLoading, error, clearError } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        clearError();

        if (!name || !email || !password) {
            setLocalError('Please fill in all fields.');
            return;
        }

        const result = await register(name, email, password);
        if (result.success) {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col p-4 md:p-6 text-black select-none">
            {/* Main Split Layout */}
            <main className="w-full max-w-7xl mx-auto grow grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-4">
                {/* Left Column */}
                <section className="lg:col-span-5 flex flex-col justify-between py-4 lg:py-6 gap-10">

                    {/* Top text and Header */}
                    <div className="flex flex-col gap-4">
                        <span className="text-gray-400 text-xs font-extrabold tracking-widest uppercase">
                            JOIN THE COMMUNITY
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.15] text-black tracking-tight">
                            CREATE A{' '}
                            <span className="relative inline-block z-10">
                                NEW ACCOUNT
                                <span className="absolute left-0 bottom-1.5 w-full h-[18px] bg-[#d2ff72]/80 -z-10 rounded-sm"></span>
                            </span>{' '}
                            WITH US.
                            <span className="inline-flex items-center ml-2 relative top-1">
                                <span className="w-8 h-8 rounded-full bg-[#1c3f10] border-2 border-white -mr-3 shadow-sm"></span>
                                <span className="w-8 h-8 rounded-full bg-[#4c7c2f] border-2 border-white -mr-3 shadow-sm"></span>
                                <span className="w-8 h-8 rounded-full bg-[#d2ff72] border-2 border-white shadow-sm"></span>
                            </span>
                        </h1>
                    </div>

                    {/* Navigation to Login */}
                    <div className="flex flex-col gap-2">
                        <p className="text-gray-400 text-sm font-medium">Already have account?</p>
                        <div>
                            <Link
                                to="/login"
                                className="text-black font-bold border-b-2 border-black pb-1 inline-flex items-center gap-2 hover:text-gray-600 hover:border-gray-400 transition-colors"
                            >
                                <span>Login here</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* About Us card */}
                    <div className="relative rounded-4xl overflow-hidden aspect-[2.3/1] w-full flex items-end p-6 bg-black shadow-lg group">
                        <img
                            src={aboutUsVault}
                            alt="Security Vault"
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="relative z-10 flex gap-4 text-white text-xs md:text-sm items-start max-w-md">
                            <span className="font-extrabold tracking-wider uppercase text-white shrink-0 mt-0.5">
                                Vortex
                            </span>
                        </div>
                    </div>

                </section>

                {/* Right Column */}
                <section className="lg:col-span-7 relative rounded-4xl overflow-hidden min-h-[550px] lg:min-h-[650px] flex flex-col justify-between p-6 sm:p-8 bg-black shadow-xl">
                    <img
                        src={rightColumnVault}
                        alt="Secure Cloud Storage"
                        className="absolute inset-0 w-full h-full object-cover opacity-75"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30"></div>

                    <div className="relative z-10 flex flex-col text-white">
                        <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase opacity-80">
                            VORTEX
                        </span>
                        <span className="text-[10px] sm:text-xs opacity-50 font-medium">
                            Cloud Storage
                        </span>
                    </div>

                    {/* Signup floating card */}
                    <div className="relative z-10 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-full max-w-[360px] mx-auto p-6 md:p-7 flex flex-col gap-5 border border-white/10">
                        <h2 className="text-black font-extrabold text-lg text-center tracking-tight">
                            Create your account
                        </h2>

                        {/* Alerts */}
                        {(localError || error) && (
                            <div className="bg-red-50 text-red-600 text-xs py-2 px-3 rounded-lg border border-red-100 font-medium">
                                {localError || error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* Full Name field */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border-b border-gray-200 py-1.5 text-sm text-black placeholder-gray-300 focus:outline-none focus:border-black transition-colors bg-transparent"
                                />
                            </div>

                            {/* Email field */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="JohnDoe@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border-b border-gray-200 py-1.5 text-sm text-black placeholder-gray-300 focus:outline-none focus:border-black transition-colors bg-transparent"
                                />
                            </div>

                            {/* Password field */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border-b border-gray-200 py-1.5 text-sm text-black placeholder-gray-300 focus:outline-none focus:border-black transition-colors bg-transparent"
                                />
                            </div>

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-black text-white font-semibold py-3 rounded-full hover:bg-gray-800 active:scale-[0.98] transition-all text-sm tracking-wide mt-2 flex items-center justify-center gap-2 disabled:bg-gray-400"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span>Registering...</span>
                                    </>
                                ) : (
                                    'Create account'
                                )}
                            </button>
                        </form>

                        <div className="w-full h-14 rounded-xl overflow-hidden relative mt-1">
                            <img
                                src={aboutUsVault}
                                alt="Vault detail"
                                className="absolute inset-0 w-full h-full object-cover object-bottom scale-125 origin-bottom opacity-90"
                            />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Signup;