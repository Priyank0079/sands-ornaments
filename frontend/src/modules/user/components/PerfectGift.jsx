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
    { id: 'wife', name: "Wife", image: giftWife, path: "/shop", price: "€49.90" },
    { id: 'mother', name: "Mother", image: giftMother, path: "/shop", price: "€69.50" },
    { id: 'sister', name: "Sister", image: giftSister, path: "/shop", price: "€39.00" },
    { id: 'father', name: "Father", image: giftHusband, path: "/shop", price: "€55.00" },
    { id: 'husband', name: "Husband", image: giftHusband, path: "/shop", price: "€55.00" },
    { id: 'friends', name: "Friends", image: giftFriends, path: "/shop", price: "€34.90" }
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
            price: item.price || recipients[index]?.price || "€49.90",
            productIds: Array.isArray(item.productIds) ? item.productIds.filter(Boolean) : []
        };
    });
    const displayItems = normalizedConfiguredItems.length > 0 ? normalizedConfiguredItems : recipients;

    return (
        <section className="py-16 md:py-24 bg-[#FAF3F0] text-black overflow-hidden relative">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* High-End Ornamental Header */}
                <div className="text-center mb-16 relative">
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[#C9A24D] text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-4 block italic"
                    >
                        Curated Selection
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl md:text-7xl font-serif text-[#4A1015] mb-6 tracking-tight"
                    >
                        {sectionData?.label || "Find the Perfect Gift"}
                    </motion.h2>
                    
                    {/* Artistic Line Divider */}
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-[1px] w-8 md:w-16 bg-gradient-to-r from-transparent to-[#C9A24D] opacity-60" />
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C9A24D] shadow-[0_0_8px_#C9A24D]" />
                        <div className="h-[1px] w-8 md:w-16 bg-gradient-to-l from-transparent to-[#C9A24D] opacity-60" />
                    </div>
                </div>

                {/* Cinematic Single Row Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 lg:gap-8 max-w-[1500px] mx-auto px-4">
                    {displayItems.slice(0, 6).map((item, index) => {
                        const itemLabel = item.name || item.label;
                        const itemPath = item.path || '/shop';

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ 
                                    duration: 0.8, 
                                    delay: index * 0.1,
                                    ease: [0.16, 1, 0.3, 1]
                                }}
                                className="group relative"
                            >
                                <Link to={itemPath} className="block w-full">
                                    {/* Image Container - Square with Premium Interaction */}
                                    <div className="relative aspect-square overflow-hidden mb-6 bg-white transition-all duration-700 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.05)] group-hover:shadow-[0_25px_60px_rgba(201,162,77,0.15)] group-hover:scale-[1.02]">
                                        
                                        {/* Image Zoom */}
                                        <img
                                            src={item.image}
                                            alt={itemLabel}
                                            className="w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-110"
                                        />

                                        {/* Golden Border Inset Effect (appears on hover) */}
                                        <div className="absolute inset-0 border-[0px] group-hover:border-[10px] border-white/10 transition-all duration-700 pointer-events-none" />
                                        <div className="absolute inset-2 md:inset-4 border-[0.5px] border-white/0 group-hover:border-white/40 transition-all duration-700 pointer-events-none" />
                                        
                                        {/* Subtle Shine/Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                    </div>

                                    {/* Elegant Typography Section */}
                                    <div className="text-center flex flex-col items-center gap-1.5 cursor-pointer">
                                        <h3 className="font-serif text-[13px] md:text-[15px] font-medium text-[#4A1015]/80 tracking-[0.2em] group-hover:text-[#4A1015] transition-all duration-500 uppercase">
                                            {itemLabel}
                                        </h3>
                                        
                                        {/* Growing Animated Underline */}
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            whileInView={{ width: 0 }}
                                            whileHover={{ width: "60%" }}
                                            className="h-[1px] bg-[#C9A24D] transition-all duration-500 origin-center group-hover:w-16"
                                        />
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
