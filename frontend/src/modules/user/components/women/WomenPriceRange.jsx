import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const priceRanges = [
    {
        id: 'under-1299',
        label: 'Under',
        price: '₹1299',
        priceMax: 1299,
        path: '/shop?category=women&price_max=1299',
        tagline: 'EVERYDAY ESSENTIALS',
    },
    {
        id: 'under-1499',
        label: 'Under',
        price: '₹1499',
        priceMax: 1499,
        path: '/shop?category=women&price_max=1499',
        tagline: 'ELEGANT CHARMS',
    },
    {
        id: 'under-1999',
        label: 'Under',
        price: '₹1999',
        priceMax: 1999,
        path: '/shop?category=women&price_max=1999',
        tagline: 'LUXURY STATEMENTS',
    },
];

const WomenPriceRange = () => {
    return (
        <section className="pt-8 pb-6 md:pt-12 md:pb-8 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 max-w-[1300px]">

                {/* Modern Editorial Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center mb-3 md:mb-5"
                >
                    <span 
                        className="text-[10px] md:text-[11px] font-bold tracking-[0.34em] uppercase mb-1 inline-block px-3 py-1 rounded-full bg-[#9B2245]/10"
                        style={{ color: '#9B2245' }}
                    >
                        Luxury within Reach
                    </span>
                    <h2 className="text-lg md:text-[28px] font-display text-gray-900 tracking-tight">Curated Price Points</h2>
                </motion.div>

                {/* Responsive Price Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[0.84fr_1.16fr_0.84fr] gap-3 md:gap-4 items-end">
                    {priceRanges.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.22, 1, 0.36, 1] }}
                            className={`w-full ${idx === 1 ? '' : 'md:pb-5'}`}
                        >
                            <Link
                                to={item.path}
                                className="group relative block w-full outline-none"
                            >
                                {/* Premium Card Container */}
                                <div
                                    className="relative flex flex-col items-center justify-center text-center overflow-hidden transition-all duration-700 ease-[0.22, 1, 0.36, 1] group-hover:shadow-[0_45px_100px_-20px_rgba(92,14,37,0.35)]"
                                    style={{
                                        background: 'linear-gradient(135deg, #4A0E1C 0%, #2A0610 50%, #150207 100%)',
                                        borderRadius: '18px',
                                        padding: idx === 1 ? 'clamp(20px, 4.2vw, 44px) 20px' : 'clamp(16px, 3.4vw, 34px) 16px',
                                        minHeight: idx === 1 ? 'clamp(132px, 18vw, 214px)' : 'clamp(98px, 13.5vw, 156px)',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                    }}
                                >
                                    {/* Animated Inner Shine Effect */}
                                    <div 
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
                                        style={{
                                            background: 'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 55%, transparent 100%)',
                                            transform: 'translateX(-100%) translateY(-100%)',
                                            animation: 'shine 4s infinite linear'
                                        }}
                                    />

                                    {/* Subtle Radial Glow on Hover */}
                                    <div 
                                        className="absolute inset-x-0 top-0 h-40 opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
                                        style={{
                                            background: 'radial-gradient(circle at 50% 0%, #9B2245 0%, transparent 70%)',
                                        }}
                                    />

                                    {/* Card Content - Improved Visibility */}
                                    <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-2">
                                        <p
                                            className="text-white/60 font-semibold tracking-[0.22em] uppercase mb-1.5 md:mb-2"
                                            style={{ fontSize: idx === 1 ? 'clamp(9px, 1vw, 12px)' : 'clamp(8px, 0.85vw, 10px)' }}
                                        >
                                            {item.label}
                                        </p>

                                        <h3
                                            className="text-white font-bold leading-none"
                                            style={{
                                                fontSize: idx === 1 ? 'clamp(28px, 4.2vw, 48px)' : 'clamp(22px, 3.2vw, 36px)',
                                                fontFamily: "'Playfair Display', serif",
                                                fontWeight: 800,
                                                letterSpacing: '-1px',
                                                textShadow: '0 4px 15px rgba(0,0,0,0.4)',
                                            }}
                                        >
                                            {item.price}
                                        </h3>

                                        {/* Dynamic Tagline Reveal */}
                                        <div className="h-0 group-hover:h-7 overflow-hidden transition-all duration-500 opacity-0 group-hover:opacity-100 mt-2">
                                            <p
                                                className="text-[#EBCDD0] font-bold tracking-[0.15em] whitespace-nowrap"
                                                style={{ fontSize: idx === 1 ? 'clamp(8px, 1vw, 10px)' : 'clamp(7px, 0.85vw, 9px)' }}
                                            >
                                                {item.tagline}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Premium Border Accent */}
                                    <div 
                                        className="absolute inset-0 rounded-[18px] pointer-events-none border border-white/0 group-hover:border-white/10 transition-all duration-500"
                                    />
                                    
                                    {/* Bottom Decorative Shimmer */}
                                    <div 
                                        className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#9B2245] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 w-0 group-hover:w-full mx-auto"
                                    />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Shine Animation CSS */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes shine {
                    0% { transform: translateX(-150%) translateY(-150%) rotate(45deg); }
                    20% { transform: translateX(150%) translateY(150%) rotate(45deg); }
                    100% { transform: translateX(150%) translateY(150%) rotate(45deg); }
                }
            `}} />
        </section>
    );
};

export default WomenPriceRange;
