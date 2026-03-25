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
        <section className="pt-2 pb-16 md:pt-10 md:pb-24 bg-white">
            <div className="container mx-auto px-2 md:px-4">
                <div className="text-center mb-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-5xl font-display font-medium text-black mb-4"
                    >
                        {sectionData?.label || "Luxury in Range"}
                    </motion.h2>
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: 80 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="h-1 bg-[#C9A24D] mx-auto rounded-full"
                    ></motion.div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Link
                                    to={itemPath || '/shop'}
                                    className="group relative block w-full aspect-[3/4] md:aspect-[3/4] lg:aspect-[4/3] rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-md md:shadow-lg hover:shadow-[0_20px_50px_rgba(74,16,21,0.3)] transition-all duration-500 border-[3px] border-transparent hover:border-[#4A1015]"
                                >
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500 z-10" />

                                    <img
                                        src={resolveLegacyCmsAsset(item.image, price999)}
                                        alt={itemLabel}
                                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                    />

                                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20 bg-gradient-to-t from-black/80 to-transparent">
                                        <h3 className="text-xl md:text-3xl font-display font-bold text-white text-center drop-shadow-md">
                                            <span className="text-xs md:text-base font-light block mb-0.5 md:mb-1 opacity-90">Shop</span>
                                            {itemLabel}
                                        </h3>
                                        <div className="h-0.5 w-0 group-hover:w-1/2 bg-[#C9A24D] mx-auto mt-2 transition-all duration-500 rounded-full" />
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
