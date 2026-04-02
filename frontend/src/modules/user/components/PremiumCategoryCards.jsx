import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import menImg from '../assets/cat_men_nobg.png';
import womenImg from '../assets/cat_women_nobg.png';
import allImg from '../assets/cat_all_nobg.png';

const PremiumCategoryCards = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    const categories = [
        {
            title: 'Men',
            subtitle: 'FOR HIM',
            image: menImg,
            path: '/category/men',
            bgColor: '#F3C4C9',
            delay: 0.1
        },
        {
            title: 'Women',
            subtitle: 'FOR HER',
            image: womenImg,
            path: '/category/women',
            bgColor: '#F3C4C9',
            delay: 0.2
        },
        {
            title: 'All',
            subtitle: 'FOR EVERYONE',
            image: allImg,
            path: '/shop',
            bgColor: '#F3C4C9',
            delay: 0.3
        }
    ];

    return (
        <section 
            ref={containerRef}
            className="py-10 md:py-14 bg-[#FFF5F6] overflow-visible select-none relative"
        >
            {/* Subtle Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#EEB1B7] rounded-full blur-[100px]" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#EEB1B7] rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 md:px-6">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
                >
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 50 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: cat.delay, ease: "easeOut" }}
                            className="group relative cursor-pointer flex flex-col items-center"
                            onClick={() => navigate(cat.path)}
                            whileHover={{ y: -10 }}
                        >
                            {/* Small Card Background Wrapper */}
                            <div className="relative w-full aspect-[4/5] max-w-[280px] flex flex-col items-center justify-end overflow-visible">
                                
                                {/* The Box itself (slightly rounded, soft pink) */}
                                <motion.div
                                    className="absolute inset-x-0 bottom-0 top-[30%] rounded-[40px] transition-all duration-700 shadow-[0_10px_30px_rgba(238,177,183,0.2)] group-hover:shadow-[0_25px_60px_rgba(238,177,183,0.45)]"
                                    style={{ 
                                        background: `linear-gradient(135deg, ${cat.bgColor} 0%, #EEB1B7 100%)`,
                                    }}
                                    layoutId={`bg-${idx}`}
                                />

                                {/* Floating Decorative Label */}
                                <div className="absolute top-[35%] left-10 opacity-20 group-hover:opacity-40 transition-opacity duration-700 select-none">
                                    <span className="text-4xl md:text-5xl font-black text-white leading-none tracking-tighter">
                                        {cat.title.toUpperCase()}
                                    </span>
                                </div>

                                {/* The PNG-style model image (overflowing outside top) */}
                                <div className="relative z-10 w-full h-full flex items-end justify-center overflow-visible px-4 pb-0">
                                    <motion.img
                                        src={cat.image}
                                        alt={cat.title}
                                        className="h-[125%] w-auto object-contain transition-all duration-700 cursor-pointer drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] mix-blend-multiply brightness-[1.02] contrast-[1.05]"
                                        style={{ transformOrigin: 'bottom center' }}
                                        whileHover={{ scale: 1.05 }}
                                    />
                                    
                                    {/* Reflection Effect */}
                                    <div className="absolute bottom-0 w-[60%] h-4 bg-black/5 blur-xl rounded-full scale-x-150 opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
                                </div>

                                {/* Text Label Pill Inside Box Area */}
                                <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 z-20 w-full px-6 text-center">
                                    <motion.div 
                                        className="inline-block bg-white/90 backdrop-blur-md rounded-2xl px-8 py-3 mb-3 shadow-[0_10px_25px_rgba(0,0,0,0.05)] border border-[#F3C4C9]/50 overflow-hidden relative group"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div className="relative z-10">
                                            <p className="text-[9px] font-bold tracking-[0.2em] text-[#EEB1B7] mb-1 uppercase leading-none">
                                                {cat.subtitle}
                                            </p>
                                            <h3 className="font-serif text-2xl text-[#5E2B2F] font-bold tracking-tight leading-none bg-gradient-to-r from-[#5E2B2F] to-[#8E4B4F] bg-clip-text">
                                                {cat.title}
                                            </h3>
                                        </div>
                                        
                                        {/* Hover shine effect */}
                                        <motion.div 
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                                            style={{ skewX: -20 }}
                                        />
                                    </motion.div>
                                    
                                    {/* Shop Now CTA Button */}
                                    <motion.div 
                                        className="flex items-center justify-center gap-2 bg-[#5E2B2F] text-white px-6 py-2.5 rounded-full text-[10px] font-bold tracking-[0.2em] shadow-md transition-all duration-300 hover:bg-[#8E4B4F] hover:shadow-lg hover:shadow-[#5E2B2F]/20 group/btn overflow-hidden relative"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span className="relative z-10">SHOP NOW</span>
                                        <motion.span 
                                            className="text-sm relative z-10"
                                            animate={{ x: [0, 4, 0] }}
                                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                        >
                                            →
                                        </motion.span>

                                        {/* Hover shine effect */}
                                        <motion.div 
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"
                                            style={{ skewX: -20 }}
                                        />
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default PremiumCategoryCards;
