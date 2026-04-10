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
        <section className="py-12 md:py-16 bg-[#FAFAFA] overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                
                {/* Clean Professional Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="font-sans text-3xl md:text-4xl text-[#111111] font-semibold mb-4 tracking-wide uppercase">
                        {sectionData?.label || "Curated Selection"}
                    </h2>
                    <div className="w-16 h-1 bg-[#FFD6DB] mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-[1400px] mx-auto">
                    {displayItems.map((item, index) => {
                        const priceMax = getPriceMaxFromItem(item);
                        const itemLabel = priceMax ? `UNDER INR ${priceMax}` : (item.name || item.label || '');
                        const itemPath = priceMax ? `/shop?price_max=${priceMax}` : item.path;
                        const key = item.itemId || item._id || item.id || itemLabel || index;

                        return (
                            <motion.div
                                key={key}
                                className="w-full h-full"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Link
                                    to={itemPath || '/shop'}
                                    className="group flex flex-col h-full bg-white rounded-md border border-gray-100/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                                >
                                    {/* Image Section - Match 2nd image proportion */}
                                    <div className="relative w-full aspect-[4/5] bg-[#F5F5F5] overflow-hidden">
                                        <img
                                            src={resolveLegacyCmsAsset(item.image, price999)}
                                            alt={itemLabel}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>

                                    {/* Clean Text Content matching the screenshot layout */}
                                    <div className="p-4 md:p-5 flex flex-col flex-grow justify-between bg-white text-left">
                                        
                                        <div className="mb-4">
                                            <h3 className="text-[#1A1A1A] font-sans font-bold text-lg md:text-xl tracking-wide">
                                                {itemLabel}
                                            </h3>
                                            <p className="text-[#6D6D6D] text-xs md:text-sm mt-1 font-medium">
                                                Discover the collection
                                            </p>
                                        </div>

                                        {/* Pink Action Button at the absolute bottom */}
                                        <div className="mt-auto w-full bg-[#FFD6DB] text-[#222222] font-semibold text-sm md:text-base text-center py-3 rounded-sm group-hover:bg-[#FFC2C9] transition-colors duration-300">
                                            Shop Now
                                        </div>
                                    </div>
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
