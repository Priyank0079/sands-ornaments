import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Static asset from public folder
const PersonalisedImg = '/images/PersonalisedBannerWide.png';

const WomenPersonalisedBanner = () => {
    const navigate = useNavigate();

    return (
        <section className="bg-white w-full">
            <div 
                className="w-full overflow-hidden relative h-[300px] md:h-[380px] group cursor-pointer" 
                onClick={() => navigate('/shop?personalised=true')}
            >
                {/* Background Image */}
                <img 
                    src={PersonalisedImg} 
                    alt="Personalised Jewellery"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105"
                />
                
                {/* Dark Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center">
                    <div className="px-8 md:px-16 lg:px-24 w-full flex flex-col md:flex-row justify-between items-start md:items-center text-white space-y-6 md:space-y-0">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-3"
                        >
                            <div className="flex items-center gap-2 text-rose-300">
                                <Sparkles className="w-5 h-5" />
                                <span className="text-xs font-bold uppercase tracking-[0.4em]">Handcrafted for you</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-serif leading-tight">
                                Personalised
                            </h2>
                            <p className="text-lg md:text-xl font-light italic text-rose-100/90 max-w-sm">
                                Silver that feels intimately yours. Make an unforgettable statement.
                            </p>
                        </motion.div>
                        
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="bg-white text-black px-8 py-4 rounded-none font-bold uppercase text-xs tracking-widest flex items-center gap-3 hover:bg-rose-50 transition-all shadow-xl group-hover:translate-x-2"
                        >
                            Customise Now <ArrowRight className="w-4 h-4" />
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
