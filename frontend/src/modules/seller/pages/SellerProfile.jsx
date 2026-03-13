import React, { useState, useEffect } from 'react';
import { User, Shield, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { sellerService } from '../services/sellerService';
import toast from 'react-hot-toast';

const SellerProfile = () => {
    const [seller, setSeller] = useState(null);
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setSeller(sellerService.getCurrentSeller());
    }, []);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (passwords.new.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return;
        }

        if (passwords.new !== passwords.confirm) {
            toast.error('New passwords do not match');
            return;
        }

        setLoading(true);
        // Simulation delay
        setTimeout(() => {
            setLoading(false);
            toast.success('Authentication credentials updated successfully');
            setPasswords({ current: '', new: '', confirm: '' });
        }, 1000);
    };

    if (!seller) return null;

    const inputClasses = "w-full bg-[#FDFBF7] border border-[#EFEBE9] rounded-xl py-4 px-6 text-sm focus:outline-none focus:border-[#8D6E63] focus:ring-4 focus:ring-[#8D6E63]/5 transition-all shadow-inner";
    const labelClasses = "text-[10px] font-black text-[#8D6E63] uppercase tracking-widest ml-1 mb-2 block";

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20 animate-in fade-in duration-500 font-sans">
            <div>
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Merchant Identity</h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Manage institutional credentials & security parameters</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Snapshot */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-[#3E2723] rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-[#3E2723]/30">
                        <div className="relative z-10 space-y-6">
                            <div className="w-16 h-16 bg-white/10 rounded-[1.5rem] border border-white/20 flex items-center justify-center">
                                <User size={28} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-tight leading-none mb-2">{seller.fullName}</h2>
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">Registered Administrator</p>
                            </div>
                            <div className="pt-6 border-t border-white/10 space-y-4">
                                <div className="flex items-center gap-2">
                                    <Shield size={14} className="text-emerald-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Verified Merchant</span>
                                </div>
                                <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest leading-tight">
                                    {seller.shopName}
                                </div>
                            </div>
                        </div>
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    </div>

                    <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm space-y-6">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Institutional Contact</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Email Endpoint</p>
                                <p className="text-sm font-bold text-gray-900">{seller.email}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Telecommunication</p>
                                <p className="text-sm font-bold text-gray-900">{seller.shopPhone || seller.fullName.split(' ')[0] + ' Support'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Password Change Section */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="p-3 bg-[#8D6E63]/10 rounded-xl">
                                <Lock size={20} className="text-[#3E2723]" />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Authentication Protocol</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className={labelClasses}>Current Security Phrase</label>
                                    <input 
                                        type="password" 
                                        name="current"
                                        value={passwords.current}
                                        onChange={handlePasswordChange}
                                        className={inputClasses}
                                        placeholder="············"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className={labelClasses}>New Security Phrase</label>
                                        <input 
                                            type="password"
                                            name="new"
                                            value={passwords.new}
                                            onChange={handlePasswordChange}
                                            className={inputClasses}
                                            placeholder="Min 8 Characters"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className={labelClasses}>Confirm Logic</label>
                                        <input 
                                            type="password"
                                            name="confirm"
                                            value={passwords.confirm}
                                            onChange={handlePasswordChange}
                                            className={inputClasses}
                                            placeholder="Repeat Phrase"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-amber-50/50 rounded-2xl border border-amber-100 flex items-start gap-4">
                                <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-[10px] font-bold text-amber-800 leading-relaxed uppercase">
                                    Security Update: Changing your authentication phrase will invalidate current sessions across all devices for this administrator profile.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#3E2723] text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-[#3E2723]/20 hover:bg-[#2D1B18] transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>Authorize Update <CheckCircle2 size={16} className="group-hover:scale-110 transition-transform" /></>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerProfile;
