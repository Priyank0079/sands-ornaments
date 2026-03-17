import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, ArrowRight, ShieldCheck, Phone } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import loginBg from '../assets/admin-login-bg.png';

const SellerLogin = () => {
    const navigate = useNavigate();
    const { sellerLogin } = useAuth();
    const [loginType, setLoginType] = useState('email'); // 'email' or 'mobile'
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        sellerService.initTestAccount();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await sellerLogin(formData.identifier, formData.password);
            if (res.success) {
                navigate('/seller/dashboard');
            } else {
                setError(res.message || 'Invalid merchant credentials');
            }
        } catch (err) {
            setError('Connection failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "w-full bg-[#FDFBF7] border border-[#EFEBE9] rounded-xl py-4 px-12 text-sm focus:outline-none focus:border-[#8D6E63] focus:ring-4 focus:ring-[#8D6E63]/5 transition-all shadow-inner";
    const iconClasses = "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#8D6E63] transition-colors mt-[2px]";

    return (
        <div className="min-h-screen bg-[#FDF5F6] flex flex-col lg:flex-row overflow-hidden font-sans">
            {/* Left Decor */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#3E2723] items-center justify-center p-12">
                <img src={loginBg} className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay" alt="bg" />
                <div className="relative z-10 max-w-lg text-center">
                    <h1 className="text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-none animate-in slide-in-from-bottom-5 duration-700">
                        Merchant <br/><span className="text-[#D39A9F]">Command</span>
                    </h1>
                    <p className="text-gray-300 text-lg font-medium leading-relaxed animate-in fade-in duration-1000 delay-300">
                        Manage your orders, inventory, and business performance with our tailored tools.
                    </p>
                </div>
            </div>

            {/* Right Logic */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-20 overflow-y-auto">
                <div className="w-full max-w-md space-y-10">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Merchant Gateway</h2>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Secure authentication for merchants</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 animate-in shake-1 overflow-hidden">
                                <AlertCircle size={18} className="shrink-0" />
                                <span className="text-xs font-bold uppercase tracking-widest leading-relaxed">{error}</span>
                            </div>
                        )}

                        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-4">
                            <button 
                                type="button"
                                onClick={() => setLoginType('email')} 
                                className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${loginType === 'email' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                Email
                            </button>
                            <button 
                                type="button"
                                onClick={() => setLoginType('mobile')} 
                                className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${loginType === 'mobile' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                Mobile
                            </button>
                        </div>

                        <div className="space-y-1">
                            <div className="relative group">
                                <input 
                                    required
                                    type={loginType === 'email' ? 'email' : 'text'}
                                    name="identifier"
                                    value={formData.identifier}
                                    onChange={handleChange}
                                    className={inputClasses}
                                    placeholder={loginType === 'email' ? 'Enter Email Address' : 'Enter Mobile Number'}
                                />
                                {loginType === 'email' ? <Mail className={iconClasses} /> : <Phone className={iconClasses} />}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="relative group">
                                <input 
                                    required
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={inputClasses}
                                    placeholder="Enter Security Password"
                                />
                                <Lock className={iconClasses} />
                            </div>
                            <div className="flex justify-end p-1">
                                <button type="button" className="text-[10px] font-black text-[#8D6E63] uppercase tracking-widest hover:text-[#3E2723] transition-colors">Forgot Password?</button>
                            </div>
                        </div>

                        <button 
                            disabled={loading}
                            type="submit" 
                            className="w-full bg-[#3E2723] text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-[#3E2723]/20 hover:bg-[#2D1B18] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Log In Now
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center pt-8 border-t border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Don't have a seller account?</p>
                        <Link to="/seller/register" className="inline-flex items-center gap-3 bg-[#D39A9F] text-white px-8 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#C88B90] transition-all shadow-xl shadow-[#D39A9F]/20">
                            Create New Account <LogIn size={14} />
                        </Link>
                    </div>

                    <div className="flex items-center justify-center gap-2 pt-4">
                        <ShieldCheck size={14} className="text-gray-300" />
                        <span className="text-[8px] font-black text-gray-300 uppercase tracking-[0.3em]">Encrypted & Secure Session</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerLogin;
