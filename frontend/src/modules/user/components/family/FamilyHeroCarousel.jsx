import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import familyHeroBanner from '../../assets/family_hero_banner.jpg';

const PINK = '#FFD9E0';
const MAROON = '#8E2B45';

const FamilyHeroCarousel = () => {
    const navigate = useNavigate();

    return (
        <section className="relative w-full h-[320px] md:h-[450px] overflow-hidden select-none bg-[#111]">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 w-full h-full"
            >
                {/* Background Image with slow zoom animation */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[12000ms] scale-100 animate-slow-zoom"
                    style={{ 
                        backgroundImage: `url(${familyHeroBanner})`, 
                        backgroundPosition: 'center 40%',
                        filter: 'hue-rotate(330deg) brightness(0.85) contrast(1.15) saturate(1.2)' 
                    }}
                />
                
                {/* Dark & Elegant Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#2a0e16]/80 via-[#2a0e16]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-[#FFD9E0]/5 mix-blend-overlay" />

                {/* Content Overlay */}
                <div className="relative h-full container mx-auto px-6 md:px-20 flex flex-col justify-center items-start text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="max-w-xl"
                    >
                        <span className="inline-block text-[9px] md:text-[10px] text-[#FFD9E0] tracking-[0.4em] uppercase mb-4 font-black border-l-2 border-[#FFD9E0]/50 pl-3">
                            The Sands Family Boutique
                        </span>

                        <h1 className="text-4xl md:text-6xl font-serif text-white tracking-tight font-light leading-[1.1] mb-2 drop-shadow-lg">
                            Masterpiece <br />
                            <span className="italic text-[#FFD9E0]">
                                Gifting
                            </span>
                        </h1>

                        <p className="text-xs md:text-sm text-white/80 font-light mt-4 mb-8 tracking-wider max-w-sm leading-relaxed italic drop-shadow-md">
                            "Exquisite delicate treasures designed for those who matter most in your life."
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/shop?filter=family')}
                                className="px-8 py-3 bg-[#FFD9E0] text-[#8E2B45] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] rounded-none hover:bg-white transition-all shadow-2xl flex items-center gap-3 backdrop-blur-sm"
                            >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                Explore Catalog
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 opacity-5 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/dust.png')]" />

            <style>
                {`
                    @keyframes slowZoom {
                        from { transform: scale(1); }
                        to { transform: scale(1.05); }
                    }
                    .animate-slow-zoom {
                        animation: slowZoom 12s linear infinite alternate;
                    }
                `}
            </style>
        </section>
    );
};

export default FamilyHeroCarousel;
