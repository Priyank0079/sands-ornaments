import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Import image
import personalizedImg from '../../../../assets/men/personalized_full_banner.png';

const MenPersonalizedBanner = () => {
    return (
        <section className="w-full bg-white py-4 md:py-8 overflow-hidden">
            <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative w-full h-[320px] md:h-[480px] group cursor-pointer"
            >
                {/* Background Image - Full Width Edge to Edge */}
                <img 
                    src={personalizedImg} 
                    alt="Personalised Men's Jewellery" 
                    className="w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-105"
                />

                {/* Dark Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />

                {/* Content Section - Contained in the center but banner is full width */}
                <div className="absolute inset-0 z-10">
                    <div className="container mx-auto h-full px-8 md:px-16 flex flex-col justify-center items-start text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="max-w-2xl"
                        >
                            <h2 className="text-4xl md:text-8xl font-display text-white leading-none mb-4 md:mb-6" style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}>
                                Personalised
                            </h2>
                            <p className="text-sm md:text-2xl text-[#D9C4B1] font-light tracking-[0.15em] uppercase mb-8 md:mb-12">
                                Flawless Gifting, Tailored to You
                            </p>
                            
                            <Link 
                                to="/shop?category=Personalised"
                                className="inline-block"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-[#D9C4B1] to-[#C9A24D] text-[#3B2516] px-10 md:px-14 py-4 md:py-5 rounded-full font-bold text-xs md:text-lg tracking-[0.2em] uppercase shadow-2xl transition-all border border-white/30"
                                >
                                    Customise Now
                                </motion.div>
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {/* Decorative Elements - Floating Accent Line */}
                <div className="absolute bottom-12 right-12 hidden md:block">
                    <motion.div 
                        animate={{ width: [40, 120, 40] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="h-[2px] bg-[#D9C4B1]/40 rounded-full"
                    />
                </div>
            </motion.div>
        </section>
    );
};

export default MenPersonalizedBanner;
