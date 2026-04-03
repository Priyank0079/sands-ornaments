import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useShop } from '../../../context/ShopContext';

// Import images
import price999 from '../assets/price_under_999.png';
import price1999 from '../assets/price_under_1999.png';
import price2999 from '../assets/price_under_2999.png';
import price3999 from '../assets/price_under_3999.png';
import { resolveLegacyCmsAsset } from '../utils/legacyCmsAssets';

const priceRanges = [
    { id: 'under-999', name: "Under INR 999", priceMax: 999, image: price999, path: "/shop?price_max=999" },
    { id: 'under-1999', name: "Under INR 1999", priceMax: 1999, image: price1999, path: "/shop?price_max=1999" },
    { id: 'under-2999', name: "Under INR 2999", priceMax: 2999, image: price2999, path: "/shop?price_max=2999" },
    { id: 'under-3999', name: "Under INR 3999", priceMax: 3999, image: price3999, path: "/shop?price_max=3999" }
];

const PriceRangeShowcase = () => {
    const { homepageSections } = useShop();

    const sectionData = homepageSections?.['price-range-showcase'];

    const parsePriceValue = (value) => {
        if (value === undefined || value === null) return null;
        const cleaned = String(value).replace(/[^0-9]/g, '');
        if (!cleaned) return null;
        const numeric = Number(cleaned);
        return Number.isFinite(numeric) ? numeric : null;
    };

    const getPriceMaxFromItem = (item) => {
        if (!item) return null;
        if (item.priceMax !== undefined && item.priceMax !== null && item.priceMax !== '') {
            return parsePriceValue(item.priceMax);
        }
        if (item.price !== undefined && item.price !== null && item.price !== '') {
            return parsePriceValue(item.price);
        }
        if (item.path && String(item.path).includes('price_max=')) {
            const query = item.path.split('price_max=')[1]?.split('&')[0];
            const parsed = parsePriceValue(query);
            if (parsed) return parsed;
        }
        if (item.name) {
            const parsed = parsePriceValue(item.name);
            if (parsed) return parsed;
        }
        return null;
    };

    const configuredItems = Array.isArray(sectionData?.items) ? sectionData.items : [];
    const normalizedConfiguredItems = configuredItems
        .map((item, index) => {
            const priceMax = getPriceMaxFromItem(item);
            if (!priceMax) return null;
            const itemLabel = item.name || item.label || `Under INR ${priceMax}`;
            return {
                ...item,
                id: item.itemId || item._id || item.id || `${priceMax}-${index}`,
                priceMax,
                name: itemLabel,
                image: resolveLegacyCmsAsset(item.image, price999),
                path: `/shop?price_max=${priceMax}`
            };
        })
        .filter(Boolean);

    const displayItems = normalizedConfiguredItems.length > 0 ? normalizedConfiguredItems : priceRanges;

    return (
        <section className="py-24 bg-[#EAC1C3] overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                
                {/* Sands Royal Style Header */}
                <div className="text-center mb-16 md:mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <span className="text-[#8E4A50] text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-4 block italic">Budget Friendly</span>
                    <h2 className="font-serif text-4xl md:text-6xl text-[#8E4A50] mb-6 leading-tight">
                        {sectionData?.label || "Luxury in Range"}
                    </h2>
                    <div className="w-16 h-px bg-[#8E4A50] mx-auto opacity-40"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 max-w-7xl mx-auto px-4">
                    {displayItems.map((item, index) => {
                        const priceMax = getPriceMaxFromItem(item);
                        const itemLabel = priceMax ? `UNDER INR ${priceMax}` : (item.name || item.label || '');
                        const itemPath = priceMax ? `/shop?price_max=${priceMax}` : item.path;
                        const key = item.itemId || item._id || item.id || itemLabel || index;

                        return (
                            <motion.div
                                key={key}
                                className="w-full"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                            >
                                <Link
                                    to={itemPath || '/shop'}
                                    className="group relative block w-full aspect-[4/5] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_15px_45px_rgba(142,74,80,0.12)] transition-all duration-700 border border-white/20 hover:border-[#8E4A50]"
                                >
                                    {/* Subtle Image Zoom */}
                                    <img
                                        src={resolveLegacyCmsAsset(item.image, price999)}
                                        alt={itemLabel}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />

                                    {/* Elegant Glassmorphic Bottom Overlay - Compact Height Refined */}
                                    <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 z-20 bg-gradient-to-t from-[#4A1015]/95 via-[#4A1015]/30 to-transparent backdrop-blur-[4px] transition-all duration-500 group-hover:bg-[#8E4A50]/90">
                                        <div className="flex flex-col items-center">
                                            <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-[#EAC1C3]/70 mb-1 block">Explore</span>
                                            <h3 className="text-lg md:text-2xl font-serif italic text-white text-center leading-tight">
                                                {itemLabel}
                                            </h3>
                                            {/* Subtitle / Tiny detail if needed - Keeping it minimal */}
                                            <div className="h-px bg-white/30 w-0 group-hover:w-12 transition-all duration-700 mt-2 mx-auto" />
                                        </div>
                                    </div>

                                    {/* Soft Dark Vignette Overlay */}
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500 z-10" />
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default PriceRangeShowcase;
