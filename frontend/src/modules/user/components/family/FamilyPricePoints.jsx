import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import card2999 from '../../assets/family_price_2999_clean.jpg';
import cardPremium from '../../assets/family_price_premium_clean.jpg';
import card4999 from '../../assets/family_price_4999_clean.jpg';

const pricePoints = [
    {
        id: 'under-2999',
        title: 'Under Rs 2999',
        caption: 'Keepsake rings and petite gifting picks.',
        image: card2999,
        link: '/shop?filter=family&maxPrice=2999',
        accent: 'Rose Pick',
        delay: 0.05
    },
    {
        id: 'premium-gifts',
        title: 'Premium Gifts',
        caption: 'Layered necklaces and heirloom-style favourites.',
        image: cardPremium,
        link: '/shop?filter=family&sort=featured',
        accent: 'Most Loved',
        featured: true,
        delay: 0.15
    },
    {
        id: 'under-4999',
        title: 'Under Rs 4999',
        caption: 'Statement bracelets for elegant family moments.',
        image: card4999,
        link: '/shop?filter=family&maxPrice=4999',
        accent: 'Easy Upgrade',
        delay: 0.25
    }
];

const FamilyPricePoints = () => {
    return (
        <section className="bg-[linear-gradient(180deg,#fff_0%,#fff8fa_48%,#fff_100%)] py-6 md:py-8">
            <div className="container mx-auto px-4 md:px-12">
                <div className="mx-auto max-w-4xl rounded-[28px] border border-[#f4d5dc] bg-white/95 px-4 py-5 shadow-[0_18px_50px_rgba(142,43,69,0.07)] md:px-6 md:py-6">
                    <div className="mb-4 text-center md:mb-6">
                        <span className="inline-flex items-center rounded-full border border-[#f1c7d2] bg-[#fff3f6] px-3 py-1 text-[9px] font-black uppercase tracking-[0.32em] text-[#8E2B45]">
                            Luxury Within Reach
                        </span>
                        <h2 className="mt-2 font-serif text-xl tracking-tight text-[#2D060F] md:text-3xl">
                            Family <span className="italic font-light text-[#8E2B45]">Gift Picks</span>
                        </h2>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3 md:items-start">
                        {pricePoints.map((point) => (
                            <motion.div
                                key={point.id}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.25 }}
                                transition={{ duration: 0.45, delay: point.delay }}
                                whileHover={{ y: -4 }}
                                className="group"
                            >
                                <Link
                                    to={point.link}
                                    className="block overflow-hidden rounded-[22px] border border-[#f3d8df] bg-white shadow-[0_16px_34px_rgba(142,43,69,0.1)] transition-all duration-300 hover:border-[#e7a8b9] hover:shadow-[0_20px_40px_rgba(142,43,69,0.14)]"
                                >
                                    <div className="relative p-3 pb-0">
                                        <div className="absolute left-5 top-5 z-10 rounded-full bg-white/92 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-[#8E2B45] shadow-sm">
                                            {point.accent}
                                        </div>
                                        <img
                                            src={point.image}
                                            alt={point.title}
                                            className="w-full rounded-[18px] object-cover transition-transform duration-500 group-hover:scale-[1.02] aspect-[0.86]"
                                        />
                                    </div>

                                    <div className="px-4 pb-4 pt-3 text-center md:px-5">
                                        <h3 className="font-serif text-lg text-[#2D060F] md:text-[1.65rem]">
                                            {point.title}
                                        </h3>
                                        <p className="mx-auto mt-1.5 max-w-[22ch] text-sm leading-relaxed text-[#7b5f67]">
                                            {point.caption}
                                        </p>
                                        <div className="mt-3 inline-flex items-center rounded-full bg-[#8E2B45] px-3.5 py-2 text-[9px] font-black uppercase tracking-[0.24em] text-white transition-colors duration-300 group-hover:bg-[#a93f5d]">
                                            Explore Edit
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FamilyPricePoints;
