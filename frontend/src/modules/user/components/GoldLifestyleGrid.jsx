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

const ensureGoldCategoryPath = (path, categoryId = '') => {
    const normalizedCategory = String(categoryId || '').trim();
    const source = String(path || '').trim();
    const queryString = source.startsWith('/shop') && source.includes('?') ? source.split('?')[1] : '';
    const params = new URLSearchParams(queryString);
    params.set('metal', 'gold');
    if (normalizedCategory) params.set('category', normalizedCategory);
    const query = params.toString();
    return `/shop${query ? `?${query}` : '?metal=gold'}`;
};

const desktopSlotClasses = [
    'col-span-1 row-span-1',
    'col-span-1 row-span-2',
    'col-span-1 row-span-1',
    'col-span-1 row-span-2',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1'
];

const GoldLifestyleGrid = ({ sectionData = null }) => {
    const navigate = useNavigate();

    const items = useMemo(() => {
        const configured = Array.isArray(sectionData?.items) ? sectionData.items : [];
        if (configured.length === 0) return fallbackItems;

        return configured.slice(0, 8).map((item, idx) => ({
            id: item?.itemId || item?.id || `gold-lifestyle-${idx + 1}`,
            title: item?.name || item?.label || fallbackItems[idx % fallbackItems.length].title,
            image: resolveLegacyCmsAsset(item?.image, fallbackItems[idx % fallbackItems.length].image),
            path: ensureGoldCategoryPath(
                item?.path || fallbackItems[idx % fallbackItems.length].path,
                item?.categoryId
            )
        }));
    }, [sectionData]);

    return (
        <section className="w-full py-16 bg-white">
            <div className="max-w-[1450px] mx-auto px-4 md:px-6">
                <div className="hidden md:grid grid-cols-5 grid-rows-2 gap-4 h-[600px]">
                    {items.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => navigate(item.path)}
                            className={`${desktopSlotClasses[idx] || 'col-span-1 row-span-1'} relative rounded-[32px] overflow-hidden group cursor-pointer shadow-md`}
                        >
                            <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center ${idx === 1 || idx === 3 ? 'pb-8' : 'pb-6'} ${idx === 1 ? 'text-center px-4' : ''}`}>
                                <span className={`text-white font-bold tracking-wide ${idx === 1 || idx === 3 ? 'text-2xl leading-tight' : 'text-xl'}`}>
                                    {item.title}
                                </span>
                            </div>
                        </motion.div>
                    ))}
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
