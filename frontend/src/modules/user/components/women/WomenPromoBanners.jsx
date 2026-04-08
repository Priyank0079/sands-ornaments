import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import CoupleRingsImg from '../../../../assets/promos/DarkCoupleRings.png';
import PremiumGiftsImg from '../../../../assets/promos/DarkPremiumGifts.png';

const banners = [
    {
        id: 1,
        title: "Couple Rings",
        subtitle: "Eternal Bonds in Silver",
        image: CoupleRingsImg,
        link: "/shop?category=rings",
        color: "rose"
    },
    {
        id: 2,
        title: "Premium Gifts",
        subtitle: "Luxury for your Loved Ones",
        image: PremiumGiftsImg,
        link: "/shop?category=gifts",
        color: "amber"
    }
];

const WomenPromoBanners = () => {
    const navigate = useNavigate();

    return (
        <section className="py-16 bg-white px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
                {banners.map((banner, index) => (
                    <motion.div
                        key={banner.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: index * 0.2 }}
                        viewport={{ once: true }}
                        onClick={() => navigate(banner.link)}
                        className="relative h-[160px] md:h-[200px] rounded-[3rem] overflow-hidden cursor-pointer group shadow-2xl bg-zinc-900"
                    >
                        {/* High-Resolution Imagery */}
                        <img 
                            src={banner.image} 
                            alt={banner.title}
                            className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-[4s] group-hover:scale-110 group-hover:rotate-1"
                        />
                        
                        {/* Elegant Glass Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent group-hover:from-black/95 transition-colors duration-700" />
                        
                        {/* Text Content */}
                        <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-14 transform transition-transform duration-700 group-hover:translate-x-2">
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] text-white mb-3 shadow-sm">
                                    Exclusive
                                </span>
                                <h3 className="text-3xl md:text-4xl font-serif text-white tracking-tight leading-none mb-2 transition-colors">
                                    {banner.title}
                                </h3>
                                <p className="text-zinc-300 text-xs md:text-sm font-medium tracking-wide mb-5">
                                    {banner.subtitle}
                                </p>
                                
                                {/* Refined Interactive CTA */}
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black shadow-lg group-hover:w-32 transition-all duration-500 overflow-hidden relative">
                                        <div className="absolute left-1/2 -translate-x-1/2 group-hover:left-4 group-hover:translate-x-0 transition-all duration-500">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                        <span className="opacity-0 group-hover:opacity-100 ml-6 text-xs font-bold uppercase tracking-widest transition-opacity duration-300">
                                            Shop Now
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Subtle Border Glow */}
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[3rem]" />
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default WomenPromoBanners;
