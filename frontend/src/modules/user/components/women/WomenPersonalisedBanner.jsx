import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import PersonalisedImg from '../../../../assets/promos/PersonalisedBannerWide.png';

const WomenPersonalisedBanner = () => {
    const navigate = useNavigate();

    return (
        <section className="bg-white w-full">
            <div 
                className="w-full overflow-hidden relative h-[220px] sm:h-[280px] md:h-[380px] group cursor-pointer" 
                onClick={() => navigate('/shop?personalised=true')}
            >
                {/* Background Image */}
                <img 
                    src={PersonalisedImg} 
                    alt="Personalised Jewellery"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105"
                />
                
                {/* Dark Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent flex items-center">
                    <div className="px-5 sm:px-8 md:px-16 lg:px-24 w-full flex flex-col md:flex-row justify-between items-start md:items-center text-white gap-4 md:gap-0">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-1.5 md:space-y-3"
                        >
                            <div className="flex items-center gap-2 text-rose-300">
                                <Sparkles className="w-3.5 h-3.5 md:w-5 md:h-5" />
                                <span className="text-[9px] md:text-xs font-bold uppercase tracking-[0.4em]">Handcrafted for you</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl md:text-6xl font-serif leading-tight">
                                Personalised
                            </h2>
                            <p className="text-xs sm:text-sm md:text-xl font-light italic text-rose-100/90 max-w-[200px] sm:max-w-xs md:max-w-sm">
                                Silver that feels intimately yours. Make an unforgettable statement.
                            </p>
                        </motion.div>
                        
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="bg-white text-black px-5 py-2.5 md:px-8 md:py-4 rounded-none font-bold uppercase text-[10px] md:text-xs tracking-widest flex items-center gap-2 hover:bg-rose-50 transition-all shadow-xl"
                        >
                            Customise Now <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                        </motion.button>
                    </div>
                </div>

                {/* Decorative Signature Line on Hover */}
                <div className="absolute top-0 left-0 w-full h-1 bg-rose-300/0 transition-all duration-700 group-hover:bg-rose-300/80" />
            </div>
        </section>
    );
};

export default WomenPersonalisedBanner;
