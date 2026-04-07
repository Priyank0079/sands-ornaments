import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';

// Import images
import latestRing from '../assets/latest_drop_ring.png';
import latestNecklace from '../assets/latest_drop_necklace.png';
import latestEarrings from '../assets/latest_drop_earrings.png';
import latestBracelet from '../assets/latest_drop_bracelet.png';
import { resolveLegacyCmsAsset } from '../utils/legacyCmsAssets';

const latestItems = [
    { id: '1', name: "Latest Rings", image: latestRing, path: "/shop?sort=latest", limit: 12 },
    { id: '2', name: "Latest Pendants", image: latestNecklace, path: "/shop?sort=latest", limit: 12 },
    { id: '3', name: "Latest Earrings", image: latestEarrings, path: "/shop?sort=latest", limit: 12 },
    { id: '4', name: "Latest Chains", image: latestBracelet, path: "/shop?sort=latest", limit: 12 }
];

const LatestDrop = () => {
    const { homepageSections, categories } = useShop();

    const sectionData = homepageSections?.['latest-drop'];
    const configuredItems = Array.isArray(sectionData?.items) ? sectionData.items : [];
    const normalizedConfiguredItems = configuredItems
        .map((item, index) => {
            const category = item.categoryId
                ? categories.find(c => String(c._id || c.id) === String(item.categoryId))
                : null;
            const limit = Number(item.limit) || 0;
            if (!category || limit <= 0) {
                if (!item.path) return null;
                return {
                    ...item,
                    id: item.itemId || item._id || item.id || `legacy-${index}`,
                    name: item.name || item.label || 'Latest Drop',
                    image: resolveLegacyCmsAsset(item.image, latestRing),
                    limit: Number(item.limit) || 12,
                    path: item.path
                };
            }
            return {
                ...item,
                id: item.itemId || item._id || item.id || `${category._id || category.id}-${index}`,
                name: item.name || item.label || category.name,
                image: resolveLegacyCmsAsset(item.image, latestRing),
                limit,
                path: `/shop?category=${category._id || category.id}&limit=${limit}&sort=latest`
            };
        })
        .filter(Boolean);

    const displayItems = normalizedConfiguredItems.length > 0 ? normalizedConfiguredItems : latestItems;

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">

                {/* Elegant Professional Header */}
                <div className="relative flex flex-col md:block items-center justify-center mb-10 md:mb-16">
                    <div className="flex flex-col items-center justify-center text-center md:w-full">
                        <span className="text-[#8E4A50] font-sans tracking-[0.3em] font-bold text-xs uppercase mb-3 block">
                            Fresh Arrivals
                        </span>
                        <h2 className="font-serif text-3xl md:text-5xl font-medium text-[#111111] tracking-wide mb-6">
                            {sectionData?.label || "Latest Drop"}
                        </h2>
                        <div className="hidden md:block w-16 h-[2px] bg-[#EAC1C3]"></div>
                    </div>

                    <div className="hidden md:block md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2">
                        <Link
                            to="/shop?sort=latest"
                            className="group flex items-center gap-2 text-[#444] text-sm font-semibold tracking-widest uppercase border-b-2 border-transparent hover:border-[#8E4A50] hover:text-[#8E4A50] transition-all pb-1"
                        >
                            View All
                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Grid (Desktop) / Horizontal Scroll (Mobile) */}
                <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 pb-4 md:pb-0 px-4 md:px-0 scrollbar-hide snap-x snap-mandatory -mx-4 md:mx-0 max-w-[1400px] mx-auto">
                    {displayItems.map((item, index) => {
                        const limit = Number(item.limit) || 12;
                        const name = item.name || item.label || 'Latest Drop';
                        const image = item.image || latestRing;
                        const path = item.path || `/shop?limit=${limit}&sort=latest`;

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
                                className="group cursor-pointer flex-shrink-0 w-[260px] md:w-full snap-center first:ml-4 md:first:ml-0 last:mr-4 md:last:mr-0 h-full"
                            >
                                <Link to={path} className="flex flex-col bg-white rounded-xl h-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 border border-gray-100 overflow-hidden">
                                    
                                    {/* Top Image Section */}
                                    <div className="relative aspect-[4/5] overflow-hidden bg-[#F9F9F9]">
                                        <img 
                                            src={image} 
                                            alt={name}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                                        />
                                        
                                        {/* "NEW" Tag */}
                                        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md text-[#111] text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded shadow-sm">
                                            New Arrival
                                        </div>

                                        {/* Animated Overlay Button */}
                                        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6 z-20 pointer-events-none">
                                            <div className="bg-white/95 backdrop-blur-sm text-[#111] text-xs font-bold uppercase tracking-[0.2em] px-6 py-3 rounded-full translate-y-6 group-hover:translate-y-0 transition-transform duration-500 shadow-xl pointer-events-auto">
                                                Explore Now
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sophisticated Details Section */}
                                    <div className="p-5 md:p-6 bg-white flex flex-col justify-between flex-grow z-10 relative">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-serif text-xl md:text-2xl text-[#1A1A1A] font-medium leading-tight group-hover:text-[#8E4A50] transition-colors">
                                                {name}
                                            </h3>
                                            <div className="flex text-[#DCA34D] gap-[2px] mt-1 shrink-0">
                                                <Star className="w-3.5 h-3.5 fill-current" />
                                                <Star className="w-3.5 h-3.5 fill-current" />
                                                <Star className="w-3.5 h-3.5 fill-current" />
                                                <Star className="w-3.5 h-3.5 fill-current" />
                                                <Star className="w-3.5 h-3.5 fill-current" />
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                                            <p className="font-sans text-xs md:text-sm text-[#777] font-medium uppercase tracking-wider">
                                                Curated {limit} pieces
                                            </p>
                                            <div className="text-[#8E4A50] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>

                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Explore Button (Mobile Only) */}
                <div className="mt-10 flex justify-center md:hidden">
                    <Link
                        to="/shop?sort=latest"
                        className="inline-flex items-center gap-2 text-[#222] font-semibold text-sm uppercase tracking-widest border-b-2 border-[#222] pb-1 hover:text-[#8E4A50] hover:border-[#8E4A50] transition-colors"
                    >
                        View All Drops
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default LatestDrop;
