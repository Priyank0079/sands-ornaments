import React from 'react';
import { motion } from 'framer-motion';
import luxuryRing from '../../../../assets/luxury_ring_men.png';
import luxuryGifts from '../../../../assets/luxury_gifts_men.png';
import luxuryPendant from '../../../../assets/luxury_pendant_men.png';

const luxuryOffers = [
    {
        title: 'Under ₹2999',
        image: luxuryRing,
        link: '/shop?price_max=2999'
    },
    {
        title: 'Premium GIFTS',
        image: luxuryGifts,
        link: '/shop?type=gift'
    },
    {
        title: 'Under ₹4999',
        image: luxuryPendant,
        link: '/shop?price_max=4999'
    }
];

const MenLuxurySection = () => {
    return (
        <section className="pt-0 pb-2 md:pt-1 md:pb-6 bg-white">
            <div className="container mx-auto px-4 max-w-[950px]">
                <h2 className="text-2xl md:text-4xl font-bold text-[#101828] text-center mb-5 md:mb-10 tracking-tight font-serif">
                    Luxury Within Reach
                </h2>

                <div className="flex justify-between md:grid md:grid-cols-3 gap-2 md:gap-8 items-center">
                    {luxuryOffers.map((offer, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30, scale: idx === 1 ? 1 : 0.9 }}
                            whileInView={{ 
                                opacity: 1, 
                                y: 0, 
                                scale: idx === 1 ? 1.05 : 0.95 
                            }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className={`relative group flex-1 cursor-pointer overflow-hidden rounded-2xl md:rounded-[40px] border border-[#D4AF37]/30 md:border-[1.5px] aspect-[0.92/1] shadow-lg hover:shadow-2xl transition-all duration-500 ${idx === 1 ? 'z-10 shadow-xl' : 'z-0'}`}
                        >
                            <img
                                src={offer.image}
                                alt={offer.title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />

                            {/* Black semi-transparent overlay at bottom matching screenshot */}
                            <div className="absolute bottom-0 left-0 w-full h-[30%] md:h-[24%] bg-black/80 flex flex-col md:flex-row items-center justify-center px-1 md:px-4">
                                <div className="text-white flex flex-col md:flex-row items-center md:items-baseline justify-center gap-0 md:gap-1 font-display">
                                    {offer.title.includes('₹') ? (
                                        <>
                                            <span className="font-light uppercase text-[7px] md:text-xs tracking-[0.1em] md:tracking-[0.2em] opacity-80 mt-1 md:mt-0">Under</span>
                                            <span className="text-[11px] md:text-3xl font-bold tracking-tight">₹{offer.title.split('₹')[1]}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="font-light uppercase text-[7px] md:text-xs tracking-[0.1em] md:tracking-[0.2em] opacity-80 mt-1 md:mt-0">Premium</span>
                                            <span className="text-[11px] md:text-3xl font-bold uppercase tracking-widest">GIFTS</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MenLuxurySection;
