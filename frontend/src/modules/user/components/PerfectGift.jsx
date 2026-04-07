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

                {/* Seamless Card Grid matching reference but elevated */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6 max-w-[1500px] mx-auto px-2 md:px-4">
                    {displayItems.slice(0, 6).map((item, index) => {
                        const itemLabel = item.name || item.label;
                        const itemPath = item.path || '/shop';

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ 
                                    duration: 0.8, 
                                    delay: index * 0.1,
                                    ease: [0.16, 1, 0.3, 1]
                                }}
                            >
                                <Link to={itemPath} className="group relative block w-full h-full">
                                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl md:rounded-[24px] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.02)] group-hover:shadow-[0_15px_40px_rgba(74,16,21,0.12)] transition-all duration-700 border border-black/5">
                                        
                                        {/* Image */}
                                        <img
                                            src={item.image}
                                            alt={itemLabel}
                                            className="w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105"
                                        />

                                        {/* Premium subtle inner shadow */}
                                        <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.05)] pointer-events-none" />

                                        {/* Bottom White Dock - Giva Style but vastly superior */}
                                        <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md z-20 h-14 md:h-16 flex flex-col items-center justify-center transition-all duration-500 overflow-hidden group-hover:bg-white shadow-[0_-5px_20px_rgba(0,0,0,0.03)] border-t border-white/50">
                                            
                                            <h3 className="font-sans text-[15px] md:text-[18px] font-semibold text-[#111111] tracking-wide transition-transform duration-500 transform group-hover:translate-y-[-4px]">
                                                {itemLabel}
                                            </h3>
                                            
                                            {/* Golden accent bar that expands on hover */}
                                            <div className="absolute bottom-3 md:bottom-[14px]">
                                                <div className="h-[2px] w-0 bg-[#C9A24D] opacity-0 group-hover:w-8 group-hover:opacity-100 transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]" />
                                            </div>

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

export default PerfectGift;
