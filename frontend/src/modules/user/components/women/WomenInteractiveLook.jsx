import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Sparkles, ChevronRight } from 'lucide-react';
import { useShop } from '../../../../context/ShopContext';
import { useAuth } from '../../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getWomenLoginRedirect, storeWomenPendingCartItem } from '../../utils/womenNavigation';
import toast from 'react-hot-toast';

// Import local image
import InteractiveLookImg from '../../../../assets/InteractiveLook.png';

const hotspots = [
    {
        id: 'ear',
        name: "Earrings",
        productName: "Rose Glow Drop Earrings",
        price: "1,899",
        top: '25%',
        left: '42%',
        labelX: -180,
        labelY: 0,
        purity: "925 Silver"
    },
    {
        id: 'chains',
        name: "Chains",
        productName: "Triple Layer Gold Chain",
        price: "4,499",
        top: '48%',
        left: '45%',
        labelX: -220,
        labelY: 0,
        purity: "18K Gold Plated"
    },
    {
        id: 'pendants',
        name: "Pendants",
        productName: "Eternal Blossom Pendant",
        price: "2,499",
        top: '62%',
        left: '50%',
        labelX: -220,
        labelY: 0,
        purity: "Rose Gold Plated"
    },
    {
        id: 'rings',
        name: "Rings",
        productName: "Infinite Love Stack Ring",
        price: "1,299",
        top: '38%',
        left: '52%',
        labelX: 150,
        labelY: 0,
        purity: "Pure 925"
    },
    {
        id: 'bracelets',
        name: "Bracelets",
        productName: "Shimmering Link Bracelet",
        price: "3,199",
        top: '68%',
        left: '55%',
        labelX: 150,
        labelY: 0,
        purity: "Handcrafted"
    }
];

const WomenInteractiveLook = () => {
    const [activeId, setActiveId] = useState(hotspots[0].id);
    const { addToCart } = useShop();
    const { user } = useAuth();
    const navigate = useNavigate();

    const redirectToLogin = () => {
        toast.error('Please login to continue');
        navigate(getWomenLoginRedirect());
    };

    const handleQuickAdd = (item) => {
        const product = {
            id: `w-${item.id}`,
            name: item.productName,
            price: parseInt(item.price.replace(',', '')),
            image: InteractiveLookImg,
            category: "Women's Collection",
            variants: [{ id: `w-${item.id}-v1`, price: parseInt(item.price.replace(',', '')) }]
        };
        if (!user) {
            storeWomenPendingCartItem(product);
            redirectToLogin();
            return;
        }
        addToCart(product);
        toast.success(`${item.productName} added to bag!`, {
            style: { background: '#4A1015', color: '#fff', fontSize: '12px', fontWeight: 'bold' },
            icon: '💖'
        });
        setTimeout(() => navigate('/cart'), 800);
    };

    return (
        <section className="py-24 px-6 md:px-12 bg-[#F6F3F4] overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <motion.h2 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-6xl font-bold text-black uppercase tracking-tight"
                    >
                        Shop The Look
                    </motion.h2>
                    <p className="text-[#333] text-lg md:text-xl font-light italic">Elevate your style game</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-16 items-start">
                    
                    {/* Left Side: Product Card (Dynamic) */}
                    <div className="lg:w-1/4 w-full order-2 lg:order-1 sticky top-24">
                        <AnimatePresence mode="wait">
                            {hotspots.filter(h => h.id === activeId).map(h => (
                                <motion.div
                                    key={h.id}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30 }}
                                    className="bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100"
                                >
                                    <div className="text-[10px] font-bold text-[#D39A9F] uppercase tracking-[0.2em] mb-2">{h.purity}</div>
                                    <h3 className="text-2xl font-serif text-black mb-1">{h.productName}</h3>
                                    <div className="text-3xl font-bold text-[#4A1015] mb-6">₹{h.price}</div>
                                    
                                    <button 
                                        onClick={() => handleQuickAdd(h)}
                                        className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-lg"
                                    >
                                        <ShoppingBag className="w-4 h-4" /> Add to Bag
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Right Side: Interactive Image with Labels */}
                    <div className="lg:w-3/4 w-full order-1 lg:order-2 relative aspect-[16/9] rounded-[3rem] overflow-hidden shadow-2xl bg-white group">
                        {/* High-End Model Image */}
                        <img
                            src={InteractiveLookImg}
                            alt="Shop the Look"
                            className="w-full h-full object-cover brightness-[0.95]"
                        />
                        
                        {/* Interactive Overlay Layer */}
                        <div className="absolute inset-0">
                            {hotspots.map((h, i) => (
                                <div 
                                    key={h.id} 
                                    className="absolute" 
                                    style={{ top: h.top, left: h.left }}
                                >
                                    {/* Hotspot Pulse */}
                                    <motion.div
                                        animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0.4, 0.8] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="h-4 w-4 rounded-full bg-white/60 blur-[2px]"
                                    />
                                    
                                    {/* Connector Line (Animated Path) */}
                                    <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none overflow-visible" width="300" height="100">
                                        <motion.path
                                            d={`M 0 0 L ${h.labelX} ${h.labelY}`}
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="1.5"
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            whileInView={{ pathLength: 1, opacity: 0.6 }}
                                            transition={{ duration: 1, delay: i * 0.2 }}
                                        />
                                    </svg>

                                    {/* Label Box (Floating) */}
                                    <motion.button
                                        onClick={() => setActiveId(h.id)}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ delay: 0.5 + i * 0.1 }}
                                        className={`absolute z-30 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl transition-all duration-300 whitespace-nowrap bg-white hover:bg-zinc-900 group/label`}
                                        style={{ 
                                            transform: `translate(${h.labelX}px, ${h.labelY}px)`,
                                            left: h.labelX < 0 ? 'auto' : '100%',
                                            right: h.labelX < 0 ? '100%' : 'auto',
                                            marginLeft: h.labelX < 0 ? -20 : 20,
                                            marginRight: h.labelX < 0 ? 20 : -20
                                        }}
                                    >
                                        <span className={`font-bold text-sm md:text-base tracking-wide transition-colors duration-300 ${activeId === h.id ? 'text-[#D39A9F]' : 'text-zinc-800'} group-hover/label:text-white`}>
                                            {h.name}
                                        </span>
                                        <ChevronRight className={`w-4 h-4 transition-all duration-300 ${activeId === h.id ? 'text-[#D39A9F]' : 'text-zinc-400'} group-hover/label:translate-x-1 group-hover/label:text-[#D39A9F]`} />
                                        
                                        {/* Active Indicator Underline */}
                                        {activeId === h.id && (
                                            <motion.div 
                                                layoutId="activeIndicator"
                                                className="absolute bottom-0 left-0 right-0 h-1 bg-[#D39A9F] rounded-full"
                                            />
                                        )}
                                    </motion.button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WomenInteractiveLook;
