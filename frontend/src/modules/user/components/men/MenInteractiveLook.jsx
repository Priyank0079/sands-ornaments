import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ShoppingCart } from 'lucide-react';
import { ShopContext } from '../../../../context/ShopContext';
import toast from 'react-hot-toast';

const hotspots = [
    {
        id: 'earrings',
        label: 'EARRINGS',
        desc: "925 Sterling Silver Studs",
        price: "1,299",
        x1: 63, y1: 31, // Man's left ear
        x2: 83, y2: 35, // Label position
        category: 'earrings',
        direction: 'right'
    },
    {
        id: 'chains',
        label: 'CHAINS',
        desc: "Classic Silver Link Chain",
        price: "3,499",
        x1: 42, y1: 57, // Top chain area
        x2: 17, y2: 45, // Label
        category: 'chains',
        direction: 'left'
    },
    {
        id: 'pendants',
        label: 'PENDANTS',
        desc: "Silver Minimalist Pendant",
        price: "1,799",
        x1: 52, y1: 63, // Bottom pendant
        x2: 17, y2: 62, // Label (Left side)
        category: 'pendants',
        direction: 'left'
    },
    {
        id: 'bracelets',
        label: 'BRACELETS',
        desc: "Silver Solid Kada",
        price: "2,199",
        x1: 30, y1: 82, // Wrist area (bracelet visible)
        x2: 17, y2: 78, // Label
        category: 'bracelets',
        direction: 'left'
    },
    {
        id: 'rings',
        label: 'RINGS',
        desc: "Oxidized Statement Ring",
        price: "1,499",
        x1: 49, y1: 72, // Main ring on finger
        x2: 83, y2: 85, // Label
        category: 'rings',
        direction: 'right'
    }
];

