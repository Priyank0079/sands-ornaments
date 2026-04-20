import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { resolveLegacyCmsAsset } from '../../utils/legacyCmsAssets';

import card2999 from '@assets/family_price_2999_clean.jpg';
import cardPremium from '@assets/family_price_premium_clean.jpg';
import card4999 from '@assets/family_price_4999_clean.jpg';

const fallbackPricePoints = [
    {
        id: 'under-2999',
        title: 'Under Rs 2999',
        caption: 'Keepsake rings and petite gifting picks.',
        image: card2999,
        priceMax: 2999,
        link: '/shop?source=family&filter=family&price_max=2999',
        accent: 'Rose Pick',
        ctaLabel: 'Explore Edit',
        delay: 0.05
    },
    {
        id: 'premium-gifts',
        title: 'Premium Gifts',
        caption: 'Layered necklaces and heirloom-style favourites.',
        image: cardPremium,
        priceMax: 3999,
        link: '/shop?source=family&filter=family&price_max=3999',
        accent: 'Most Loved',
        ctaLabel: 'Explore Edit',
        featured: true,
        delay: 0.15
    },
    {
        id: 'under-4999',
        title: 'Under Rs 4999',
        caption: 'Statement bracelets for elegant family moments.',
        image: card4999,
        priceMax: 4999,
        link: '/shop?source=family&filter=family&price_max=4999',
        accent: 'Easy Upgrade',
        ctaLabel: 'Explore Edit',
        delay: 0.25
    }
];

const parsePriceValue = (value) => {
    if (value === undefined || value === null) return null;
    const cleaned = String(value).replace(/[^0-9]/g, '');
    if (!cleaned) return null;
    const numeric = Number(cleaned);
    return Number.isFinite(numeric) ? numeric : null;
};

const getPriceMaxFromItem = (item) => {
    if (!item) return null;
    const direct = parsePriceValue(item.priceMax ?? item.price);
    if (direct) return direct;
    const path = String(item.path || '');
    if (path.includes('price_max=')) {
        const queryValue = path.split('price_max=')[1]?.split('&')[0];
        return parsePriceValue(queryValue);
    }
    return null;
};

const formatPriceTitle = (priceMax) => `Under Rs ${priceMax}`;

const buildFamilyPricePath = (priceMax) => (
    priceMax ? `/shop?source=family&filter=family&price_max=${priceMax}` : '/shop?source=family&filter=family'
);

const FamilyPricePoints = ({ sectionData }) => {
    const sectionTitle = String(sectionData?.settings?.title || 'Family Gift Picks').trim() || 'Family Gift Picks';
    const sectionAccent = String(sectionData?.settings?.eyebrow || 'Luxury Within Reach').trim() || 'Luxury Within Reach';
    const points = useMemo(() => {
        const configuredItems = Array.isArray(sectionData?.items) ? sectionData.items : [];
        const normalized = configuredItems
            .map((item, index) => {
                const fallback = fallbackPricePoints[index % fallbackPricePoints.length];
                const priceMax = getPriceMaxFromItem(item) || fallback.priceMax;
                return {
                    id: item.itemId || item.id || `family-price-${index + 1}`,
                    title: String(item.name || item.label || (priceMax ? formatPriceTitle(priceMax) : fallback.title)).trim() || fallback.title,
                    caption: String(item.subtitle || item.description || fallback.caption).trim() || fallback.caption,
                    image: resolveLegacyCmsAsset(item.image, fallback.image),
                    priceMax,
                    link: item.path || buildFamilyPricePath(priceMax),
                    accent: String(item.tag || fallback.accent).trim() || fallback.accent,
                    ctaLabel: String(item.ctaLabel || fallback.ctaLabel).trim() || fallback.ctaLabel,
                    delay: fallback.delay
                };
            })
            .filter((item) => Boolean(item.title) && Boolean(item.caption) && Boolean(item.image) && Boolean(item.link));

        return normalized.length > 0 ? normalized : fallbackPricePoints;
    }, [sectionData]);

    return (
        <section className="bg-[linear-gradient(180deg,#fff_0%,#fff8fa_48%,#fff_100%)] py-6 md:py-8">
            <div className="container mx-auto px-4 md:px-12">
                <div className="mx-auto max-w-4xl rounded-[28px] border border-[#f4d5dc] bg-white/95 px-4 py-5 shadow-[0_18px_50px_rgba(142,43,69,0.07)] md:px-6 md:py-6">
                    <div className="mb-4 text-center md:mb-6">
                        <span className="inline-flex items-center rounded-full border border-[#f1c7d2] bg-[#fff3f6] px-3 py-1 text-[9px] font-black uppercase tracking-[0.32em] text-[#8E2B45]">
                            {sectionAccent}
                        </span>
                        <h2 className="mt-2 font-serif text-xl tracking-tight text-[#2D060F] md:text-3xl">
                            {sectionTitle}
                        </h2>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3 md:items-start">
                        {points.map((point) => (
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
                                            className="w-full rounded-[18px] object-cover object-top transition-transform duration-500 group-hover:scale-[1.02] aspect-[1.15]"
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
                                            {point.ctaLabel || 'Explore Edit'}
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

