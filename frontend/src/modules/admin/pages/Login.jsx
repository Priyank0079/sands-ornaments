import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import loginBg from '../assets/admin-login-bg.png';
import logoName from '../assets/sands-logoname.png';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simulated login
        setTimeout(() => {
            if (email === 'admin@sands.com' && password === 'admin123') {
                localStorage.setItem('adminAuth', 'true');
                navigate('/admin');
            } else {
                setError('Invalid credentials');
                setLoading(false);
            }
        }, 800);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden">
            {/* Background Image with Zoom Animation */}
            <div
                className="absolute inset-0 z-0 scale-105 animate-slow-zoom"
                style={{
                    backgroundImage: `url(${loginBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-[2px]" />

            <div className="max-w-md w-full relative z-20">
                {/* Branding Section */}
                <div className="text-center mb-10 flex flex-col items-center">
                    <img
                        src={logoName}
                        alt="Sands Ornaments"
                        className="h-20 md:h-24 w-auto object-contain brightness-0 invert drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
                    />
                    <div className="mt-4 flex items-center gap-4 w-full px-6">
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                        <p className="text-white/70 text-[10px] uppercase tracking-[0.5em] font-bold whitespace-nowrap">Administrative Portal</p>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                    </div>
                </div>

                {/* Premium Login Card */}
                <div className="bg-white/95 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white/20">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 text-xs font-bold animate-shake">
                                <AlertCircle className="w-4 h-4" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#8D6E63] uppercase tracking-widest ml-1">Secure Email</label>
                            <div className="relative group">
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@sands.com"
                                    className="w-full bg-[#FDFBF7] border border-[#EFEBE9] rounded-xl py-4 px-12 text-sm focus:outline-none focus:border-[#8D6E63] focus:ring-4 focus:ring-[#8D6E63]/5 transition-all shadow-inner"
                                />
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#8D6E63] transition-colors" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#8D6E63] uppercase tracking-widest ml-1">Encrypted Password</label>
                            <div className="relative group">
                                <input
                                    required
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-[#FDFBF7] border border-[#EFEBE9] rounded-xl py-4 px-12 text-sm focus:outline-none focus:border-[#8D6E63] focus:ring-4 focus:ring-[#8D6E63]/5 transition-all shadow-inner"
                                />
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#8D6E63] transition-colors" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#3E2723] text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 hover:bg-[#2D1B18] transition-all shadow-xl shadow-[#3E2723]/20 active:scale-[0.98] disabled:opacity-70 group"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Authenticate Access</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                        <div className="mt-4 text-center">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Use these credentials</p>
                            <p className="text-xs font-mono text-[#3E2723] font-bold bg-[#FDFBF7] inline-block px-3 py-1 rounded border border-[#EFEBE9]">
                                admin@sands.com / admin123
                            </p>
                        </div>
                    </form>
                </div>

                {/* Footer Info */}
                <p className="text-center mt-10 text-[10px] text-white/40 font-bold tracking-[0.3em] uppercase">
                    &copy; 2025 Sands Ornaments &middot; Highly Secure Access
                </p>
            </div>

            <style>
                {`
                    @keyframes slow-zoom {
                        0% { transform: scale(1); }
                        100% { transform: scale(1.15); }
                    }
                    .animate-slow-zoom {
                        animation: slow-zoom 30s ease-in-out infinite alternate;
                    }
                    .animate-shake {
                        animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                    }
                    @keyframes shake {
                        10%, 90% { transform: translate3d(-1px, 0, 0); }
                        20%, 80% { transform: translate3d(2px, 0, 0); }
                        30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                        40%, 60% { transform: translate3d(4px, 0, 0); }
                    }
                `}
            </style>
        </div>
    );
};

export default AdminLogin;
