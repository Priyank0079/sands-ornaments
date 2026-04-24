import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { resolveLegacyCmsAsset } from '../utils/legacyCmsAssets';

import solitaireImg from '@assets/categories/gold_rings_green.png';
import statementImg from '@assets/categories/gold_sets_green.png';

const fallbackCards = [
    {
        id: 'gold-exclusive-1',
        title: 'SOULitaire',
        subtitle: 'Solitaire Collection',
        image: solitaireImg,
        path: '/shop?search=solitaire&metal=gold'
    },
    {
        id: 'gold-exclusive-2',
        title: 'Beyond Bold',
        subtitle: 'Statement Collection',
        image: statementImg,
        path: '/shop?search=statement&metal=gold'
    }
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

const GoldExclusiveLaunch = ({ sectionData = null }) => {
    const navigate = useNavigate();

    const cards = useMemo(() => {
        const configured = Array.isArray(sectionData?.items) ? sectionData.items : [];
        if (configured.length === 0) return fallbackCards;

        return configured.slice(0, 2).map((item, idx) => ({
            id: item?.itemId || item?.id || `gold-exclusive-${idx + 1}`,
            title: item?.name || item?.label || fallbackCards[idx % fallbackCards.length].title,
            subtitle: item?.subtitle || item?.description || fallbackCards[idx % fallbackCards.length].subtitle,
            image: resolveLegacyCmsAsset(item?.image, fallbackCards[idx % fallbackCards.length].image),
            path: ensureGoldPath(item?.path || fallbackCards[idx % fallbackCards.length].path, item?.categoryId)
        }));
    }, [sectionData]);

    const heading = String(sectionData?.settings?.title || sectionData?.label || 'Exclusive Collection Launch').trim() || 'Exclusive Collection Launch';
    const ctaPath = ensureGoldPath(String(sectionData?.settings?.ctaPath || '/shop?new_arrival=true&metal=gold').trim() || '/shop?new_arrival=true&metal=gold');

    return (
        <section className="w-full py-10 bg-white overflow-hidden">
            <div className="max-w-[1450px] mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12">
                    <div className="lg:w-[180px] flex flex-col items-start shrink-0">
                        <h2 className="text-[26px] md:text-[32px] font-medium leading-[1.1] text-[#1A1A1A] tracking-tight mb-6 font-body">
                            {heading}
                        </h2>
                        <button
                            className="group cursor-pointer"
                            onClick={() => navigate(ctaPath)}
                            type="button"
                        >
                            <div className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-full group-hover:border-black group-hover:bg-black transition-all duration-500">
                                <ArrowRight className="w-5 h-5 text-gray-900 group-hover:text-white transition-colors duration-500" />
                            </div>
                        </button>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        {cards.map((card, idx) => (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: idx * 0.1, ease: 'easeOut' }}
                                onClick={() => navigate(card.path)}
                                className="relative h-[180px] md:h-[260px] rounded-[24px] overflow-hidden group cursor-pointer shadow-xl"
                            >
                                <div className="absolute inset-0 bg-[#0D2015]">
                                    <img
                                        src={card.image}
                                        alt={card.title}
                                        className="w-full h-full object-cover scale-[1.02] group-hover:scale-105 transition-transform duration-1000 ease-out p-3"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent opacity-50" />
                                </div>

                                <div className="relative h-full p-6 md:p-8 flex flex-col justify-start z-10">
                                    <h3 className="text-white text-[22px] md:text-[30px] font-black leading-none mb-1 tracking-tighter uppercase font-body">
                                        {card.title}
                                    </h3>
                                    <p className="text-white/80 text-[12px] md:text-[14px] font-medium tracking-wide font-body">
                                        {card.subtitle}
                                    </p>
                                </div>

                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GoldExclusiveLaunch;
