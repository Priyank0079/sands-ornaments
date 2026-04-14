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
        return `/shop?category=${categoryId}`;
    }
    if (item?.path) return item.path;
    return fallbackPath;
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
            className="py-10 md:py-16 bg-[#FFF2F4] relative overflow-hidden"
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
                    margin-top: 3rem;
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
                    className="relative flex flex-col items-center justify-center mb-4 md:mb-6 text-center"
                >
                    <div className="inline-block bg-[#722F37] text-white px-5 py-1.5 font-display tracking-widest text-xs uppercase rounded-full shadow-md mb-4">
                        New Launch
                    </div>
                    <h3 className="font-display text-[#1F1F1F] text-4xl md:text-5xl font-medium tracking-wide uppercase">
                        {sectionData?.label || "Limited Edition"}
                    </h3>
                </motion.div>

                {/* 3D Curved Carousel Area */}
                <div className="scene">
                    <div className="rotator">
                        {cylinderItems.map((item, index) => {
                            const itemLabel = item.name || item.label;
                            const itemPath = item.path || '/shop';
                            // Calculate proper angle for 10 items (360 / 10 = 36)
                            const angle = index * 36;

                            return (
                                <div
                                    key={`cyl-${Math.random()}-${index}`}
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
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>

                                        {/* Classic Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#2A0505]/90 via-[#2A0505]/30 to-transparent"></div>

                                        {/* Text Section overlay at bottom */}
                                        <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center justify-end text-center z-10">
                                            <h4 className="font-display font-medium text-2xl lg:text-3xl text-white tracking-widest mb-3 transform transition-transform duration-300 group-hover:-translate-y-2 drop-shadow-md">
                                                {itemLabel}
                                            </h4>
                                            
                                            {/* Discover/Animated Arrow */}
                                            <div className="flex items-center gap-3 text-[#C9A24D] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-75">
                                                <div className="h-[1px] w-6 bg-[#C9A24D]"></div>
                                                <span className="text-sm font-bold uppercase tracking-[0.25em]">
                                                    Explore
                                                </span>
                                                <div className="h-[1px] w-6 bg-[#C9A24D]"></div>
                                            </div>
                                        </div>

                                        {/* Border Glow on Hover */}
                                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#C9A24D]/50 rounded-3xl transition-colors duration-500 pointer-events-none"></div>
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
