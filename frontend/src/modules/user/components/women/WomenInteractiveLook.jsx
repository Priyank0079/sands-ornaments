import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, Sparkles, ArrowRight } from 'lucide-react';
import { useShop } from '../../../../context/ShopContext';
import toast from 'react-hot-toast';

const hotspots = [
    {
        id: 'ear',
        name: "Rose Glow Drop Earrings",
        price: "1,899",
        top: '32%',
        left: '42%',
        labelX: '150',
        labelY: '30',
        linePath: "M 0 0 L 120 -80",
        purity: "925 Silver"
    },
    {
        id: 'neck',
        name: "Eternal Blossom Pendant",
        price: "2,499",
        top: '55%',
        left: '52%',
        labelX: '200',
        labelY: '0',
        linePath: "M 0 0 L 180 0",
        purity: "Rose Gold Plated"
    },
    {
        id: 'hand_ring',
        name: "Infinite Love Stack Ring",
        price: "1,299",
        top: '82%',
        left: '38%',
        labelX: '-180',
        labelY: '40',
        linePath: "M 0 0 L -150 20",
        purity: "Pure 925"
    },
    {
        id: 'wrist',
        name: "Shimmering Link Bracelet",
        price: "3,199",
        top: '78%',
        left: '65%',
        labelX: '150',
        labelY: '60',
        linePath: "M 0 0 L 130 40",
        purity: "Handcrafted"
    }
];

const WomenInteractiveLook = () => {
    const [activeId, setActiveId] = useState(hotspots[0].id);
    const { addToCart } = useShop();

    const handleQuickAdd = (item) => {
        const product = {
            id: `w-${item.id}`,
            name: item.name,
            price: parseInt(item.price.replace(',', '')),
            image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=90&w=1600&auto=format&fit=crop",
            category: "Women's Collection",
            variants: [{ id: `w-${item.id}-v1`, price: parseInt(item.price.replace(',', '')) }]
        };
        addToCart(product);
        toast.success(`${item.name} added to bag!`, {
            style: { background: '#4A1015', color: '#fff', fontSize: '12px', fontWeight: 'bold' },
            icon: '💖'
        });
    };

    return (
        <section className="py-24 px-6 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    
                    {/* Left Side: Text Content */}
                    <div className="lg:w-1/3 order-2 lg:order-1">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-2 text-[#D39A9F]">
                                <Sparkles className="w-5 h-5" />
                                <span className="text-xs font-bold uppercase tracking-[0.3em]">Pure 925 Inspiration</span>
                            </div>
                            <h2 className="text-5xl md:text-6xl font-serif text-black leading-tight">
                                Shop the <span className="italic text-[#D39A9F]">Look</span>
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed font-sans">
                                Complete your aura with our signature women's collection. Each piece is designed to shimmer against your skin, catching every light.
                            </p>
                            
                            {/* Interactive Selected Product Card */}
                            <AnimatePresence mode="wait">
                                {hotspots.filter(h => h.id === activeId).map(h => (
                                    <motion.div
                                        key={h.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-[#FDF5F6] border border-[#EBCDD0]/50 p-8 rounded-[2rem] shadow-xl relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D39A9F]/5 blur-3xl" />
                                        <div className="text-[10px] font-bold text-[#D39A9F] uppercase tracking-[0.2em] mb-2">{h.purity}</div>
                                        <h3 className="text-2xl font-serif text-black mb-1">{h.name}</h3>
                                        <div className="text-3xl font-bold text-[#4A1015] mb-6">₹{h.price}</div>
                                        
                                        <button 
                                            onClick={() => handleQuickAdd(h)}
                                            className="w-full bg-[#4A1015] text-white py-4 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg shadow-[#4A1015]/20"
                                        >
                                            <ShoppingBag className="w-4 h-4" /> Add to Bag
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Right Side: Interactive Image */}
                    <div className="lg:w-2/3 order-1 lg:order-2 relative aspect-[4/5] md:aspect-[16/11] w-full rounded-[3rem] overflow-hidden shadow-2xl group border border-slate-100 bg-[#f8f8f8]">
                        <img
                            src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=90&w=2600&auto=format&fit=crop"
                            alt="Interactive Lookbook"
                            className="w-full h-full object-cover transition-transform duration-[3s] ease-out"
                        />
                        <div className="absolute inset-0 bg-black/5" />

                        {/* Interactive Dots & SVG Arrows */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-2xl z-10" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                            {hotspots.map(h => (
                                <motion.g
                                    key={h.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: activeId === h.id ? 1 : 0.4 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <path
                                        d={h.linePath}
                                        fill="none"
                                        stroke="#EBCDD0"
                                        strokeWidth="0.3"
                                        strokeDasharray="1 1"
                                        transform={`translate(${parseFloat(h.left)} ${parseFloat(h.top)})`}
                                        className="opacity-60"
                                    />
                                    <text
                                        x={h.labelX / 10} // Scaling down to viewBox 100
                                        y={h.labelY / 10}
                                        fill="#fff"
                                        className="text-[1.5px] font-bold uppercase tracking-widest"
                                        style={{ fontSize: '1.5px' }}
                                        transform={`translate(${parseFloat(h.left)} ${parseFloat(h.top)})`}
                                    >
                                        • {h.name.split(' ')[0]}
                                    </text>
                                </motion.g>
                            ))}
                        </svg>

                        {/* Pulsing Dots */}
                        {hotspots.map(h => (
                            <button
                                key={h.id}
                                onClick={() => setActiveId(h.id)}
                                className="absolute z-20 group/dot"
                                style={{ top: h.top, left: h.left }}
                            >
                                <span className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                                    activeId === h.id ? 'bg-[#D39A9F] border-white scale-125' : 'bg-white/80 border-[#D39A9F] scale-90'
                                }`}>
                                    <div className={`h-2 w-2 rounded-full ${activeId === h.id ? 'bg-white' : 'bg-[#D39A9F]'}`} />
                                </span>
                                <span className={`absolute inset-0 rounded-full bg-[#D39A9F]/40 animate-ping pointer-events-none ${activeId === h.id ? 'opacity-100' : 'opacity-0'}`} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WomenInteractiveLook;