const MenInteractiveLook = () => {
    const navigate = useNavigate();
    const [hoveredNode, setHoveredNode] = useState(null);
    const { addToCart, products } = useContext(ShopContext);

    const handleQuickAdd = (spot) => {
        // Try to find matching real product
        const realProduct = products.find(p => p.name.toLowerCase().includes(spot.desc.toLowerCase()));

        if (realProduct) {
            addToCart(realProduct);
            toast.success(`${spot.label} added to cart!`);
        } else {
            // Mock data for immediate feedback
            const mockProduct = {
                id: spot.id + '-mock',
                _id: spot.id + '-mock',
                name: spot.desc,
                price: parseFloat(spot.price.replace(',', '')),
                image: '/men-interactive.png',
                variants: [{ id: spot.id + '-v1', price: parseFloat(spot.price.replace(',', '')) }]
            };
            addToCart(mockProduct);
            toast.success(`${spot.label} added to cart!`);
        }
    };

    return (
        <section className="py-10 md:py-14 bg-[#FCFBF8]">
            <div className="container mx-auto px-4 md:px-8">

                {/* Compact Header Section */}
                <div className="text-center mb-6 md:mb-10">
                    <h2 className="text-2xl md:text-3xl font-black text-[#111] uppercase tracking-wide mb-1">
                        Shop The Look
                    </h2>
                    <div className="w-12 h-1 bg-[#3B82F6] mx-auto rounded-full mb-3"></div>
                    <p className="text-gray-500 text-[10px] md:text-xs tracking-[0.2em] uppercase opacity-80">
                        Complete Your Signature Style
                    </p>
                </div>

                {/* Ultra-Compact Sharp Square Interactive Container */}
                <div className="max-w-[750px] mx-auto relative shadow-2xl overflow-hidden bg-[#0A0B0D] h-[400px] md:h-[750px]">

                    {/* Model Image */}
                    <img
                        src="/men-interactive.png"
                        alt="Men Jewelry Model"
                        className="absolute inset-0 w-full h-full object-cover object-center brightness-90 contrast-110"
                    />
                    {/* Dark Portrait Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />

                    {/* SVG Connector Lines & Arrows */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                        <defs>
                            <marker
                                id="arrowhead-blue"
                                markerWidth="3"
                                markerHeight="3"
                                refX="3"
                                refY="1.5"
                                orient="auto"
                            >
                                <path d="M0,0 L3,1.5 L0,3 Z" fill="#3B82F6" />
                            </marker>
                            <marker
                                id="arrowhead-white"
                                markerWidth="2.5"
                                markerHeight="2.5"
                                refX="2.5"
                                refY="1.25"
                                orient="auto"
                            >
                                <path d="M0,0 L2.5,1.25 L0,2.5 Z" fill="rgba(255,255,255,0.4)" />
                            </marker>
                        </defs>
                        {hotspots.map(spot => {
                            const isHovered = hoveredNode === spot.id;
                            const strokeColor = isHovered ? "#3B82F6" : "rgba(255,255,255,0.6)";
                            const sw = isHovered ? "0.3" : "0.2";
                            const markerId = isHovered ? "url(#arrowhead-blue)" : "url(#arrowhead-white)";

                            return (
                                <g key={`group-${spot.id}`}>
                                    <motion.path
                                        d={`M ${spot.x1} ${spot.y1} L ${spot.x2} ${spot.y1} L ${spot.x2} ${spot.y2}`}
                                        fill="none"
                                        stroke={strokeColor}
                                        strokeWidth={sw}
                                        markerEnd={markerId}
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{
                                            pathLength: 1,
                                            opacity: 1,
                                            strokeDasharray: isHovered ? "none" : "1,1",
                                            strokeDashoffset: isHovered ? 0 : [0, -5]
                                        }}
                                        transition={{
                                            opacity: { duration: 0.5 },
                                            pathLength: { duration: 1.5, ease: "easeInOut" },
                                            strokeDashoffset: { duration: 15, repeat: Infinity, ease: "linear" }
                                        }}
                                    />
                                    <circle
                                        cx={spot.x2} cy={spot.y1} r="0.4"
                                        fill={strokeColor}
                                        className="transition-colors duration-300"
                                    />
                                </g>
                            );
                        })}
                    </svg>

                    {/* Hotspots & Labels */}
                    {hotspots.map(spot => (
                        <div key={spot.id}>
                            <div
                                className="absolute"
                                style={{ top: `${spot.y1}%`, left: `${spot.x1}%`, transform: 'translate(-50%, -50%)' }}
                                onMouseEnter={() => setHoveredNode(spot.id)}
                                onMouseLeave={() => setHoveredNode(null)}
                            >
                                <div className="relative flex items-center justify-center w-12 h-12 cursor-pointer group z-20">
                                    <motion.div
                                        className="absolute w-full h-full rounded-full border border-white/20"
                                        animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                    <div className={`w-3 h-3 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.5)] ${hoveredNode === spot.id ? 'bg-[#3B82F6] scale-150 shadow-blue-500/50' : 'bg-white/40 group-hover:bg-white/80'}`} />
                                </div>
                            </div>

                            <div
                                className="absolute z-30"
                                style={{ top: `${spot.y2}%`, left: `${spot.x2}%`, transform: 'translate(-50%, -50%)' }}
                                onMouseEnter={() => setHoveredNode(spot.id)}
                                onMouseLeave={() => setHoveredNode(null)}
                            >
                                <motion.div
                                    className="relative flex items-center cursor-pointer"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    <div className={`px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl transition-all duration-300 border border-transparent ${hoveredNode === spot.id ? 'scale-110 shadow-blue-500/20 border-blue-400 z-50' : 'hover:-translate-y-1'}`}>
                                        <span className="text-[#111] font-bold text-[10px] md:text-sm uppercase tracking-wide">
                                            {spot.label}
                                        </span>
                                        <ChevronRight className={`w-3 h-3 md:w-4 md:h-4 ml-1 transition-colors ${hoveredNode === spot.id ? 'text-[#3B82F6]' : 'text-gray-400'}`} />

                                        <AnimatePresence>
                                            {hoveredNode === spot.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 55, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className={`absolute top-full mt-2 w-56 bg-white p-4 rounded-[20px] shadow-2xl border border-gray-100 ${spot.direction === 'left' ? 'right-0' : 'left-0'}`}
                                                >
                                                    <p className="text-gray-900 text-[12px] font-bold mb-1 line-clamp-1">{spot.desc}</p>
                                                    <p className="text-[#3B82F6] text-lg font-black mb-3">₹{spot.price}</p>
                                                    <div
                                                        onClick={() => handleQuickAdd(spot)}
                                                        className="w-full flex items-center justify-center gap-2 py-3 bg-[#0B1528] text-white text-[11px] font-bold uppercase rounded-xl cursor-pointer hover:bg-[#3B82F6] transition-all duration-300 shadow-lg shadow-blue-900/10"
                                                    >
                                                        <ShoppingCart className="w-3.5 h-3.5" />
                                                        Add to Cart
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MenInteractiveLook;
