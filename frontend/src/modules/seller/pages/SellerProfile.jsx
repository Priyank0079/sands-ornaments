import React, { useState, useEffect } from 'react';
import { User, Shield, Lock, CheckCircle2, AlertCircle, Building2, Mail, Phone, Landmark, FileText, FileBadge2, ExternalLink, CalendarDays } from 'lucide-react';
import { sellerService } from '../services/sellerService';
import toast from 'react-hot-toast';

const SellerProfile = () => {
    const [seller, setSeller] = useState(null);
    const [profile, setProfile] = useState({
        fullName: '',
        shopName: '',
        email: '',
        mobileNumber: '',
        gstNumber: '',
        panNumber: '',
        bisNumber: '',
        shopAddress: '',
        city: '',
        state: '',
        pincode: '',
        bankAccount: {
            accountNumber: '',
            ifscCode: ''
        }
    });
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    useEffect(() => {
        let active = true;
        const loadProfile = async () => {
            const data = await sellerService.getProfile();
            if (!active) return;
            const resolved = data || sellerService.getCurrentSeller();
            if (!resolved) return;
            setSeller(resolved);
            setProfile({
                fullName: resolved.fullName || '',
                shopName: resolved.shopName || '',
                email: resolved.email || '',
                mobileNumber: resolved.mobileNumber || '',
                gstNumber: resolved.gstNumber || '',
                panNumber: resolved.panNumber || '',
                bisNumber: resolved.bisNumber || '',
                shopAddress: resolved.shopAddress || '',
                city: resolved.city || '',
                state: resolved.state || '',
                pincode: resolved.pincode || '',
                bankAccount: {
                    accountNumber: resolved.bankAccount?.accountNumber || '',
                    ifscCode: resolved.bankAccount?.ifscCode || ''
                }
            });
            sellerService.setCurrentSeller(resolved);
            window.dispatchEvent(new Event('seller-profile-updated'));
        };
        loadProfile();
        return () => { active = false; };
    }, []);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('bankAccount.')) {
            const key = name.split('.')[1];
            setProfile(prev => ({
                ...prev,
                bankAccount: { ...prev.bankAccount, [key]: value }
            }));
            return;
        }
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        const normalizedProfile = {
            ...profile,
            fullName: profile.fullName.trim(),
            shopName: profile.shopName.trim(),
            email: profile.email.trim().toLowerCase(),
            mobileNumber: profile.mobileNumber.replace(/\D/g, ''),
            gstNumber: profile.gstNumber.trim().toUpperCase(),
            panNumber: profile.panNumber.trim().toUpperCase(),
            bisNumber: profile.bisNumber.trim().toUpperCase(),
            shopAddress: profile.shopAddress.trim(),
            city: profile.city.trim(),
            state: profile.state.trim(),
            pincode: profile.pincode.replace(/\D/g, ''),
            bankAccount: {
                accountNumber: profile.bankAccount.accountNumber.replace(/\D/g, ''),
                ifscCode: profile.bankAccount.ifscCode.trim().toUpperCase()
            }
        };

        if (!normalizedProfile.fullName || !normalizedProfile.shopName || !normalizedProfile.email || !normalizedProfile.mobileNumber) {
            toast.error('Full name, shop name, email, and mobile number are required');
            return;
        }
        if (normalizedProfile.mobileNumber.length !== 10) {
            toast.error('Enter a valid 10-digit mobile number');
            return;
        }
        if (normalizedProfile.pincode && normalizedProfile.pincode.length !== 6) {
            toast.error('Enter a valid 6-digit pincode');
            return;
        }

        setSavingProfile(true);
        const res = await sellerService.updateProfile(normalizedProfile);
        if (res.success) {
            const updated = res.data?.seller || res.seller;
            if (updated) {
                setSeller(updated);
                sellerService.setCurrentSeller(updated);
                window.dispatchEvent(new Event('seller-profile-updated'));
            }
            toast.success(res.message || 'Profile updated');
        } else {
            toast.error(res.message || 'Unable to update profile');
        }
        setSavingProfile(false);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwords.new.length < 4) {
            toast.error('Password must be at least 4 characters long');
            return;
        }
        if (passwords.new !== passwords.confirm) {
            toast.error('New passwords do not match');
            return;
        }
        setSavingPassword(true);
        const res = await sellerService.changePassword({
            currentPassword: passwords.current,
            newPassword: passwords.new
        });
        if (res.success) {
            toast.success(res.message || 'Password updated');
            setPasswords({ current: '', new: '', confirm: '' });
        } else {
            toast.error(res.message || 'Unable to update password');
        }
        setSavingPassword(false);
    };

    if (!seller) return <div className="p-12 text-center text-gray-400 font-black uppercase tracking-widest">Loading profile...</div>;

    const inputClasses = "w-full bg-[#FDFBF7] border border-[#EFEBE9] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#8D6E63] focus:ring-4 focus:ring-[#8D6E63]/5 transition-all shadow-inner";
    const labelClasses = "text-[10px] font-black text-[#8D6E63] uppercase tracking-widest ml-1 mb-2 block";
    const statusMeta = seller.status === 'APPROVED'
        ? { badge: 'Verified Merchant', tone: 'text-emerald-500' }
        : seller.status === 'REJECTED'
            ? { badge: 'Rejected Merchant', tone: 'text-red-500' }
            : { badge: 'Pending Approval', tone: 'text-amber-500' };
    const documentCards = [
        { key: 'aadharUrl', label: 'Aadhar', url: seller.documents?.aadharUrl },
        { key: 'shopLicenseUrl', label: 'Shop License', url: seller.documents?.shopLicenseUrl },
        { key: 'certificateUrl', label: 'Certificate', url: seller.documents?.certificateUrl }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in duration-500 font-sans">
            <div>
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Merchant Identity</h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Manage institutional credentials & security parameters</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#3E2723] rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-[#3E2723]/30">
                        <div className="relative z-10 space-y-6">
                            <div className="w-16 h-16 bg-white/10 rounded-[1.5rem] border border-white/20 flex items-center justify-center">
                                <User size={28} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-tight leading-none mb-2">{seller.fullName || 'Seller'}</h2>
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">Registered Administrator</p>
                            </div>
                            <div className="pt-6 border-t border-white/10 space-y-4">
                                <div className="flex items-center gap-2">
                                    <Shield size={14} className={statusMeta.tone} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        {statusMeta.badge}
                                    </span>
                                </div>
                                <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest leading-tight">
                                    {seller.shopName || 'Shop name not set'}
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    </div>

                    <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm space-y-6">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Institutional Contact</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Email Endpoint</p>
                                <p className="text-sm font-bold text-gray-900">{seller.email || 'Not available'}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Telecommunication</p>
                                <p className="text-sm font-bold text-gray-900">{seller.mobileNumber || 'Not available'}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Registration Date</p>
                                <p className="text-sm font-bold text-gray-900">{seller.registrationDate ? new Date(seller.registrationDate).toLocaleDateString() : 'Not available'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm space-y-6">
                        <div className="flex items-center gap-3">
                            <FileBadge2 size={16} className="text-[#3E2723]" />
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Submitted Documents</h3>
                        </div>
                        <div className="space-y-3">
                            {documentCards.map((doc) => (
                                <div key={doc.key} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{doc.label}</p>
                                        <p className="text-xs font-bold text-gray-900 mt-1">{doc.url ? 'Uploaded' : 'Not uploaded'}</p>
                                    </div>
                                    {doc.url ? (
                                        <a
                                            href={doc.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#8D6E63] hover:text-[#3E2723]"
                                        >
                                            View <ExternalLink size={12} />
                                        </a>
                                    ) : (
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Unavailable</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="p-3 bg-[#8D6E63]/10 rounded-xl">
                                <Building2 size={20} className="text-[#3E2723]" />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Business Profile</h3>
                        </div>

                        <form onSubmit={handleProfileSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClasses}>Full Name</label>
                                    <input name="fullName" value={profile.fullName} onChange={handleProfileChange} className={inputClasses} placeholder="Full name" />
                                </div>
                                <div>
                                    <label className={labelClasses}>Shop Name</label>
                                    <input name="shopName" value={profile.shopName} onChange={handleProfileChange} className={inputClasses} placeholder="Shop name" />
                                </div>
                                <div>
                                    <label className={labelClasses}>Email</label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input name="email" type="email" value={profile.email} onChange={handleProfileChange} className={`${inputClasses} pl-10`} placeholder="Email address" autoComplete="email" />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClasses}>Mobile Number</label>
                                    <div className="relative">
                                        <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input name="mobileNumber" value={profile.mobileNumber} onChange={handleProfileChange} className={`${inputClasses} pl-10`} placeholder="Mobile number" inputMode="numeric" maxLength={10} autoComplete="tel" />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClasses}>Shop Address</label>
                                    <input name="shopAddress" value={profile.shopAddress} onChange={handleProfileChange} className={inputClasses} placeholder="Street, area" />
                                </div>
                                <div>
                                    <label className={labelClasses}>City</label>
                                    <input name="city" value={profile.city} onChange={handleProfileChange} className={inputClasses} placeholder="City" />
                                </div>
                                <div>
                                    <label className={labelClasses}>State</label>
                                    <input name="state" value={profile.state} onChange={handleProfileChange} className={inputClasses} placeholder="State" />
                                </div>
                                <div>
                                    <label className={labelClasses}>Pincode</label>
                                    <input name="pincode" value={profile.pincode} onChange={handleProfileChange} className={inputClasses} placeholder="Pincode" inputMode="numeric" maxLength={6} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className={labelClasses}>GST Number</label>
                                    <input name="gstNumber" value={profile.gstNumber} onChange={handleProfileChange} className={inputClasses} placeholder="GST" />
                                </div>
                                <div>
                                    <label className={labelClasses}>PAN Number</label>
                                    <input name="panNumber" value={profile.panNumber} onChange={handleProfileChange} className={inputClasses} placeholder="PAN" />
                                </div>
                                <div>
                                    <label className={labelClasses}>BIS Number</label>
                                    <input name="bisNumber" value={profile.bisNumber} onChange={handleProfileChange} className={inputClasses} placeholder="BIS" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClasses}>Bank Account Number</label>
                                    <div className="relative">
                                        <Landmark className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input name="bankAccount.accountNumber" value={profile.bankAccount.accountNumber} onChange={handleProfileChange} className={`${inputClasses} pl-10`} placeholder="Account number" inputMode="numeric" />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClasses}>IFSC Code</label>
                                    <div className="relative">
                                        <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input name="bankAccount.ifscCode" value={profile.bankAccount.ifscCode} onChange={handleProfileChange} className={`${inputClasses} pl-10`} placeholder="IFSC code" />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={savingProfile}
                                className="w-full bg-[#3E2723] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-[#3E2723]/20 hover:bg-[#2D1B18] transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
                            >
                                {savingProfile ? (
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>Save Profile <CheckCircle2 size={16} className="group-hover:scale-110 transition-transform" /></>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="p-3 bg-[#8D6E63]/10 rounded-xl">
                                <Lock size={20} className="text-[#3E2723]" />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Authentication Protocol</h3>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="space-y-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className={labelClasses}>Current Security Phrase</label>
                                    <input 
                                        type="password" 
                                        name="current"
                                        value={passwords.current}
                                        onChange={handlePasswordChange}
                                        className={inputClasses}
                                        placeholder="********"
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
                                            placeholder="Min 4 Characters"
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
                                    Security Update: Changing your authentication phrase will apply to future seller logins. Use a value you can remember and keep it private.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={savingPassword}
                                className="w-full bg-[#3E2723] text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-[#3E2723]/20 hover:bg-[#2D1B18] transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
                            >
                                {savingPassword ? (
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
