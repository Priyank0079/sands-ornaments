import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    User, Phone, Mail, Lock, Store, MapPin, Building, Hash, 
    CreditCard, Landmark, FileUp, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import loginBg from '../assets/admin-login-bg.png';

const SellerRegister = () => {
    const navigate = useNavigate();
    const { sellerRegister } = useAuth();
    const [step, setStep] = useState(() => {
        if (typeof window === 'undefined') return 1;
        const saved = window.sessionStorage.getItem('sellerRegisterStep');
        const parsed = saved ? Number(saved) : 1;
        return Number.isFinite(parsed) && parsed >= 1 && parsed <= 4 ? parsed : 1;
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [termsContent, setTermsContent] = useState('');
    const [termsLoading, setTermsLoading] = useState(true);
    const [termsError, setTermsError] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.sessionStorage.getItem('sellerRegisterAcceptTerms') === 'true';
    });

    const [formData, setFormData] = useState(() => {
        if (typeof window === 'undefined') {
            return {
                fullName: '',
                mobileNumber: '',
                email: '',
                password: '',
                shopName: '',
                shopAddress: '',
                city: '',
                state: '',
                pincode: '',
                gstNumber: '',
                panNumber: '',
                bisNumber: '',
                aadhar: null,
                shopLicense: null,
                certificate: null,
                accountNumber: '',
                ifscCode: ''
            };
        }

        const stored = window.sessionStorage.getItem('sellerRegisterFormData');
        const parsed = stored ? JSON.parse(stored) : null;
        return {
            // Personal
            fullName: parsed?.fullName || '',
            mobileNumber: parsed?.mobileNumber || '',
            email: parsed?.email || '',
            password: parsed?.password || '',
            // Business
            shopName: parsed?.shopName || '',
            shopAddress: parsed?.shopAddress || '',
            city: parsed?.city || '',
            state: parsed?.state || '',
            pincode: parsed?.pincode || '',
            // Verification
            gstNumber: parsed?.gstNumber || '',
            panNumber: parsed?.panNumber || '',
            bisNumber: parsed?.bisNumber || '',
            // Documents (cannot restore file inputs)
            aadhar: null,
            shopLicense: null,
            certificate: null,
            // Bank
            accountNumber: parsed?.accountNumber || '',
            ifscCode: parsed?.ifscCode || ''
        };
    });

    useEffect(() => {
        const fetchSellerTerms = async () => {
            setTermsLoading(true);
            setTermsError('');
            try {
                const res = await api.get('public/pages/seller-terms');
                const page = res.data?.data?.page || res.data?.page || null;
                if (page?.content) {
                    setTermsContent(page.content);
                } else {
                    setTermsContent('');
                    setTermsError('Seller terms are not configured yet.');
                }
            } catch (err) {
                setTermsContent('');
                setTermsError('Unable to load seller terms right now.');
            } finally {
                setTermsLoading(false);
            }
        };

        fetchSellerTerms();
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (submitted) {
            window.sessionStorage.removeItem('sellerRegisterStep');
            window.sessionStorage.removeItem('sellerRegisterFormData');
            window.sessionStorage.removeItem('sellerRegisterAcceptTerms');
            return;
        }
        window.sessionStorage.setItem('sellerRegisterStep', String(step));
    }, [step, submitted]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const { aadhar, shopLicense, certificate, ...persistable } = formData;
        window.sessionStorage.setItem('sellerRegisterFormData', JSON.stringify(persistable));
    }, [formData]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        window.sessionStorage.setItem('sellerRegisterAcceptTerms', String(acceptTerms));
    }, [acceptTerms]);

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

        if (!termsContent) {
            alert(termsError || "Seller terms are not available. Please try again later.");
            return;
        }
        if (!acceptTerms) {
            alert("Please accept the seller terms & conditions to continue.");
            return;
        }

        setLoading(true);
        
        try {
            const payload = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== undefined && value !== '') {
                    payload.append(key, value);
                }
            });
            payload.append('bankAccount', JSON.stringify({
                accountNumber: formData.accountNumber,
                ifscCode: formData.ifscCode
            }));
            payload.append('acceptTerms', String(acceptTerms));

            const res = await sellerRegister(payload);
            if (res.success) {
                setSubmitted(true);
            } else {
                alert(res.message || "Registration failed. Please check your details.");
            }
        } catch (err) {
            alert("Connection error. Please try again.");
        } finally {
            setLoading(false);
        }
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
                                        <input required type="password" name="password" value={formData.password} onChange={handleChange} className={inputClasses} placeholder="********" />
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

                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Seller Terms & Conditions</h3>
                                    {termsLoading ? (
                                        <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Loading terms...</div>
                                    ) : termsContent ? (
                                        <div className="text-xs text-gray-500 font-semibold">
                                            Please review our{' '}
                                            <Link
                                                to="/page/seller-terms"
                                                className="text-[#3E2723] font-black underline underline-offset-4 hover:text-[#2D1B18] transition-colors"
                                            >
                                                Seller Terms & Conditions
                                            </Link>
                                            .
                                        </div>
                                    ) : (
                                        <div className="text-xs font-bold text-red-500">{termsError || 'Seller terms are unavailable.'}</div>
                                    )}
                                    <label className="flex items-start gap-3 text-xs font-semibold text-gray-700">
                                        <input
                                            type="checkbox"
                                            className="mt-1 h-4 w-4 rounded border-gray-300 text-[#3E2723] focus:ring-[#3E2723]"
                                            checked={acceptTerms}
                                            onChange={(e) => setAcceptTerms(e.target.checked)}
                                            disabled={!termsContent}
                                            required
                                        />
                                        <span>I agree to the seller terms & conditions.</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 pt-10 border-t border-gray-100">
                            {step > 1 && (
                                <button type="button" onClick={() => setStep(step - 1)} className="flex-1 px-8 py-5 rounded-2xl text-[10px] font-black text-white bg-[#D39A9F] uppercase tracking-[0.3em] hover:bg-[#C88B90] transition-all">Back</button>
                            )}
                            <button type="submit" disabled={loading || (step === 4 && (!termsContent || !acceptTerms))} className="flex-[2] bg-[#3E2723] text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-[#3E2723]/20 hover:bg-[#2D1B18] transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed">
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
