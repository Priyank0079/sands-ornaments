import React, { useEffect } from 'react';
import { Shield, Eye, Lock, RefreshCw, UserCheck, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const policies = [
        {
            title: "Data We Collect",
            icon: <Eye className="w-6 h-6" />,
            content: "We collect personal information such as name, email, phone number, and shipping address to process your orders and provide a personalized luxury experience."
        },
        {
            title: "Secure Payments",
            icon: <Lock className="w-6 h-6" />,
            content: "Your payment details are encrypted and processed by Razorpay. Sands Ornaments does not store your credit card or bank credentials on our servers."
        },
        {
            title: "Cookies & Tracking",
            icon: <RefreshCw className="w-6 h-6" />,
            content: "We use essential cookies to maintain your shopping bag and analytics cookies to understand how you interact with our collection, helping us improve our service."
        },
        {
            title: "Your Rights",
            icon: <UserCheck className="w-6 h-6" />,
            content: "You have the right to access, update, or delete your personal data at any time through your account dashboard or by contacting our data protection officer."
        }
    ];

    return (
        <div className="bg-white min-h-screen py-8 md:py-20 selection:bg-[#D39A9F] selection:text-white">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-black hover:text-[#D39A9F] transition-all group font-bold uppercase tracking-widest text-[10px] mb-8"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                <div className="text-center mb-12 md:mb-20">
                    <span className="text-[#D39A9F] text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-3 block">Your Privacy Matters</span>
                    <h1 className="text-4xl md:text-6xl font-display text-black mb-6">Privacy Policy</h1>
                    <div className="w-16 md:w-24 h-0.5 bg-[#EBCDD0] mx-auto mb-6"></div>
                    <p className="text-gray-400 text-xs md:text-sm font-serif italic">Your trust is our most valuable asset.</p>
                </div>

                <div className="bg-white rounded-[2rem] p-6 md:p-12 shadow-sm border border-[#F3F4F6]">
                    <div className="flex items-center gap-4 mb-10 md:mb-16 p-6 bg-gray-50 rounded-2xl border border-[#F3F4F6]">
                        <Shield className="w-8 h-8 md:w-10 md:h-10 text-[#D39A9F] flex-shrink-0" />
                        <p className="text-sm md:text-base font-serif text-gray-600 italic">"Sands Ornaments is committed to ensuring that your privacy is protected and your data is used only to enhance your shopping experience."</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {policies.map((policy, idx) => (
                            <div key={idx} className="p-6 md:p-8 rounded-2xl border border-[#F3F4F6] hover:shadow-md transition-all hover:border-[#EBCDD0] group bg-white">
                                <div className="text-black mb-4 bg-gray-50 w-fit p-3 rounded-xl group-hover:bg-[#EBCDD0] transition-colors">
                                    {policy.icon}
                                </div>
                                <h3 className="text-lg md:text-xl font-display text-black mb-3">{policy.title}</h3>
                                <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-serif">{policy.content}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 md:mt-20 border-t border-[#F3F4F6] pt-10 md:pt-16">
                        <h4 className="font-display text-black mb-4 md:mb-6 text-lg md:text-xl">Third Party Disclosure</h4>
                        <p className="text-gray-500 leading-relaxed mb-8 md:mb-10 text-sm md:text-base font-serif">
                            We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website (like shipping partners), so long as those parties agree to keep this information confidential.
                        </p>
                        <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border-l-4 border-[#D39A9F]">
                            <p className="text-sm md:text-base text-gray-600 font-serif italic">
                                "We treat your data with the same care and precision we apply to our handcrafted jewelry."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
