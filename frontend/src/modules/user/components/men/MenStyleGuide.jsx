import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import images from assets
import styleChains from '../../../../assets/men/style_chains.png';
import styleRings from '../../../../assets/men/style_rings.png';
import styleBracelets from '../../../../assets/men/style_bracelets.png';

const styles = [
    {
        id: 1,
        step: "1. Chain Layering",
        title: "Chain Layering",
        image: styleChains,
        path: "/shop?category=Chains",
        buttonText: "Explore Chains"
    },
    {
        id: 2,
        step: "2. One Piece, Big Impact",
        title: "One Piece, Big Impact",
        image: styleRings,
        path: "/shop?category=Rings",
        buttonText: "Explore Rings"
    },
    {
        id: 3,
        step: "3. Wrist Stacking",
        title: "Wrist Stacking",
        image: styleBracelets,
        path: "/shop?category=Bracelets",
        buttonText: "Explore Bracelets"
    }
];

const MenStyleGuide = () => {
    return (
        <section className="py-12 px-4 md:px-12 bg-[#F3EBE3]">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center"
                    >
                        <h2 className="text-4xl md:text-6xl font-display font-bold text-[#3B2516] tracking-tight mb-4">
                            STYLE GUIDE
                        </h2>
                        <p className="text-lg md:text-2xl text-[#6B4E3D] font-medium tracking-wide">
                            Master the hottest trends
                        </p>
                    </motion.div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {styles.map((style, index) => (
                        <motion.div
                            key={style.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative flex flex-col group h-full"
                        >
                            {/* Step Header */}
                            <div className="bg-[#754E2D] py-4 px-6 text-center rounded-t-2xl z-20">
                                <span className="text-white font-bold text-lg md:text-xl tracking-wider">
                                    {style.step}
                                </span>
                            </div>

                            {/* Image Part */}
                            <div className="relative flex-grow overflow-hidden bg-black rounded-b-2xl shadow-xl aspect-[3/4]">
                                {/* Grayscale Base Image */}
                                <img
                                    src={style.image}
                                    alt={style.title}
                                    className="w-full h-full object-cover grayscale brightness-[0.8] transition-all duration-1000 group-hover:scale-110 group-hover:grayscale-0 group-hover:brightness-100"
                                />

                                {/* Overlay for UI components */}
                                <div className="absolute inset-0 z-10 p-6 pointer-events-none">
                                    {/* Focus Frame (White border in image) */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white/60 rounded-md transition-all duration-500 group-hover:border-white group-hover:w-56 group-hover:h-56" />
                                    
                                    {/* Small Zoom-in Zoom Circle/Box */}
                                    <div className="absolute top-[20%] right-[10%] w-28 h-28 border border-white/40 bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                                        <img src={style.image} alt="zoom" className="w-full h-full object-cover scale-[200%]" />
                                    </div>
                                    
                                    {/* Small Corner Tag (like in image) */}
                                    <div className="absolute bottom-[20%] left-[10%] px-2 py-0.5 bg-black/40 backdrop-blur-md border border-white/20 rounded text-[8px] text-white font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        Sands Collection
                                    </div>
                                </div>

                                {/* Explore Button - Within the card flow like the image */}
                                <div className="absolute bottom-6 right-6 z-20">
                                    <Link
                                        to={style.path}
                                        className="flex items-center gap-2 bg-[#D9C4B1]/90 backdrop-blur-md hover:bg-[#C9A24D] text-[#3B2516] px-6 py-3 rounded-full font-bold text-xs uppercase tracking-[0.2em] shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95"
                                    >
                                        {style.buttonText}
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MenStyleGuide;
