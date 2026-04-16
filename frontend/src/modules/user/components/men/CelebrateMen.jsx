import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { buildMenShopPath } from '../../utils/menNavigation';

// Correct path to assets (4 levels up from src/modules/user/components/men/)
import giftBrothers from '@assets/gift_brothers.png';
import giftHusbands from '@assets/gift_husbands.png';
import giftCouples from '@assets/gift_couples.png';
import giftBoyfriends from '@assets/gift_boyfriends.png';

const guides = [
    { id: 1, title: 'Brothers', image: giftBrothers, link: buildMenShopPath({ filter: 'brothers' }) },
    { id: 2, title: 'Husbands', image: giftHusbands, link: buildMenShopPath({ filter: 'husbands' }) },
    { id: 3, title: 'Couple Gifts', image: giftCouples, link: buildMenShopPath({ filter: 'couples' }) },
    { id: 4, title: 'Boyfriends', image: giftBoyfriends, link: buildMenShopPath({ filter: 'boyfriends' }) }
];

const CelebrateMen = () => {
    const navigate = useNavigate();

    return (
        <section className="py-3 md:py-9 bg-[#F2E8E1]">
            <div className="container mx-auto px-4 max-w-[1240px]">
                
                {/* Header Section */}
                <div className="text-center mb-4 md:mb-8">
                    <h2 className="text-3xl md:text-[42px] font-bold text-[#4A2D1F] mb-2 font-serif">
                        Celebrate Men
                    </h2>
                    <p className="text-[#6B4F3F] text-xs md:text-base font-medium tracking-[0.22em] uppercase opacity-80">
                        A Gifting Guide For Them
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-6 md:gap-4 lg:gap-5 px-1 md:px-0">
                    {guides.map((guide, idx) => (
                        <motion.div
                            key={guide.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            onClick={() => navigate(guide.link)}
                            className="group relative cursor-pointer"
                        >
                            {/* Card with Thick white border matching screenshot */}
                            <div className="relative aspect-[0.9/0.94] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border-[4px] md:border-[8px] border-white shadow-[0_12px_30px_-15px_rgba(74,45,31,0.35)] bg-white transition-all duration-500">
                                <img 
                                    src={guide.image} 
                                    alt={guide.title} 
                                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                                />
                            </div>

                            {/* Gold Gradient Label at bottom matching screenshot */}
                            <div className="absolute -bottom-2 md:-bottom-1 left-1/2 -translate-x-1/2 w-[85%] md:w-[82%] z-20">
                                <div className="bg-gradient-to-b from-[#EFD78B] via-[#E6C673] to-[#D4AF37] py-1.5 md:py-3 rounded-[12px] md:rounded-[18px] shadow-lg border border-white/40 text-center flex items-center justify-center">
                                    <span className="text-[#1A1A1A] font-bold tracking-[0.1em] md:tracking-[0.14em] uppercase text-[9px] md:text-[13px] leading-none mt-1 md:mt-0">
                                        {guide.title}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CelebrateMen;

