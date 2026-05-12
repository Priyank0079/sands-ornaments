import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, ArrowRight, Gift, ShoppingBag } from 'lucide-react';
import { useAnalytics } from '../../../hooks/useAnalytics';
import { useShop } from '../../../context/ShopContext';

const LeadCapturePopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1); // 1: Invite, 2: Form, 3: Success
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const { cart } = useShop();
    const { captureLead, track } = useAnalytics();

    useEffect(() => {
        // Only show for guests with items in cart
        const isGuest = !localStorage.getItem('user');
        const hasItems = cart.length > 0;
        const hasShown = sessionStorage.getItem('lead_capture_shown');

        if (isGuest && hasItems && !hasShown) {
            const timer = setTimeout(() => {
                setIsOpen(true);
                sessionStorage.setItem('lead_capture_shown', 'true');
                track('lead_prompt_show', { cartCount: cart.length });
            }, 30000); // Show after 30 seconds

            // Also show on exit intent
            const handleMouseOut = (e) => {
                if (e.clientY < 0) {
                    setIsOpen(true);
                    sessionStorage.setItem('lead_capture_shown', 'true');
                }
            };
            document.addEventListener('mouseleave', handleMouseOut);

            return () => {
                clearTimeout(timer);
                document.removeEventListener('mouseleave', handleMouseOut);
            };
        }
    }, [cart, track]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await captureLead({
            email,
            phone,
            source: 'abandoned_cart',
            cartItems: cart.map(item => ({
                productId: item.id || item._id,
                variantId: item.variantId,
                quantity: item.quantity
            }))
        });
        track('lead_capture_success', { email, phone });
        setStep(3);
        setTimeout(() => setIsOpen(false), 3000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] overflow-hidden max-w-lg w-full shadow-2xl relative">
                <button 
                    onClick={() => setIsOpen(false)}
                    className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                    <X size={20} className="text-gray-400" />
                </button>

                <div className="flex flex-col md:flex-row">
                    <div className="w-full p-10">
                        {step === 1 && (
                            <div className="space-y-6 text-center md:text-left">
                                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                                    <ShoppingBag size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Save Your Cart?</h2>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Don't lose your favorite pieces. Leave your details and we'll save your selection for you.</p>
                                </div>
                                <button 
                                    onClick={() => setStep(2)}
                                    className="w-full py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#3E2723] transition-all flex items-center justify-center gap-2"
                                >
                                    Yes, Save My Cart <ArrowRight size={14} />
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Almost There</h2>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">We'll email you a copy of your current cart.</p>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input 
                                            type="email" 
                                            placeholder="EMAIL ADDRESS"
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-[10px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-black/5"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input 
                                            type="tel" 
                                            placeholder="MOBILE NUMBER (OPTIONAL)"
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-[10px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-black/5"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#3E2723] transition-all"
                                >
                                    Secure My Cart
                                </button>
                                <p className="text-[8px] font-bold text-gray-400 text-center uppercase tracking-widest">By clicking, you agree to our privacy policy & consent to receive updates.</p>
                            </form>
                        )}

                        {step === 3 && (
                            <div className="py-10 text-center space-y-6 animate-in zoom-in duration-500">
                                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
                                    <Gift size={40} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Cart Secured!</h2>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Check your email for your personalized selection.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadCapturePopup;
