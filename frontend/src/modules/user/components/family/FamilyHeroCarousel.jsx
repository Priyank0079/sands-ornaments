import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroHeirlooms from '../../assets/family_hero_heirlooms.png';

const slides = [
    {
        id: 1,
        title: "Family ",
        titleItalic: "Heirlooms",
        subtitle: "Treasures to pass down through generations with love.",
        image: heroHeirlooms,
        cta: "Shop Family Sets",
        accent: "#D39A9F"
    }
];

const FamilyHeroCarousel = () => {
    const navigate = useNavigate();

    return (
        <section className="relative w-full h-[320px] md:h-[400px] overflow-hidden select-none bg-black">
            <div className="absolute inset-0 w-full h-full">
                {/* Full Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] hover:scale-105 opacity-80"
                    style={{ backgroundImage: `url(${slides[0].image})`, backgroundPosition: 'center 40%' }}
                />

                {/* Sophisticated Gradients for Depth */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

                {/* Content Overlay */}
                <div className="relative h-full container mx-auto px-6 md:px-20 flex flex-col justify-center items-start text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="max-w-xl"
                    >
                        <span className="inline-block text-[10px] md:text-xs text-white/50 tracking-[0.5em] uppercase mb-4 font-bold border-l-2 border-[#D39A9F]/50 pl-4">
                            Sands Family Collection
                        </span>

                        <h1 className="text-5xl md:text-7xl font-serif text-white tracking-tight font-light leading-[1] transition-all">
                            {slides[0].title}
                            <span className="italic" style={{ color: slides[0].accent }}>
                                {slides[0].titleItalic}
                            </span>
                        </h1>

                        <p className="text-base md:text-lg text-white/80 font-light mt-4 mb-8 tracking-wide italic">
                            {slides[0].subtitle}
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/shop?filter=family')}
                                className="px-8 py-3 bg-white text-black text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] rounded-none hover:bg-[#D39A9F] hover:text-white transition-all shadow-2xl flex items-center gap-3"
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

export default FamilyHeroCarousel;
