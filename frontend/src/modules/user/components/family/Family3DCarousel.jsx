import React, { useMemo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Import images
import motherImg from '../../assets/family_3d_mother.png';
import fatherImg from '../../assets/family_3d_father.png';
import sisterImg from '../../assets/family_3d_sister.png';
import brotherImg from '../../assets/family_3d_brother.png';
import spouseImg from '../../assets/family_3d_spouse.png';
import daughterImg from '../../assets/family_3d_daughter.png';
import babyImg from '../../assets/family_3d_baby.png';
import gmImg from '../../assets/family_3d_grandmother.png';
import gfImg from '../../assets/family_3d_grandfather.png';
import coupleImg from '../../assets/family_3d_couple.png';

const familyPicks = [
    { id: '1', name: "For Mother", image: motherImg, path: "/shop?filter=family&tag=mother" },
    { id: '2', name: "For Father", image: fatherImg, path: "/shop?filter=family&tag=father" },
    { id: '3', name: "For Sister", image: sisterImg, path: "/shop?filter=family&tag=sister" },
    { id: '4', name: "For Brother", image: brotherImg, path: "/shop?filter=family&tag=brother" },
    { id: '5', name: "For Spouse", image: spouseImg, path: "/shop?filter=family&tag=spouse" },
    { id: '6', name: "For Daughter", image: daughterImg, path: "/shop?filter=family&tag=daughter" },
    { id: '7', name: "For Baby", image: babyImg, path: "/shop?filter=family&tag=baby" },
    { id: '8', name: "Grandmother", image: gmImg, path: "/shop?filter=family&tag=grandmother" },
    { id: '9', name: "Grandfather", image: gfImg, path: "/shop?filter=family&tag=grandfather" },
    { id: '10', name: "For Couple", image: coupleImg, path: "/shop?filter=family&tag=couple" }
];

const Family3DCarousel = () => {
    // 20 items to perfectly close the gap on the massive C-curve radius
    const cylinderItems = useMemo(() => {
        const items = [];
        while(items.length < 20) {
            items.push(...familyPicks);
        }
        return items.slice(0, 20);
    }, []);

    // Responsive measurements for the shallow C-curve (large radius, compact cards)
    const [radius, setRadius] = useState(850);
    const [cardWidth, setCardWidth] = useState(240);
    const [cardHeight, setCardHeight] = useState(340);

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
                 setRadius(750);
                 setCardWidth(200);
                 setCardHeight(280);
             } else {
                 setRadius(950);
                 setCardWidth(240);
                 setCardHeight(340);
             }
        };
        updateDims();
        window.addEventListener('resize', updateDims);
        return () => window.removeEventListener('resize', updateDims);
    }, []);

    return (
        <section 
            className="pt-2 pb-4 md:py-12 bg-[#FDFBFB] relative overflow-hidden"
            style={{
                '--radius': `${radius}px`,
                '--cardW': `${cardWidth}px`,
                '--cardH': `${cardHeight}px`
            }}
        >
            {/* Inline styles for the 3D Cylinder Animation */}
            <style>
                {`
                @keyframes spinFamilyCurve {
                    0% { transform: translateZ(calc(var(--radius) * -1)) rotateY(0deg); }
                    100% { transform: translateZ(calc(var(--radius) * -1)) rotateY(-360deg); }
                }
                .scene-family {
                    perspective: 2000px; /* High perspective for flatter curve */
                    width: 100%;
                    height: var(--cardH);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 0;
                }
                .rotator-family {
                    width: var(--cardW);
                    height: var(--cardH);
                    position: relative;
                    transform-style: preserve-3d;
                    /* Super smooth continuous scrolling right to left */
                    animation: spinFamilyCurve 60s infinite linear;
                }
                .rotator-family:hover {
                    animation-play-state: paused;
                }
                .cylinder-card-family {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    border-radius: 1.2rem;
                }
                `}
            </style>

            <div className="container mx-auto px-4 md:px-6 relative z-10 overflow-visible">

                {/* Header Area */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative hidden md:flex flex-col items-center justify-center mb-2 md:mb-8 text-center"
                >
                    <div className="inline-block bg-[#8E2B45] text-white px-4 py-1 font-sans font-black tracking-[0.2em] text-[9px] uppercase rounded-none shadow-sm mb-3">
                        Curated Picks
                    </div>
                    <h3 className="font-serif text-[#4A3B3F] text-2xl md:text-4xl font-medium tracking-tight uppercase">
                        Gifts to Remember
                    </h3>
                </motion.div>

                {/* 3D Curved Carousel Area */}
                <div className="scene-family mt-2 md:mt-8">
                    <div className="rotator-family">
                        {cylinderItems.map((item, index) => {
                            // Calculate proper angle for 20 items (360 / 20 = 18)
                            const angle = index * 18;

                            return (
                                <div
                                    key={`fam-curv-${index}`}
                                    className="cylinder-card-family shadow-xl group"
                                    style={{
                                        transform: `rotateY(${angle}deg) translateZ(var(--radius))`,
                                    }}
                                >
                                    <Link to={item.path} className="block w-full h-full relative isolate rounded-[1.2rem] overflow-hidden cursor-pointer bg-white">
                                        {/* Image */}
                                        <div className="absolute inset-0 bg-[#FFD9E0]/10">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>

                                        {/* Classic Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#4a0d1d]/90 via-[#4a0d1d]/20 to-transparent"></div>

                                        {/* Text Section overlay at bottom */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex flex-col items-center justify-end text-center z-10">
                                            <h4 className="font-serif font-medium text-lg lg:text-xl text-white tracking-wide mb-2 transform transition-transform duration-300 group-hover:-translate-y-1 drop-shadow-md">
                                                {item.name}
                                            </h4>
                                            
                                            {/* Discover/Animated Arrow */}
                                            <div className="flex items-center gap-2 text-[#FFD9E0] opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-75">
                                                <div className="h-[1px] w-4 bg-[#FFD9E0]"></div>
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                                                    Explore
                                                </span>
                                                <div className="h-[1px] w-4 bg-[#FFD9E0]"></div>
                                            </div>
                                        </div>

                                        {/* Border Glow on Hover */}
                                        <div className="absolute inset-0 border-[2px] border-transparent group-hover:border-[#8E2B45]/50 rounded-[1.2rem] transition-colors duration-500 pointer-events-none"></div>
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

export default Family3DCarousel;
