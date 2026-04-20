import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { resolveLegacyCmsAsset } from '../utils/legacyCmsAssets';

import casualImg from '@assets/lifestyle_casual.png';
import partyImg from '@assets/lifestyle_party.png';
import traditionalImg from '@assets/lifestyle_traditional.png';
import minimalisticImg from '@assets/lifestyle_minimalistic.png';
import twinningImg from '@assets/lifestyle_twinning.png';
import dateNightImg from '@assets/lifestyle_date_night.png';
import giftCardImg from '@assets/lifestyle_gift_card.png';

const fallbackItems = [
    { id: 1, title: 'Casual Wear', image: casualImg, path: '/shop?occasion=casual&metal=gold' },
    { id: 2, title: 'Party Wear', image: partyImg, path: '/shop?occasion=party&metal=gold' },
    { id: 3, title: 'Gold Gift Card', image: giftCardImg, path: '/help' },
    { id: 4, title: 'Twinning', image: twinningImg, path: '/shop?search=twinning&metal=gold' },
    { id: 5, title: 'Traditional', image: traditionalImg, path: '/shop?occasion=traditional&metal=gold' },
    { id: 6, title: 'Traditional', image: traditionalImg, path: '/shop?occasion=traditional&metal=gold' },
    { id: 7, title: 'Minimalistic', image: minimalisticImg, path: '/shop?search=minimalistic&metal=gold' },
    { id: 8, title: 'Date Nights', image: dateNightImg, path: '/shop?occasion=date-night&metal=gold' }
];

const GoldLifestyleGrid = ({ sectionData = null }) => {
    const navigate = useNavigate();

    const items = useMemo(() => {
        const configured = Array.isArray(sectionData?.items) ? sectionData.items : [];
        if (configured.length === 0) return fallbackItems;

        const mapped = configured.map((item, idx) => ({
            id: item?.itemId || item?.id || `gold-lifestyle-${idx + 1}`,
            title: item?.name || item?.label || fallbackItems[idx % fallbackItems.length].title,
            image: resolveLegacyCmsAsset(item?.image, fallbackItems[idx % fallbackItems.length].image),
            path: item?.path || fallbackItems[idx % fallbackItems.length].path
        }));

        if (mapped.length >= 8) return mapped.slice(0, 8);
        const combined = [...mapped];
        while (combined.length < 8) {
            combined.push(fallbackItems[combined.length]);
        }
        return combined;
    }, [sectionData]);

    return (
        <section className="w-full py-16 bg-white">
            <div className="max-w-[1450px] mx-auto px-4 md:px-6">
                <div className="hidden md:grid grid-cols-5 grid-rows-2 gap-4 h-[600px]">
                    <motion.div whileHover={{ scale: 1.02 }} onClick={() => navigate(items[0].path)} className="col-span-1 row-span-1 relative rounded-[32px] overflow-hidden group cursor-pointer shadow-md">
                        <img src={items[0].image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={items[0].title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-6"><span className="text-white font-bold text-xl tracking-wide">{items[0].title}</span></div>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} onClick={() => navigate(items[1].path)} className="col-span-1 row-span-2 relative rounded-[32px] overflow-hidden group cursor-pointer shadow-md">
                        <img src={items[1].image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={items[1].title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-8 text-center px-4"><span className="text-white font-bold text-2xl tracking-wide leading-tight">{items[1].title}</span></div>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} onClick={() => navigate(items[2].path)} className="col-span-1 row-span-1 relative rounded-[32px] overflow-hidden group cursor-pointer shadow-md">
                        <img src={items[2].image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={items[2].title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-6"><span className="text-white font-bold text-xl tracking-wide">{items[2].title}</span></div>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} onClick={() => navigate(items[3].path)} className="col-span-1 row-span-2 relative rounded-[32px] overflow-hidden group cursor-pointer shadow-md">
                        <img src={items[3].image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={items[3].title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-8"><span className="text-white font-bold text-2xl tracking-wide">{items[3].title}</span></div>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} onClick={() => navigate(items[4].path)} className="col-span-1 row-span-1 relative rounded-[32px] overflow-hidden group cursor-pointer shadow-md">
                        <img src={items[4].image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={items[4].title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-6"><span className="text-white font-bold text-xl tracking-wide">{items[4].title}</span></div>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} onClick={() => navigate(items[5].path)} className="col-span-1 row-span-1 relative rounded-[32px] overflow-hidden group cursor-pointer shadow-md">
                        <img src={items[5].image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={items[5].title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-6"><span className="text-white font-bold text-xl tracking-wide">{items[5].title}</span></div>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} onClick={() => navigate(items[6].path)} className="col-span-1 row-span-1 relative rounded-[32px] overflow-hidden group cursor-pointer shadow-md">
                        <img src={items[6].image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={items[6].title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-6"><span className="text-white font-bold text-xl tracking-wide">{items[6].title}</span></div>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} onClick={() => navigate(items[7].path)} className="col-span-1 row-span-1 relative rounded-[32px] overflow-hidden group cursor-pointer shadow-md">
                        <img src={items[7].image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={items[7].title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-6"><span className="text-white font-bold text-xl tracking-wide">{items[7].title}</span></div>
                    </motion.div>
                </div>

                <div className="md:hidden flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-4 h-[350px] px-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            className="min-w-[240px] h-full relative rounded-[24px] overflow-hidden shrink-0 shadow-md"
                        >
                            <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
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
