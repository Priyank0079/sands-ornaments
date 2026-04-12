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
        <section className="pt-0 pb-4 md:pt-1 md:pb-6 bg-white">
            <div className="container mx-auto px-4 max-w-[950px]">
                <h2 className="text-2xl md:text-4xl font-bold text-[#101828] text-center mb-5 md:mb-10 tracking-tight font-serif">
                    Luxury Within Reach
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center">
                    {luxuryOffers.map((offer, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30, scale: idx === 1 ? 1 : 0.9 }}
                            whileInView={{ 
                                opacity: 1, 
                                y: 0, 
                                scale: idx === 1 ? 1.1 : 0.92 
                            }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className={`relative group cursor-pointer overflow-hidden rounded-[30px] md:rounded-[40px] border-[1.5px] border-[#D4AF37]/30 aspect-[0.92/1] shadow-lg hover:shadow-2xl transition-all duration-500 ${idx === 1 ? 'z-10 shadow-xl' : 'z-0'}`}
                        >
                            <img
                                src={offer.image}
                                alt={offer.title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />

                            {/* Black semi-transparent overlay at bottom matching screenshot */}
                            <div className="absolute bottom-0 left-0 w-full h-[20%] md:h-[24%] bg-black/80 flex items-center justify-center px-4">
                                <h3 className="text-white flex items-baseline gap-1 font-display">
                                    {offer.title.includes('₹') ? (
                                        <>
                                            <span className="font-light uppercase text-[10px] md:text-xs tracking-[0.2em] opacity-80">Under</span>
                                            <span className="text-2xl md:text-3xl font-bold tracking-tight">₹{offer.title.split('₹')[1]}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="font-light uppercase text-[10px] md:text-xs tracking-[0.2em] opacity-80">Premium</span>
                                            <span className="text-2xl md:text-3xl font-bold uppercase tracking-widest">GIFTS</span>
                                        </>
                                    )}
                                </h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MenLuxurySection;
