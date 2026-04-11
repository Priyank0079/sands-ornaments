import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Matching images exactly to the screenshot
import silverHeartImg from '../../../assets/categories/gold_pendants.png'; // Card 1: Heart Pendant
import goldRingImg from '../../../assets/categories/rings.png'; // Card 2: Ring on base
import roseGoldBraceletImg from '../../../assets/categories/gold_bracelet.png'; // Card 3: Bracelet on jug
import oxidisedRingsImg from '../../../assets/categories/earrings.png'; // Card 4: Two rings on base

const COLOUR_CATEGORIES = [
    {
        id: 1,
        name: 'Pure 925 Silver',
        tag: '✦ Pure 925 Silver',
        image: silverHeartImg,
        color: 'bg-gradient-to-br from-[#E2E8F0] to-[#94A3B8]',
        badgeBg: 'bg-gradient-to-r from-gray-200 to-gray-400',
        path: '/shop?metal=silver'
    },
    {
        id: 2,
        name: 'Gold Plated',
        tag: '✦ 18 KT Gold Plated',
        image: goldRingImg,
        color: 'bg-gradient-to-br from-[#FDE68A] to-[#D97706]',
        badgeBg: 'bg-gradient-to-r from-[#FDE68A] to-[#D97706]',
        path: '/shop?metal=gold'
    },
    {
        id: 3,
        name: 'Rose Gold Plated',
        tag: '✦ 18 KT Rose Gold Plated',
        image: roseGoldBraceletImg,
        color: 'bg-gradient-to-br from-[#FFD1DA] to-[#EE9CA7]',
        badgeBg: 'bg-gradient-to-r from-[#FFD1DA] to-[#EE9CA7]',
        path: '/shop?metal=rose-gold'
    },
    {
        id: 4,
        name: 'Oxidised Silver',
        tag: '✦ Pure 925 Silver',
        image: oxidisedRingsImg,
        color: 'bg-gradient-to-br from-[#94A3B8] to-[#475569]',
        badgeBg: 'bg-gradient-to-r from-gray-300 to-gray-600',
        path: '/shop?metal=oxidised'
    }
];

const ShopByColour = () => {
    return (
        <section className="py-8 bg-white overflow-hidden">
            <div className="container mx-auto px-4 max-w-[1400px]">
                {/* Section Heading - Wide layout */}
                <div className="text-center mb-8">
                    <h2 className="font-serif text-2xl md:text-[30px] text-[#111] tracking-tight font-medium">
                        Shop by Colour
                    </h2>
                </div>

                {/* Cards Grid - Wide cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-14">
                    {COLOUR_CATEGORIES.map((item) => (
                        <div key={item.id} className="group cursor-pointer">
                            <Link to={item.path} className="flex flex-col items-center">
                                {/* Card Container - Landscape Aspect Ratio */}
                                <div className="relative w-full mb-8 group-hover:-translate-y-1 transition-transform duration-500">
                                    
                                    {/* Wider than square: aspect-[1.2/1] */}
                                    <div 
                                        className="relative w-full aspect-[1.2/1] bg-[#F5E6D3] rounded-[24px] overflow-hidden"
                                        style={{
                                            WebkitMaskImage: 'radial-gradient(circle at 50% 100%, transparent 32px, black 32px)',
                                            maskImage: 'radial-gradient(circle at 50% 100%, transparent 32px, black 32px)'
                                        }}
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>

                                    {/* Top Edge Attached Badge - Scaled Down */}
                                    <div className="absolute top-0 left-5 z-20">
                                        <div className={`${item.badgeBg} backdrop-blur-sm px-3 py-1 rounded-b-xl flex items-center gap-1 shadow-sm border-x border-b border-black/5`}>
                                            <span className="text-[8px] md:text-[10px] font-bold text-gray-800 tracking-tight whitespace-nowrap">
                                                {item.tag}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Swatch Circle - Scaled down to 64px */}
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-30">
                                        <div className="w-14 h-14 md:w-[64px] md:h-[64px] rounded-full bg-white p-1.5 shadow-[0_8px_25px_rgba(0,0,0,0.1)] flex items-center justify-center">
                                            <div className={`w-full h-full rounded-full ${item.color} shadow-inner shadow-black/20`} />
                                        </div>
                                    </div>
                                </div>

                                {/* Label - Compacted */}
                                <h3 className="text-[15px] md:text-[18px] font-bold text-gray-900 tracking-tight text-center group-hover:text-black transition-colors">
                                    {item.name}
                                </h3>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ShopByColour;
