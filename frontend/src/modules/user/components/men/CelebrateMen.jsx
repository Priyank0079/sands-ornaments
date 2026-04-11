import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Correct path to assets (4 levels up from src/modules/user/components/men/)
import giftBrothers from '../../../../assets/gift_brothers.png';
import giftHusbands from '../../../../assets/gift_husbands.png';
import giftCouples from '../../../../assets/gift_couples.png';
import giftBoyfriends from '../../../../assets/gift_boyfriends.png';

const guides = [
    { id: 1, title: 'Brothers', image: giftBrothers, link: '/shop?gifts=brothers' },
    { id: 2, title: 'Husbands', image: giftHusbands, link: '/shop?gifts=husbands' },
    { id: 3, title: 'Couple Gifts', image: giftCouples, link: '/shop?gifts=couples' },
    { id: 4, title: 'Boyfriends', image: giftBoyfriends, link: '/shop?gifts=boyfriends' }
];

const CelebrateMen = () => {
    const navigate = useNavigate();

    return (
        <section className="py-10 md:py-14 bg-[#F2E8E1]">
            <div className="container mx-auto px-4 max-w-[1240px]">
                
                {/* Header Section */}
                <div className="text-center mb-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#4A2D1F] mb-3 font-serif">
                        Celebrate Men
                    </h2>
                    <p className="text-[#6B4F3F] text-sm md:text-lg font-medium tracking-widest uppercase opacity-80">
                        A Gifting Guide For Them
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4 lg:gap-6">
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
                            <div className="relative aspect-[0.9/1] rounded-[2.5rem] overflow-hidden border-[6px] md:border-[10px] border-white shadow-xl bg-white transition-all duration-500">
                                <img 
                                    src={guide.image} 
                                    alt={guide.title} 
                                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                                />
                            </div>

                            {/* Gold Gradient Label at bottom matching screenshot */}
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[85%] z-20">
                                <div className="bg-gradient-to-b from-[#EFD78B] via-[#E6C673] to-[#D4AF37] py-2.5 md:py-3.5 rounded-2xl shadow-lg border border-white/40 text-center">
                                    <span className="text-[#1A1A1A] font-bold tracking-[0.15em] uppercase text-[12px] md:text-[14px]">
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
