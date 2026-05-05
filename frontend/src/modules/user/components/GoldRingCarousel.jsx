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
        <section className="w-full py-12 bg-white">
            <div className="max-w-[1450px] mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-serif text-[#142E1F] italic mb-4">
                        {title}
                    </h2>
                    <div className="h-[1px] w-24 bg-[#D4B390] mx-auto opacity-50" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                    {ringTypes.map((type) => (
                        <motion.div
                            key={type.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            onClick={() => navigate(type.path)}
                            className="bg-white border border-gray-100 rounded-lg overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-all duration-500 flex flex-col h-full p-3"
                        >
                            {/* Image Container - Square and clean */}
                            <div className="relative w-full aspect-square overflow-hidden bg-[#F8F8F8] rounded-md">
                                <img
                                    src={type.image}
                                    alt={type.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                            </div>

                            {/* Button Style Label - Centered and padded */}
                            <div className="mt-4 mb-1 px-2">
                                <div className="w-full py-2.5 bg-[#142E1F] text-center rounded-sm transition-all duration-300 group-hover:bg-[#1A3D29] group-hover:shadow-md">
                                    <span className="text-[10px] md:text-[11px] font-bold text-white uppercase tracking-[0.15em]">
                                        {type.name}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 flex justify-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(ctaPath)}
                        className="bg-[#142E1F] text-white font-bold text-[13px] md:text-[15px] px-12 py-3.5 rounded-full hover:bg-[#1A3D29] transition-all duration-300 shadow-lg tracking-widest uppercase"
                        type="button"
                    >
                        {ctaLabel}
                    </motion.button>
                </div>
            </div>
        </section>
    );
};

export default GoldRingCarousel;
