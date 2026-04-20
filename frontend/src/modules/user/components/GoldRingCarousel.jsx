import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { resolveLegacyCmsAsset } from '../utils/legacyCmsAssets';

import ringGreen from '@assets/categories/gold_rings_green.png';

const fallbackRingTypes = [
    { id: 1, name: 'Solitaire Ring', image: ringGreen, path: '/shop?category=Rings&search=solitaire' },
    { id: 2, name: 'Promise Ring', image: ringGreen, path: '/shop?category=Rings&search=promise' },
    { id: 3, name: '9kt Ring', image: ringGreen, path: '/shop?category=Rings&search=9kt' },
    { id: 4, name: 'Vanki Ring', image: ringGreen, path: '/shop?category=Rings&search=vanki' },
    { id: 5, name: 'Rose Gold Ring', image: ringGreen, path: '/shop?category=Rings&search=rose-gold' },
    { id: 6, name: 'Classic Ring', image: ringGreen, path: '/shop?category=Rings&search=classic' },
];

const ensureGoldPath = (rawPath = '', categoryId = '') => {
    const normalizedCategoryId = String(categoryId || '').trim();
    if (normalizedCategoryId) return `/shop?metal=gold&category=${encodeURIComponent(normalizedCategoryId)}`;

    const source = String(rawPath || '').trim();
    if (!source) return '/shop?metal=gold';
    if (!source.startsWith('/shop')) return source;
    if (/([?&])metal=gold(&|$)/i.test(source)) return source;
    return `${source}${source.includes('?') ? '&' : '?'}metal=gold`;
};

const GoldRingCarousel = ({ sectionData = null }) => {
    const navigate = useNavigate();

    const ringTypes = useMemo(() => {
        const configured = Array.isArray(sectionData?.items) ? sectionData.items : [];
        if (configured.length === 0) return fallbackRingTypes;

        return configured.map((item, idx) => ({
            id: item?.itemId || item?.id || `gold-ring-${idx + 1}`,
            name: item?.name || item?.label || fallbackRingTypes[idx % fallbackRingTypes.length].name,
            image: resolveLegacyCmsAsset(item?.image, fallbackRingTypes[idx % fallbackRingTypes.length].image),
            path: ensureGoldPath(item?.path || fallbackRingTypes[idx % fallbackRingTypes.length].path, item?.categoryId)
        }));
    }, [sectionData]);

    const title = String(sectionData?.settings?.title || sectionData?.label || 'Get The Right Ring').trim() || 'Get The Right Ring';
    const ctaLabel = String(sectionData?.settings?.ctaLabel || 'View All Rings').trim() || 'View All Rings';
    const ctaPath = ensureGoldPath(String(sectionData?.settings?.ctaPath || '/shop?metal=gold&category=rings').trim() || '/shop?metal=gold&category=rings');

    return (
        <section className="w-full py-10 bg-white">
            <div className="max-w-[1450px] mx-auto px-4">
                <div className="bg-[#FAF9F0] rounded-[24px] p-8 md:p-10 text-center shadow-sm">
                    <div className="mb-8">
                        <h2 className="text-[24px] md:text-[32px] text-[#2A4D35] font-serif font-medium tracking-tight italic mb-3">
                            {title}
                        </h2>
                        <div className="h-px w-20 bg-[#D4B390]/50 mx-auto" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 mb-10 mt-12">
                        {ringTypes.map((type) => (
                            <div
                                key={type.id}
                                onClick={() => navigate(type.path)}
                                className="flex flex-col items-center group cursor-pointer"
                            >
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="w-[120px] h-[120px] md:w-[160px] md:h-[160px] rounded-full overflow-hidden mb-4 bg-[#142E1F] relative shadow-lg border-2 border-white group-hover:border-[#D4B390]/30 transition-all"
                                >
                                    <img
                                        src={type.image}
                                        alt={type.name}
                                        className="w-full h-full object-cover p-1 scale-110"
                                    />
                                    <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.5)] rounded-full" />
                                </motion.div>
                                <span className="text-[14px] md:text-[16px] font-bold text-gray-900 tracking-tight leading-tight group-hover:text-[#2A4D35] transition-colors">
                                    {type.name}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={() => navigate(ctaPath)}
                            className="bg-gradient-to-b from-[#F5ECD7] to-[#E8D8A0] border border-[#D4B390] text-[#142E1F] font-black text-[14px] md:text-[16px] px-10 py-3 rounded-xl hover:brightness-105 transition-all duration-300 shadow-md"
                            type="button"
                        >
                            {ctaLabel}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GoldRingCarousel;
