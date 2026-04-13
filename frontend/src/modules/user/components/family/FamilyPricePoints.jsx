import React from 'react';
import { motion } from 'framer-motion';

const pricePoints = [
    { label: 'UNDER', price: '₹1299', delay: 0.1 },
    { label: 'UNDER', price: '₹1499', delay: 0.2, featured: true },
    { label: 'UNDER', price: '₹1999', delay: 0.3 }
];

const FamilyPricePoints = () => {
    return (
        <section className="py-6 bg-white border-b border-pink-50">
            <div className="container mx-auto px-4 md:px-12">
                {/* Header */}
                <div className="text-center mb-6">
                    <span className="inline-block px-3 py-1 bg-[#8E2B45] text-white text-[9px] font-black uppercase tracking-widest mb-2">
                        Luxury Within Reach
                    </span>
                    <h2 className="text-xl md:text-2xl font-serif text-[#2D060F] tracking-tight uppercase">
                        Curated <span className="italic font-light">Price Points</span>
                    </h2>
                </div>

                {/* Price Cards */}
                <div className="flex flex-wrap md:flex-nowrap justify-center items-center gap-4 md:gap-6">
                    {pricePoints.map((point, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -5 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: point.delay }}
                            className={`group relative flex-1 min-w-[200px] max-w-[320px] ${
                                point.featured ? 'h-[140px] md:h-[160px]' : 'h-[110px] md:h-[130px]'
                            } bg-[#FFD9E0] rounded-none overflow-hidden hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col justify-center items-center`}
                        >
                            {/* Texture Overlay */}
                            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/dust.png')] pointer-events-none" />
                            
                            {/* Content */}
                            <span className="text-[10px] md:text-xs text-[#8E2B45]/60 font-black uppercase tracking-[0.3em] mb-1">
                                {point.label}
                            </span>
                            <span className="text-3xl md:text-4xl text-[#8E2B45] font-serif font-black tracking-tighter">
                                {point.price}
                            </span>
                            
                            {/* Sophisticated Border */}
                            <div className="absolute inset-0 border border-[#8E2B45]/10 group-hover:border-[#8E2B45]/30 transition-all duration-500" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FamilyPricePoints;
