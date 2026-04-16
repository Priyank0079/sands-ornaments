import React, { useMemo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useShop } from '../../../context/ShopContext';

// Import images
import newEarrings from '../assets/new_launch_earrings.png';
import newChains from '../assets/new_launch_chains.png';
import newStuds from '../assets/new_launch_studs.png';
import newBracelets from '../assets/new_launch_bracelets.png';
import newAnklets from '../assets/new_launch_anklets.png';
import { resolveLegacyCmsAsset } from '../utils/legacyCmsAssets';
import { ensureSilverHomePath } from '../utils/silverHomePaths';

const newLaunches = [
    { id: 'earrings', name: "Earrings", image: newEarrings, path: "/shop" },
    { id: 'chains', name: "Chains", image: newChains, path: "/shop" },
    { id: 'studs', name: "Studs", image: newStuds, path: "/shop" },
    { id: 'bracelets', name: "Bracelets", image: newBracelets, path: "/shop" },
    { id: 'anklets', name: "Anklets", image: newAnklets, path: "/shop" }
];

const resolveLaunchPath = (item, fallbackPath = '/shop') => {
    const categoryId = item?.categoryId;
    if (categoryId) {
        return ensureSilverHomePath(`/shop?category=${categoryId}`);
    }
    if (item?.path) return ensureSilverHomePath(item.path);
    return ensureSilverHomePath(fallbackPath);
};

const NewLaunchSection = () => {
    const { homepageSections } = useShop();

    const sectionData = homepageSections?.['new-launch'];
    const configuredItems = Array.isArray(sectionData?.items) ? sectionData.items : [];
    const normalizedConfiguredItems = configuredItems.map((item, index) => {
        return {
            ...item,
            id: item.itemId || item._id || item.id || `launch-${index}`,
            name: item.name || item.label || newLaunches[index]?.name || 'Limited Edition',
            image: resolveLegacyCmsAsset(item.image, newLaunches[index]?.image || newEarrings),
            path: resolveLaunchPath(item, newLaunches[index]?.path || '/shop'),
            categoryId: item.categoryId || null
        };
    });
    const baseItems = normalizedConfiguredItems.length > 0 ? normalizedConfiguredItems : newLaunches;

    // We want exactly 20 items for a smooth curved 3D arc with large radius
    const cylinderItems = useMemo(() => {
        const items = [];
        while(items.length < 20) {
            items.push(...baseItems);
        }
        return items.slice(0, 20);
    }, [baseItems]);

    // Responsive measurements for the wide shallow curve
    const [radius, setRadius] = useState(1200);
    const [cardWidth, setCardWidth] = useState(300);
    const [cardHeight, setCardHeight] = useState(420);

    useEffect(() => {
        const updateDims = () => {
            if (window.innerWidth < 480) {
                setRadius(400);
                setCardWidth(140);
                setCardHeight(200);
            } else if (window.innerWidth < 768) {
                setRadius(600);
                setCardWidth(180);
                setCardHeight(260);
            } else if (window.innerWidth < 1024) {
                setRadius(900);
                setCardWidth(240);
                setCardHeight(340);
            } else {
                setRadius(1200);
                setCardWidth(300);
                setCardHeight(420);
            }
        };
        updateDims();
        window.addEventListener('resize', updateDims);
        return () => window.removeEventListener('resize', updateDims);
    }, []);

    return (
        <section 
            className="py-10 md:py-16 bg-[#FEF6F7] relative overflow-hidden"
            style={{
                '--radius': `${radius}px`,
                '--cardW': `${cardWidth}px`,
                '--cardH': `${cardHeight}px`
            }}
        >
            {/* Inline styles for the SHALLOW 3D Curve Animation */}
            <style>
                {`
                @keyframes spinShallowCylinder {
                    0% { transform: translateZ(calc(var(--radius) * -1)) rotateY(0deg); }
                    100% { transform: translateZ(calc(var(--radius) * -1)) rotateY(-360deg); }
                }
                .scene {
                    perspective: 4000px; /* Massive perspective for a flatter, natural look */
                    width: 100%;
                    height: var(--cardH);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 1.5rem;
                }
                .rotator {
                    width: var(--cardW);
                    height: var(--cardH);
                    position: relative;
                    transform-style: preserve-3d;
                    /* Super smooth slow continuous horizontal scroll */
                    animation: spinShallowCylinder 80s infinite linear;
                }
                .rotator:hover {
                    animation-play-state: paused;
                }
                .cylinder-card {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    border-radius: 1.5rem;
                }
                `}
            </style>

            <div className="container mx-auto px-4 md:px-6 relative z-10 overflow-visible">

                {/* Header Area */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative flex flex-col items-center justify-center mb-0 md:mb-2 text-center"
                >
                    <div className="inline-block bg-[#722F37] text-white px-5 py-1 font-serif tracking-[0.2em] text-[10px] uppercase rounded-full shadow-sm mb-4">
                        New Launch
                    </div>
                    <h3 className="font-serif text-[#1F1F1F] text-4xl md:text-6xl font-light tracking-tight uppercase">
                        {sectionData?.label || "Limited Edition"}
                    </h3>
                </motion.div>

                {/* 3D Curved Carousel Area */}
                <div className="scene">
                    <div className="rotator">
                        {cylinderItems.map((item, index) => {
                            const itemLabel = item.name || item.label;
                            const itemPath = item.path || '/shop';
                            // Calculate proper angle for 20 items (360 / 20 = 18)
                            const angle = index * 18;

                            return (
                                <div
                                    key={`cyl-${index}`}
                                    className="cylinder-card shadow-2xl group"
                                    style={{
                                        transform: `rotateY(${angle}deg) translateZ(var(--radius))`,
                                    }}
                                >
                                    <Link to={itemPath} className="block w-full h-full relative isolate rounded-3xl overflow-hidden cursor-pointer bg-white">
                                        {/* Image */}
                                        <div className="absolute inset-0 bg-[#FCD8D8]/50">
                                            <img
                                                src={item.image}
                                                alt={itemLabel}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>

                                        {/* Classic Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-80"></div>

                                        {/* Text Section overlay at bottom */}
                                        <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center justify-end text-center z-10 transition-transform duration-500 group-hover:-translate-y-2">
                                            <h4 className="font-serif font-medium text-2xl lg:text-[1.75rem] text-white tracking-[0.1em] mb-4 drop-shadow-lg uppercase">
                                                {itemLabel}
                                            </h4>
                                            
                                            {/* Discover/Animated Arrow */}
                                            <div className="flex items-center gap-3 text-[#FFD9E0] transition-all duration-500">
                                                <div className="h-[1px] w-5 bg-[#FFD9E0]/40 group-hover:w-8 transition-all"></div>
                                                <span className="text-[10px] font-black uppercase tracking-[0.4em] drop-shadow-md">
                                                    EXPLORE
                                                </span>
                                                <div className="h-[1px] w-5 bg-[#FFD9E0]/40 group-hover:w-8 transition-all"></div>
                                            </div>
                                        </div>

                                        {/* Border Glow on Hover */}
                                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#FFD9E0]/20 rounded-3xl transition-colors duration-500 pointer-events-none"></div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default NewLaunchSection;
