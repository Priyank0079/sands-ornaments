import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import menImg from '../assets/cat_men_nobg.png';
import womenImg from '../assets/cat_women_premium_nobg.png';
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
            className="pt-16 md:pt-24 pb-16 md:pb-24 bg-[#FFF5F6] overflow-visible select-none relative"
        >
            {/* Subtle Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#EEB1B7] rounded-full blur-[100px]" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#EEB1B7] rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 md:px-6">
                {/* --- ANIMATED HEADING SECTION --- */}
                <motion.div 
                    className="text-center flex flex-col items-center justify-center mb-16 md:mb-20"
                    initial={{ opacity: 0, y: -20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="relative inline-block pb-4 mb-4">
                        <motion.h2 
                            className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-wider"
                            style={{
                                backgroundImage: `linear-gradient(to right, #5E2B2F, #C58C92, #5E2B2F)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundSize: '200% auto',
                            }}
                            animate={{ backgroundPosition: ['0% center', '200% center'] }}
                            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                        >
                            Embrace Your Essence
                        </motion.h2>
                        {/* Animated Underline */}
                        <motion.div 
                            className="absolute bottom-0 left-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#8E4B4F] to-transparent"
                            initial={{ width: 0, x: "-50%" }}
                            animate={isInView ? { width: "100%", x: "-50%" } : { width: 0, x: "-50%" }}
                            transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
                        />
                        {/* Little Diamond Shape at the center of the underline */}
                        <motion.div 
                            className="absolute -bottom-[3px] left-[48.5%] w-2 h-2 rotate-45 bg-gradient-to-br from-[#EEB1B7] to-[#5E2B2F]"
                            initial={{ scale: 0, x: "-50%" }}
                            animate={isInView ? { scale: 1, x: "-50%" } : { scale: 0, x: "-50%" }}
                            transition={{ duration: 0.6, delay: 1.2, type: "spring", stiffness: 200 }}
                        />
                    </div>
                    
                    <motion.p 
                        className="text-[#8E4B4F] text-xs md:text-sm tracking-[0.3em] uppercase max-w-xl mx-auto"
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        Handcrafted jewels designed to elevate every moment
                    </motion.p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: "easeOut", staggerChildren: 0.2 }}
                    className="flex flex-wrap justify-center gap-x-6 md:gap-x-12 lg:gap-x-20 gap-y-24"
                >
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 60 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            whileHover={{ y: -15, scale: 1.02 }}
                            transition={{ duration: 0.6, delay: cat.delay, ease: "easeOut" }}
                            className="group relative cursor-pointer flex flex-col items-center"
                            onClick={() => navigate(cat.path)}
                        >
                            {/* Small Card Background Wrapper */}
                            <div className="relative w-full aspect-[4/5] w-[260px] md:w-[320px] max-w-[340px] flex flex-col items-center justify-end overflow-visible">

                                {/* The Box itself (slightly rounded, soft pink) */}
                                <motion.div
                                    className="absolute inset-x-0 bottom-0 top-[30%] rounded-[40px] transition-all duration-700 shadow-[0_10px_30px_rgba(238,177,183,0.2)] group-hover:shadow-[0_25px_60px_rgba(238,177,183,0.45)]"
                                    style={{
                                        background: `linear-gradient(135deg, ${cat.bgColor} 0%, #EEB1B7 100%)`,
                                    }}
                                    layoutId={`bg-${idx}`}
                                />

                                {/* The PNG-style model image (overflowing outside top) */}
                                <div className="relative z-10 w-full h-full flex items-end justify-center overflow-visible px-4 pb-0">
                                    <motion.img
                                        src={cat.image}
                                        alt={cat.title}
                                        className="h-[210%] w-auto object-contain transition-all duration-700 cursor-pointer drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] brightness-[1.1] contrast-[1.05] translate-y-[158px]"
                                        style={{ transformOrigin: 'bottom center' }}
                                        whileHover={{ scale: 1.05 }}
                                    />

                                    {/* Reflection Effect */}
                                    <div className="absolute bottom-0 w-[60%] h-4 bg-black/5 blur-xl rounded-full scale-x-150 opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
                                </div>

                                {/* Category Label & Shop Now Button at Bottom */}
                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 w-full px-8 text-center">
                                    {/* Single line label */}
                                    <p className="text-[10px] font-bold text-[#5E2B2F] uppercase tracking-[0.2em] mb-2 whitespace-nowrap bg-white/40 backdrop-blur-sm py-1 px-3 rounded-full inline-block">
                                        {cat.subtitle} • {cat.title}
                                    </p>

                                    <motion.div
                                        className="flex items-center justify-center gap-2 bg-[#5E2B2F] text-white px-5 py-2.5 rounded-full text-[9px] font-bold tracking-[0.2em] shadow-md transition-all duration-300 hover:bg-[#8E4B4F] hover:shadow-lg hover:shadow-[#5E2B2F]/20 group/btn overflow-hidden relative"
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span className="relative z-10">SHOP NOW</span>
                                        <motion.span
                                            className="text-xs relative z-10"
                                            animate={{ x: [0, 4, 0] }}
                                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                        >
                                            →
                                        </motion.span>

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
