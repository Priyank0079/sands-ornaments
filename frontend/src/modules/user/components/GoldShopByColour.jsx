import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { resolveLegacyCmsAsset } from '../utils/legacyCmsAssets';

import yellowImg from '@assets/gold_color_yellow.png';
import roseImg from '@assets/gold_color_rose.png';
import whiteImg from '@assets/gold_color_white.png';
import dualImg from '@assets/gold_color_dual.png';

const fallbackColors = [
    { id: 'yellow', name: 'Yellow Gold', image: yellowImg, path: '/shop?metal=gold&search=Yellow Gold', gradient: 'bg-gradient-to-tr from-[#DEB36D] to-[#F7E2AF]' },
    { id: 'rose', name: 'Rose Gold', image: roseImg, path: '/shop?metal=gold&search=Rose Gold', gradient: 'bg-gradient-to-tr from-[#E6A0A0] to-[#FAD4D4]' },
    { id: 'white', name: 'White Gold', image: whiteImg, path: '/shop?metal=gold&search=White Gold', gradient: 'bg-gradient-to-tr from-[#C0C0C0] to-[#E8E8E8]' },
    { id: 'dual', name: 'Dual tone Gold', image: dualImg, path: '/shop?metal=gold&search=Dual tone Gold', gradient: 'bg-gradient-to-tr from-[#E8C59A] via-[#E8E8E8] to-[#E6A0A0]' },
];

const ensureGoldCategoryPath = (rawPath, categoryId = '') => {
    const source = String(rawPath || '/shop').trim();
    const queryString = source.startsWith('/shop') && source.includes('?') ? source.split('?')[1] : '';
    const params = new URLSearchParams(queryString);
    params.set('metal', 'gold');
    const normalizedCategoryId = String(categoryId || '').trim();
    if (normalizedCategoryId) params.set('category', normalizedCategoryId);
    const query = params.toString();
    return `/shop${query ? `?${query}` : '?metal=gold'}`;
};

const GoldShopByColour = ({ sectionData = null }) => {
    const navigate = useNavigate();

    const colors = useMemo(() => {
        const configured = Array.isArray(sectionData?.items) ? sectionData.items : [];
        if (configured.length === 0) return fallbackColors;

        return configured.map((item, idx) => ({
            id: item?.itemId || item?.id || `gold-colour-${idx + 1}`,
            name: item?.name || item?.label || fallbackColors[idx % fallbackColors.length].name,
            image: resolveLegacyCmsAsset(item?.image, fallbackColors[idx % fallbackColors.length].image),
            path: ensureGoldCategoryPath(item?.path || fallbackColors[idx % fallbackColors.length].path, item?.categoryId || ''),
            gradient: fallbackColors[idx % fallbackColors.length].gradient,
        }));
    }, [sectionData]);

    const title = String(sectionData?.settings?.title || sectionData?.label || 'Shop by Colour').trim() || 'Shop by Colour';

    return (
        <section className="w-full py-6 bg-white overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="text-center mb-6">
                    <h2 className="text-xl md:text-2xl font-serif text-black">{title}</h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
                    {colors.map((color, idx) => (
                        <motion.div
                            key={color.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            onClick={() => navigate(color.path)}
                            className="group cursor-pointer flex flex-col items-center"
                        >
                            <div className="relative w-full aspect-square rounded-[20px] overflow-hidden shadow-sm border border-gray-100 mb-2 transition-transform duration-500 group-hover:-translate-y-1">
                                <img src={color.image} alt={color.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />

                                <div className={`absolute bottom-2 right-2 w-6 md:w-8 h-6 md:h-8 rounded-full border-2 border-white shadow-md ${color.gradient}`} />

                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <h3 className="text-gray-900 font-bold text-[13px] md:text-[14px] tracking-tight">{color.name}</h3>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GoldShopByColour;
