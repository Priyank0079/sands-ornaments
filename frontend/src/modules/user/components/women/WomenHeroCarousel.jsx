import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const slides = [
    {
        id: 1,
        title: "Eternal ",
        titleItalic: "Radiance",
        subtitle: "Diamonds that capture the light and her heart.",
        image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=90&w=2600&auto=format&fit=crop",
        cta: "Shop Diamonds",
        accent: "#FFFFFF"
    }
];

const WomenHeroCarousel = () => {
    const [current, setCurrent] = useState(0);
    const navigate = useNavigate();

    return (
        <section className="relative w-full h-[320px] md:h-[400px] overflow-hidden select-none">
            <div className="absolute inset-0 w-full h-full">
                {/* Full Background Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] hover:scale-105"
                    style={{ backgroundImage: `url(${slides[0].image})`, backgroundPosition: 'center 35%' }}
                />
                
                {/* Sophisticated Gradients for Depth */}
                <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/20 to-transparent" />

                {/* Content Overlay - Centered Right for the provided look */}
                <div className="relative h-full container mx-auto px-6 md:px-20 flex flex-col justify-center items-end text-right">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="max-w-xl"
                    >
                        <span className="inline-block text-[10px] md:text-xs text-white/50 tracking-[0.5em] uppercase mb-4 font-bold border-r-2 border-white/30 pr-4">
                            Sands Ornaments Exclusive
                        </span>
                        
                        <h1 className="text-5xl md:text-8xl font-serif text-white tracking-tight font-light leading-[1] transition-all">
                            {slides[0].title}
                            <span className="italic" style={{ color: slides[0].accent }}>
                                {slides[0].titleItalic}
                            </span>
                        </h1>

                        <p className="text-base md:text-lg text-white/80 font-light mt-4 mb-8 tracking-wide italic">
                            {slides[0].subtitle}
                        </p>
                        
                        <div className="flex flex-wrap gap-4 justify-end">
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/shop?category=women')}
                                className="px-8 py-4 bg-white text-black text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] rounded-none hover:bg-black hover:text-white transition-all shadow-2xl flex items-center gap-3 group"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                {slides[0].cta}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

                {/* Subtle Texture Overlay */}
                <div className="absolute inset-0 opacity-5 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/dust.png')]" />
            </div>
        </section>
    );
};


export default WomenHeroCarousel;
