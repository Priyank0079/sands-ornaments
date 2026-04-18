import React from 'react';
import { motion } from 'framer-motion';
import familyLuxuryBanner from '@assets/family_luxury_banner_new.png';

const FamilyPromoBanner = () => {
    return (
        <section className="w-full bg-white py-0 md:py-2">
            <div 
                className="w-full overflow-hidden relative bg-cover bg-center h-[200px] sm:h-[300px] md:h-[500px] flex items-center justify-center md:justify-center shadow-lg group" 
                style={{ backgroundImage: `url(${familyLuxuryBanner})` }}
            >
                {/* Elegant Glassmorphism Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-700" />
                
                {/* Sophisticated Radial Gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)] pointer-events-none" />

                {/* Main Content */}
                <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center"
                    >
                        <span className="text-[#FFD9E0] text-[10px] md:text-sm font-bold tracking-[0.4em] uppercase mb-2 md:mb-4 drop-shadow-md">
                            Exclusive Collection
                        </span>
                        
                        <h2 className="text-white font-serif text-3xl sm:text-5xl md:text-7xl leading-tight mb-3 md:mb-6 tracking-tight drop-shadow-2xl">
                            Gifts for <span className="italic font-light">Family</span>
                        </h2>

                        <div className="w-12 md:w-20 h-[1px] bg-[#FFD9E0]/60 mb-3 md:mb-6" />

                        <p className="text-white/90 text-xs sm:text-lg md:text-xl font-light tracking-[0.05em] drop-shadow-lg italic max-w-lg leading-relaxed">
                            "Cherish the bonds that last a lifetime with our curated masterpiece collection."
                        </p>
                    </motion.div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD9E0]/30 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD9E0]/30 to-transparent" />
            </div>
        </section>
    );
};

export default FamilyPromoBanner;

