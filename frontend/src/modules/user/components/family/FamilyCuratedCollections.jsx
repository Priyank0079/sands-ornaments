import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import classicsImg from '../../assets/family_curated_classics.png';
import sistersImg from '../../assets/family_curated_sisters.png';
import astraImg from '../../assets/family_astra.png';
import bohoImg from '../../assets/family_boho.png';
import signatureImg from '../../assets/premium_necklace_product.png'; // Reusing premium asset for new card
import bridalImg from '../../assets/latest_drop_earrings.png'; // Reusing premium asset for new card

const collections = [
    {
        id: 'classics',
        title: '925 SILVER CLASSICS',
        image: classicsImg, 
        path: '/shop?category=family&style=classics'
    },
    {
        id: 'astra',
        title: 'ASTRA EDITION',
        image: astraImg,
        path: '/shop?category=family&collection=astra'
    },
    {
        id: 'signature',
        title: 'SIGNATURE SETS',
        image: signatureImg,
        path: '/shop?category=family&filter=sets'
    },
    {
        id: 'boho',
        title: 'BOHO ANKLETS',
        image: bohoImg,
        path: '/shop?category=family&category=anklets'
    },
    {
        id: 'bridal',
        title: 'BRIDAL EDIT',
        image: bridalImg,
        path: '/shop?category=family&filter=bridal'
    },
    {
        id: 'gifts',
        title: 'GIFTS FOR HER',
        image: sistersImg,
        path: '/shop?category=family&filter=gifts'
    }
];

const FamilyCuratedCollections = () => {
    return (
        <section className="py-4 md:py-8 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-12">
                
                {/* Section Header */}
                <div className="text-center mb-6 md:mb-8 flex flex-col items-center">
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-[#C9A24D] mb-2 font-sans">Handpicked Selections</span>
                    <h2 className="text-2xl md:text-4xl font-serif text-[#2D060F] tracking-tight">
                        Curated <span className="italic font-light">Collections</span>
                    </h2>
                    <div className="w-8 h-[1px] bg-[#C9A24D]/40 mt-4" />
                </div>

                {/* Collections Grid - EXACTLY matching Product Card Layout */}
                <div className="flex overflow-x-auto pb-4 md:pb-0 scrollbar-hide gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 md:gap-4 lg:gap-6">
                    {collections.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="min-w-[240px] md:min-w-0 flex flex-col group cursor-pointer"
                        >
                            <Link to={item.path} className="flex flex-col h-full">
                                {/* Image Container - Aspect Square */}
                                <div className="relative aspect-square overflow-hidden bg-[#F9F6F3] mb-3">
                                    <img 
                                        src={item.image} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                                    />
                                    
                                    {/* Bestseller Badge - to match Exactly */}
                                    <div className="absolute top-0 left-0 bg-[#E89BA8] text-white text-[9px] font-bold px-2 py-1 z-10 uppercase tracking-widest">
                                        Collection
                                    </div>
                                </div>

                                {/* Content Below - Matching Product Card Exactly */}
                                <div className="flex flex-col flex-1 px-0">
                                    <div className="h-[40px] mb-2">
                                        <h3 className="text-[12px] text-gray-700 line-clamp-2 h-[34px] group-hover:text-black transition-colors uppercase tracking-tight font-medium overflow-hidden">
                                            {item.title}
                                        </h3>
                                    </div>

                                    <div className="h-[15px] mb-2">
                                        <p className="text-[9px] font-bold text-blue-600 uppercase tracking-wider">
                                            NEW ARRIVAL
                                        </p>
                                    </div>
                                    
                                    {/* Call to Action - Pink Button */}
                                    <div className="mt-auto">
                                        <div className="w-full bg-[#FFD9E0] text-[#8E2B45] font-bold text-[11px] py-2.5 rounded-none hover:bg-[#ffc2cd] transition-all duration-300 uppercase tracking-widest text-center">
                                            Browse Collection
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FamilyCuratedCollections;
