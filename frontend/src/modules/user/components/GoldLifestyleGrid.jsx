import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import casualImg from '@assets/lifestyle_casual.png';
import partyImg from '@assets/lifestyle_party.png';
import traditionalImg from '@assets/lifestyle_traditional.png';
import minimalisticImg from '@assets/lifestyle_minimalistic.png';
import twinningImg from '@assets/lifestyle_twinning.png';
import dateNightImg from '@assets/lifestyle_date_night.png';
import giftCardImg from '@assets/lifestyle_gift_card.png';

const GoldLifestyleGrid = () => {
    const navigate = useNavigate();

    const items = [
        {
            id: 1,
            title: 'Casual Wear',
            image: casualImg,
            path: '/shop?occasion=casual&metal=gold',
            span: 'col-span-1 row-span-1'
        },
        {
            id: 2,
            title: 'Party Wear',
            image: partyImg,
            path: '/shop?occasion=party&metal=gold',
            span: 'col-span-1 row-span-2'
        },
        {
            id: 3,
            title: 'Gold Gift Card',
            image: giftCardImg,
            path: '/help', // Or actual gift card path if exists
            span: 'col-span-1 row-span-1'
        },
        {
            id: 4,
            title: 'Twinning',
            image: twinningImg,
            path: '/shop?search=twinning&metal=gold',
            span: 'col-span-1 row-span-2'
        },
        {
            id: 5,
            title: 'Traditional',
            image: traditionalImg,
            path: '/shop?occasion=traditional&metal=gold',
            span: 'col-span-1 row-span-1'
        },
        {
            id: 6,
            title: 'Traditional',
            image: traditionalImg,
            path: '/shop?occasion=traditional&metal=gold',
            span: 'col-span-1 row-span-1'
        },
        {
            id: 7,
            title: 'Minimalistic',
            image: minimalisticImg,
            path: '/shop?search=minimalistic&metal=gold',
            span: 'col-span-1 row-span-1'
        },
        {
            id: 8,
            title: 'Date Nights',
            image: dateNightImg,
            path: '/shop?occasion=date-night&metal=gold',
            span: 'col-span-1 row-span-1'
        }
    ];

    return (
        <section className="w-full py-16 bg-white">
            <div className="max-w-[1450px] mx-auto px-4 md:px-6">

                {/* Masonry-style Grid for Desktop */}
                <div className="hidden md:grid grid-cols-5 grid-rows-2 gap-4 h-[600px]">

                    {/* Item 1: Casual Wear (Top Left) */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => navigate(items[0].path)}
                        className="col-span-1 row-span-1 relative rounded-[32px] overflow-hidden group cursor-pointer shadow-md"
                    >
                        <img src={items[0].image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-6">
                            <span className="text-white font-bold text-xl tracking-wide">{items[0].title}</span>
                        </div>
                    </motion.div>

                    {/* Item 2: Party Wear (Tall) */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => navigate(items[1].path)}
                        className="col-span-1 row-span-2 relative rounded-[32px] overflow-hidden group cursor-pointer shadow-md"
                    >
                        <img src={items[1].image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-8 text-center px-4">
                            <span className="text-white font-bold text-2xl tracking-wide leading-tight">{items[1].title}</span>
                        </div>
                    </motion.div>

                    {/* Item 3: Gift Card (Top Middle) */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => navigate(items[2].path)}
                        className="col-span-1 row-span-1 relative rounded-[32px] overflow-hidden group cursor-pointer shadow-md"
                    >
                        <img src={items[2].image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-6">
                            <span className="text-white font-bold text-xl tracking-wide">{items[2].title}</span>
                        </div>
                    </motion.div>

                    {/* Item 4: Twinning (Tall) */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => navigate(items[3].path)}
                        className="col-span-1 row-span-2 relative rounded-[32px] overflow-hidden group cursor-pointer shadow-md"
                    >
                        <img src={items[3].image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-8">
                            <span className="text-white font-bold text-2xl tracking-wide">{items[3].title}</span>
                        </div>
                    </motion.div>

                    {/* Item 5: Traditional (Top Right) */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => navigate(items[4].path)}
                        className="col-span-1 row-span-1 relative rounded-[32px] overflow-hidden group cursor-pointer shadow-md"
                    >
                        <img src={traditionalImg} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-6">
                            <span className="text-white font-bold text-xl tracking-wide">Traditional</span>
                        </div>
                    </motion.div>

                    {/* Item 6: Traditional (Bottom Left) */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => navigate(items[5].path)}
                        className="col-span-1 row-span-1 relative rounded-[32px] overflow-hidden group cursor-pointer shadow-md"
                    >
                        <img src={traditionalImg} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-6">
                            <span className="text-white font-bold text-xl tracking-wide">Traditional</span>
                        </div>
                    </motion.div>

                    {/* Item 7: Minimalistic (Bottom Middle) */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => navigate(items[6].path)}
                        className="col-span-1 row-span-1 relative rounded-[32px] overflow-hidden group cursor-pointer shadow-md"
                    >
                        <img src={items[6].image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-6">
                            <span className="text-white font-bold text-xl tracking-wide">{items[6].title}</span>
                        </div>
                    </motion.div>

                    {/* Item 8: Date Nights (Bottom Right) */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => navigate(items[7].path)}
                        className="col-span-1 row-span-1 relative rounded-[32px] overflow-hidden group cursor-pointer shadow-md"
                    >
                        <img src={items[7].image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-6">
                            <span className="text-white font-bold text-xl tracking-wide">{items[7].title}</span>
                        </div>
                    </motion.div>

                </div>

                {/* Mobile Scrollable View */}
                <div className="md:hidden flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-4 h-[350px] px-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            className="min-w-[240px] h-full relative rounded-[24px] overflow-hidden shrink-0 shadow-md"
                        >
                            <img src={item.image} className="w-full h-full object-cover" alt="" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-6">
                                <span className="text-white font-bold text-lg">{item.title}</span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default GoldLifestyleGrid;
