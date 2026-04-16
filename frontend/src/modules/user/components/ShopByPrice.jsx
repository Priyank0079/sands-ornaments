import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';

const FALLBACK_PRICE_POINTS = [
    {
        id: '1499',
        priceMax: 1499,
        label: 'Under',
        path: '/shop?price_max=1499'
    },
    {
        id: '1999',
        priceMax: 1999,
        label: 'Under',
        path: '/shop?price_max=1999'
    }
];

const ShopByPrice = () => {
    const navigate = useNavigate();
    const { homepageSections } = useShop();
    const sectionData = homepageSections?.['luxury-within-reach'];

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
            return parsePriceValue(query);
        }
        if (item.name) {
            return parsePriceValue(item.name);
        }
        return null;
    };

    const configuredItems = Array.isArray(sectionData?.items)
        ? sectionData.items
            .map((item, index) => {
                const priceMax = getPriceMaxFromItem(item);
                if (!priceMax) return null;
                return {
                    id: item.itemId || item._id || item.id || `${priceMax}-${index}`,
                    priceMax,
                    label: 'Under',
                    path: `/shop?price_max=${priceMax}`
                };
            })
            .filter(Boolean)
            .slice(0, 2)
        : [];

    const displayItems = configuredItems.length > 0 ? configuredItems : FALLBACK_PRICE_POINTS;

    return (
        <section className="py-6 md:py-12 bg-[#FEF6F7]">
            <div className="container mx-auto px-4 max-w-[1240px]">
                <div className="flex flex-col items-center mb-6 md:mb-10 group">
                    <span className="inline-block bg-[#8E2B45] text-white px-3 py-0.5 text-[8px] md:text-[10px] font-black tracking-[0.3em] uppercase mb-2 rounded-none shadow-sm group-hover:bg-[#AC3B61] transition-colors duration-500">
                        Budget Boutique
                    </span>
                    <h2 className="text-2xl md:text-5xl font-serif text-gray-950 tracking-tight leading-none">
                        Luxury <span className="italic font-light text-[#8E2B45]">within Reach</span>
                    </h2>
                    <div className="w-10 h-[1px] bg-[#8E2B45]/30 mt-3 md:mt-5" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-10 max-w-[900px] mx-auto">
                    {displayItems.map((item) => (
                        <motion.div
                            key={item.id}
                            whileHover={{
                                y: -6,
                                scale: 1.02,
                                transition: { duration: 0.3, ease: 'easeOut' }
                            }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(item.path)}
                            className="relative h-[100px] md:h-[160px] bg-gradient-to-br from-[#4A1015] via-[#540D1D] to-[#2D060F] rounded-[20px] md:rounded-[36px] cursor-pointer flex flex-col items-center justify-center text-white shadow-[0_15px_30px_rgba(74,16,21,0.12)] hover:shadow-[0_30px_60px_rgba(74,16,21,0.25)] overflow-hidden group border border-white/10"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

                            <span className="text-[9px] md:text-xs font-sans tracking-[0.35em] uppercase font-bold mb-0.5 relative z-10 text-[#FFD9E0]/80">
                                {item.label}
                            </span>
                            <div className="flex items-center gap-1.5 relative z-10">
                                <span className="text-3xl md:text-6xl font-serif font-medium tracking-tighter">
                                    {'\u20B9'}{item.priceMax}
                                </span>
                            </div>

                            <div className="absolute inset-0 bg-[#8E2B45]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ShopByPrice;
