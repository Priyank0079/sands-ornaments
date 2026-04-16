import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { buildWomenShopPath } from '../../utils/womenNavigation';
import heroRadiance from '../../assets/women_hero_radiance.png';

const slides = [
    {
        id: 1,
        title: "Eternal ",
        titleItalic: "Radiance",
        subtitle: "Diamonds that capture the light and her heart.",
        image: heroRadiance,
        cta: "Shop Diamonds",
        accent: "#FFFFFF"
    }
];

const WomenHeroCarousel = ({ data }) => {
    const [current, setCurrent] = useState(0);
    const navigate = useNavigate();

    // Use items from data if they exist, otherwise fallback to local slides
    const activeItems = data?.items?.length > 0 ? data.items : slides;
    const currentSlide = activeItems[current] || activeItems[0];

    return (
        <section className="relative w-full h-[200px] md:h-[400px] overflow-hidden select-none">
            <div className="absolute inset-0 w-full h-full">
                {/* Full Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] hover:scale-105"
                    style={{ backgroundImage: `url(${currentSlide.image})`, backgroundPosition: 'center 35%' }}
                />

                {/* Sophisticated Gradients for Depth */}
                <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/20 to-transparent" />

                {/* Content Overlay - Centered Right for the provided look */}
                <div className="relative h-full container mx-auto px-6 md:px-20 flex flex-col justify-center items-end text-right">
                    <motion.div
                        key={currentSlide.id}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="max-w-xl"
                    >
                        <span className="inline-block text-[8px] md:text-xs text-white/50 tracking-[0.3em] md:tracking-[0.5em] uppercase mb-2 md:mb-4 font-bold border-r-2 border-white/30 pr-2 md:pr-4">
                            {currentSlide.tag || "Sands Ornaments Exclusive"}
                        </span>

                        <h1 className="text-4xl md:text-8xl font-serif text-white tracking-tight font-light leading-[1] transition-all text-wrap">
                            {currentSlide.label}
                            {currentSlide.titleItalic && (
                                <span className="italic" style={{ color: currentSlide.accent || '#FFFFFF' }}>
                                    {currentSlide.titleItalic}
                                </span>
                            )}
                        </h1>

                        <p className="text-xs md:text-lg text-white/80 font-light mt-2 mb-4 md:mt-4 md:mb-8 tracking-wide italic">
                            {currentSlide.subtitle}
                        </p>

                        <div className="flex flex-wrap gap-4 justify-end">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(currentSlide.path || '/shop')}
                                className="px-5 py-2 md:px-8 md:py-4 bg-white text-black text-[8px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] rounded-none hover:bg-black hover:text-white transition-all shadow-2xl flex items-center gap-2 md:gap-3 group"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                {currentSlide.ctaLabel || currentSlide.cta || "Shop Now"}
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
