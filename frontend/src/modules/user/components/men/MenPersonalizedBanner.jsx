import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Import image
import personalizedImg from '../../../../assets/men/personalized_banner.png';

const MenPersonalizedBanner = () => {
    return (
        <section className="py-12 px-4 md:px-12 bg-transparent">
            <div className="max-w-7xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative w-full h-[300px] md:h-[450px] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl group"
                >
                    {/* Background Image */}
                    <img 
                        src={personalizedImg} 
                        alt="Personalised Men's Jewellery" 
                        className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105"
                    />

                    {/* Dark Overlay for Text Readability - Reversed for Left Text */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent md:from-black/70 md:via-black/20" />

                    {/* Content Section - Left Aligned to match the new flagship UI style */}
                    <div className="absolute inset-0 flex flex-col justify-center items-start text-left px-8 md:px-20 z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="max-w-xl"
                        >
                            <h2 className="text-4xl md:text-7xl font-display text-white leading-tight mb-4 md:mb-6" style={{ fontFamily: "'Cinzel', serif" }}>
                                Personalised
                            </h2>
                            <p className="text-sm md:text-xl text-[#D9C4B1] font-light tracking-[0.1em] uppercase mb-8 md:mb-10">
                                Flawless Gifting, Tailored to You
                            </p>
                            
                            <Link 
                                to="/shop?category=Personalised"
                                className="inline-block"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-[#D9C4B1] to-[#C9A24D] text-[#3B2516] px-8 md:px-10 py-3 md:py-4 rounded-full font-bold text-sm md:text-base tracking-wider shadow-lg transition-all border border-white/20"
                                >
                                    Customise Now
                                </motion.div>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute bottom-10 right-10 hidden md:block">
                        <div className="flex gap-2">
                            <div className="w-12 h-1 bg-white/30 rounded-full" />
                            <div className="w-4 h-1 bg-white/60 rounded-full" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default MenPersonalizedBanner;
