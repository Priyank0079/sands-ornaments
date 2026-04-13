import React from 'react';
import { motion } from 'framer-motion';
import familyWideBanner from '../../assets/family_wide_banner_4k.png';

const FamilyPromoBanner = () => {
    return (
        <section className="w-full bg-white">
            <div 
                className="w-full overflow-hidden relative bg-cover bg-center h-[280px] sm:h-[350px] md:h-[450px] flex items-center justify-center md:justify-end shadow-md" 
                style={{ backgroundImage: `url(${familyWideBanner})` }}
            >
                {/* Strong overlay to ensure text readability against the intricate jewelry background */}
                <div className="absolute inset-x-0 bottom-0 top-1/2 md:top-0 md:inset-y-0 md:left-1/2 right-0 bg-gradient-to-t md:bg-gradient-to-l from-[#4a0d1d]/90 via-[#8E2B45]/70 to-transparent pointer-events-none" />

                {/* Text Information explicitly positioned to blend beautifully */}
                <div className="w-full md:w-[45%] flex flex-col justify-end md:justify-center items-center text-center pb-12 md:pb-0 relative z-20">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-white font-serif text-4xl sm:text-5xl md:text-[4rem] leading-tight mb-2 md:mb-5 tracking-wide drop-shadow-xl"
                    >
                        Gifts for family
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="text-white/95 text-base sm:text-lg md:text-2xl font-light tracking-[0.05em] drop-shadow-lg italic"
                    >
                        "The surprise they'll adore"
                    </motion.p>
                </div>
            </div>
        </section>
    );
};

export default FamilyPromoBanner;
