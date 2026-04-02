import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useShop } from '../../../context/ShopContext';

// Import images
import giftMother from '../assets/gift_mother_silver.png';
import giftFriends from '../assets/gift_friends_silver.png';
import giftSister from '../assets/gift_sister_silver.png';
import giftHusband from '../assets/gift_husband_silver.png'; // Using as placeholder for Father
import giftWife from '../assets/gift_wife_silver.png'; // Re-use or use a general fallback
import giftBrother from '../assets/gift_brother_silver.png';
import dividerImg from '../assets/ornament-divider.png';
import { resolveLegacyCmsAsset } from '../utils/legacyCmsAssets';

const recipients = [
    { id: 'wife', name: "Wife", image: giftWife, path: "/shop" },
    { id: 'mother', name: "Mother", image: giftMother, path: "/shop" },
    { id: 'sister', name: "Sister", image: giftSister, path: "/shop" },
    { id: 'father', name: "Father", image: giftHusband, path: "/shop" },
    { id: 'husband', name: "Husband", image: giftHusband, path: "/shop" },
    { id: 'friends', name: "Friends", image: giftFriends, path: "/shop" }
];

const resolveGiftPath = (item, fallbackPath = '/shop') => {
    const productIds = Array.isArray(item?.productIds) ? item.productIds.filter(Boolean) : [];
    if (productIds.length > 0) {
        return `/shop?products=${encodeURIComponent(productIds.join(','))}`;
    }

    if (item?.path) return item.path;
    return fallbackPath;
};

const PerfectGift = () => {
    const { homepageSections } = useShop();

    const sectionData = homepageSections?.['perfect-gift'];
    const configuredItems = Array.isArray(sectionData?.items) ? sectionData.items : [];
    const normalizedConfiguredItems = configuredItems.map((item, index) => {
        return {
            ...item,
            id: item.itemId || item._id || item.id || `gift-${index}`,
            name: item.name || item.label || recipients[index]?.name || 'Gift',
            image: resolveLegacyCmsAsset(item.image, recipients[index]?.image || giftMother),
            path: resolveGiftPath(item, recipients[index]?.path || '/shop'),
            productIds: Array.isArray(item.productIds) ? item.productIds.filter(Boolean) : []
        };
    });
    const displayItems = normalizedConfiguredItems.length > 0 ? normalizedConfiguredItems : recipients;

    return (
        <section className="py-16 md:py-24 bg-white text-black overflow-hidden relative">
            {/* Subtle Texture or Sparkle Overlay if needed, but keeping it clean for now */}
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 40, letterSpacing: "0.1em" }}
                        whileInView={{ opacity: 1, y: 0, letterSpacing: "0.02em" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-3xl md:text-6xl font-display font-medium text-[#4A1015] mb-4"
                    >
                        {sectionData?.label || "Find the Perfect Gift For"}
                    </motion.h2>
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: 80 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="h-0.5 bg-[#C9A24D] mx-auto rounded-full"
                    ></motion.div>
                </div>

                {/* 3-Column Clean Grid Layout for all 6 categories */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 max-w-[1050px] mx-auto mb-10 px-4">
                    {displayItems.slice(0, 6).map((item, index) => {
                        const itemLabel = item.name || item.label;
                        const itemPath = item.path || '/shop';

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ 
                                    duration: 0.8, 
                                    delay: index * 0.1,
                                    ease: [0.16, 1, 0.3, 1] 
                                }}
                                className="w-full h-full"
                            >
                                <Link
                                    to={itemPath}
                                    className="group relative block w-full aspect-[16/11] md:aspect-[1.5] rounded-xl md:rounded-2xl overflow-hidden shadow-sm border border-gray-100"
                                >
                                    {/* Product Image Filler */}
                                    <div className="absolute inset-0">
                                        <img
                                            src={item.image}
                                            alt={itemLabel}
                                            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
                                        />
                                        
                                        {/* Multi-layer Premium Gradient Overlay */}
                                        <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-[#4A1015]/90 via-[#4A1015]/30 to-transparent opacity-95 transition-opacity duration-700 group-hover:opacity-100" />
                                    </div>

                                    {/* GSAP-Style Floating Typography */}
                                    <div className="absolute bottom-6 md:bottom-10 inset-x-0 text-center z-10 px-4 transition-transform duration-500 group-hover:-translate-y-2">
                                        <h3 className="font-serif text-2xl md:text-5xl text-white font-medium drop-shadow-2xl tracking-wide lowercase first-letter:uppercase">
                                            {itemLabel}
                                        </h3>
                                        <div className="w-0 group-hover:w-16 h-0.5 bg-white/60 mx-auto mt-4 transition-all duration-700 rounded-full" />
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

export default PerfectGift;
