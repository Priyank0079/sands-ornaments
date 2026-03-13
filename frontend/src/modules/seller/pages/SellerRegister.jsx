import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    User, Phone, Mail, Lock, Store, MapPin, Building, Hash, 
    CreditCard, Landmark, FileUp, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck 
} from 'lucide-react';
import { sellerService } from '../services/sellerService';
import loginBg from '../assets/admin-login-bg.png';

const SellerRegister = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    
    const [formData, setFormData] = useState({
        // Personal
        fullName: '',
        mobileNumber: '',
        email: '',
        password: '',
        // Business
        shopName: '',
        shopAddress: '',
        city: '',
        state: '',
        pincode: '',
        // Verification
        gstNumber: '',
        panNumber: '',
        bisNumber: '',
        // Documents (Simulation)
        aadhar: null,
        shopLicense: null,
        certificate: null,
        // Bank
        accountNumber: '',
        ifscCode: ''
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleNext = (e) => {
        e.preventDefault();
        setStep(prev => prev + 1);
        window.scrollTo(0, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(async () => {
            const res = await sellerService.register(formData);
            if (res.success) {
                setSubmitted(true);
            }
            setLoading(false);
        }, 1500);
    };

    const inputClasses = "w-full bg-[#FDFBF7] border border-[#EFEBE9] rounded-xl py-4 px-12 text-sm focus:outline-none focus:border-[#8D6E63] focus:ring-4 focus:ring-[#8D6E63]/5 transition-all shadow-inner";
    const labelClasses = "text-[10px] font-black text-[#8D6E63] uppercase tracking-widest ml-1 mb-2 block";
    const iconClasses = "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#8D6E63] transition-colors mt-[3px]";

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#FDF5F6] flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-[2.5rem] p-12 shadow-2xl text-center space-y-6 border border-white animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Application Submitted</h2>
                    <p className="text-gray-500 text-sm leading-relaxed font-medium">
                        Your account has been submitted for admin verification. You can login only after approval.
                    </p>
                    <button 
                        onClick={() => navigate('/seller/login')}
                        className="w-full bg-[#3E2723] text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-[#3E2723]/20 hover:bg-[#2D1B18] transition-all"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDF5F6] flex flex-col lg:flex-row overflow-hidden">
            {/* Left: Design/Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#3E2723] items-center justify-center p-12 overflow-hidden">
                <img src={loginBg} className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay scale-110" alt="bg" />
                <div className="relative z-10 max-w-lg text-center">
                    <h1 className="text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-none">Strategic <br/><span className="text-[#D39A9F]">Alliance</span></h1>
                    <p className="text-gray-300 text-lg font-medium leading-relaxed">Join the most prestigious network of authentic jewellery curators. Scale your operations with our enterprise-grade merchant toolkit.</p>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
            </div>

            {/* Right: Multi-step Form */}
            <div className="w-full lg:w-1/2 p-6 lg:p-20 overflow-y-auto">
                <div className="max-w-xl mx-auto space-y-10">
                    <div className="flex justify-between items-center">
                        <div>
                             <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Partner Onboarding</h2>
                             <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-1 space-x-2">
                                <span>PHASE {step} OF 4</span>
                                <span className="text-[#D39A9F]">/</span>
                                <span className="text-[#8D6E63]">
                                    {step === 1 ? 'IDENTIFICATION' : step === 2 ? 'BUSINESS PROFILE' : step === 3 ? 'CREDENTIALS' : 'ASSETS & SETTLEMENT'}
                                </span>
                             </p>
                        </div>
                        <Link to="/seller/login" className="text-[10px] font-black text-[#8D6E63] uppercase tracking-widest hover:text-[#3E2723] transition-colors border-b-2 border-[#8D6E63]/20 pb-1">Already registered?</Link>
                    </div>

                    <form onSubmit={step === 4 ? handleSubmit : handleNext} className="space-y-8">
                        {step === 1 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                                <div className="space-y-2">
                                    <label className={labelClasses}>Full Name <span className="text-red-500">*</span></label>
                                    <div className="relative group">
                                        <input required name="fullName" value={formData.fullName} onChange={handleChange} className={inputClasses} placeholder="Ex: Rajesh Kumar" />
                                        <User className={iconClasses} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className={labelClasses}>Mobile Number <span className="text-red-500">*</span></label>
                                    <div className="relative group">
                                        <input required name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className={inputClasses} placeholder="9876543210" />
                                        <Phone className={iconClasses} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className={labelClasses}>Email Address <span className="text-red-500">*</span></label>
                                    <div className="relative group">
                                        <input required type="email" name="email" value={formData.email} onChange={handleChange} className={inputClasses} placeholder="rajesh@example.com" />
                                        <Mail className={iconClasses} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className={labelClasses}>Password <span className="text-red-500">*</span></label>
                                    <div className="relative group">
                                        <input required type="password" name="password" value={formData.password} onChange={handleChange} className={inputClasses} placeholder="••••••••" />
                                        <Lock className={iconClasses} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                                <div className="space-y-2">
                                    <label className={labelClasses}>Shop Name <span className="text-red-500">*</span></label>
                                    <div className="relative group">
                                        <input required name="shopName" value={formData.shopName} onChange={handleChange} className={inputClasses} placeholder="Ex: Royal Gold & Diamonds" />
                                        <Store className={iconClasses} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className={labelClasses}>Shop Address <span className="text-red-500">*</span></label>
                                    <div className="relative group">
                                        <input required name="shopAddress" value={formData.shopAddress} onChange={handleChange} className={inputClasses} placeholder="123, Marketplace Street" />
                                        <MapPin className={iconClasses} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div className="space-y-2">
                                        <label className={labelClasses}>City <span className="text-red-500">*</span></label>
                                        <div className="relative group">
                                            <input required name="city" value={formData.city} onChange={handleChange} className={inputClasses} placeholder="Mumbai" />
                                            <Building className={iconClasses} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className={labelClasses}>State <span className="text-red-500">*</span></label>
                                        <div className="relative group">
                                            <input required name="state" value={formData.state} onChange={handleChange} className={inputClasses} placeholder="Maharashtra" />
                                            <MapPin className={iconClasses} />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className={labelClasses}>Pincode <span className="text-red-500">*</span></label>
                                    <div className="relative group">
                                        <input required name="pincode" value={formData.pincode} onChange={handleChange} className={inputClasses} placeholder="400001" />
                                        <Hash className={iconClasses} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                                <div className="space-y-2">
                                    <label className={labelClasses}>GST Number <span className="text-red-500">*</span></label>
                                    <div className="relative group">
                                        <input required name="gstNumber" value={formData.gstNumber} onChange={handleChange} className={inputClasses} placeholder="22AAAAA0000A1Z5" />
                                        <ShieldCheck className={iconClasses} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className={labelClasses}>PAN Number <span className="text-red-500">*</span></label>
                                    <div className="relative group">
                                        <input required name="panNumber" value={formData.panNumber} onChange={handleChange} className={inputClasses} placeholder="ABCDE1234F" />
                                        <ShieldCheck className={iconClasses} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className={labelClasses}>BIS Hallmark License Number <span className="text-red-500">*</span></label>
                                    <div className="relative group">
                                        <input required name="bisNumber" value={formData.bisNumber} onChange={handleChange} className={inputClasses} placeholder="HM/C-1234567890" />
                                        <CheckCircle2 className={iconClasses} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                                <div className="space-y-6">
                                     <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Settlement Account</h3>
                                     <div className="space-y-2">
                                        <label className={labelClasses}>Account Number <span className="text-red-500">*</span></label>
                                        <div className="relative group">
                                            <input required name="accountNumber" value={formData.accountNumber} onChange={handleChange} className={inputClasses} placeholder="000000000000" />
                                            <CreditCard className={iconClasses} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className={labelClasses}>IFSC Code <span className="text-red-500">*</span></label>
                                        <div className="relative group">
                                            <input required name="ifscCode" value={formData.ifscCode} onChange={handleChange} className={inputClasses} placeholder="SBIN0000001" />
                                            <Landmark className={iconClasses} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Document Verification</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className={labelClasses}>Aadhar Upload <span className="text-red-500">*</span></label>
                                            <label className="flex flex-col items-center justify-center w-full h-32 bg-[#FDFBF7] border-2 border-dashed border-[#EFEBE9] rounded-xl cursor-pointer hover:border-[#8D6E63] transition-all group">
                                                <FileUp className="w-6 h-6 text-gray-400 group-hover:text-[#8D6E63] mb-2" />
                                                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{formData.aadhar ? 'File Selected' : 'Choose File'}</span>
                                                <input required type="file" name="aadhar" onChange={handleChange} className="hidden" />
                                            </label>
                                        </div>
                                        <div className="space-y-2">
                                            <label className={labelClasses}>Shop License <span className="text-red-500">*</span></label>
                                            <label className="flex flex-col items-center justify-center w-full h-32 bg-[#FDFBF7] border-2 border-dashed border-[#EFEBE9] rounded-xl cursor-pointer hover:border-[#8D6E63] transition-all group">
                                                <FileUp className="w-6 h-6 text-gray-400 group-hover:text-[#8D6E63] mb-2" />
                                                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{formData.shopLicense ? 'File Selected' : 'Choose File'}</span>
                                                <input required type="file" name="shopLicense" onChange={handleChange} className="hidden" />
                                            </label>
                                        </div>
                                        <div className="space-y-2">
                                            <label className={labelClasses}>Certificate Upload <span className="text-red-500">*</span></label>
                                            <label className="flex flex-col items-center justify-center w-full h-32 bg-[#FDFBF7] border-2 border-dashed border-[#EFEBE9] rounded-xl cursor-pointer hover:border-[#8D6E63] transition-all group">
                                                <FileUp className="w-6 h-6 text-gray-400 group-hover:text-[#8D6E63] mb-2" />
                                                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{formData.certificate ? 'File Selected' : 'Choose File'}</span>
                                                <input required type="file" name="certificate" onChange={handleChange} className="hidden" />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 pt-10 border-t border-gray-100">
                            {step > 1 && (
                                <button type="button" onClick={() => setStep(step - 1)} className="flex-1 px-8 py-5 rounded-2xl text-[10px] font-black text-white bg-[#D39A9F] uppercase tracking-[0.3em] hover:bg-[#C88B90] transition-all">Back</button>
                            )}
                            <button type="submit" disabled={loading} className="flex-[2] bg-[#3E2723] text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-[#3E2723]/20 hover:bg-[#2D1B18] transition-all active:scale-95 flex items-center justify-center gap-3">
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        {step === 4 ? 'Submit Application' : 'Continue'}
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SellerRegister;
