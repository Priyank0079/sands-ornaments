import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import classicsImg from '../../assets/family_curated_classics.png';
import sistersImg from '../../assets/family_curated_sisters.png';

const collections = [
    {
        id: 'classics',
        title: 'SHOP 925 SILVER CLASSICS',
        image: classicsImg, 
        path: '/shop?category=family&style=classics'
    },
    {
        id: 'astra',
        title: 'ASTRA COLLECTION',
        image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop',
        path: '/shop?category=family&collection=astra'
    },
    {
        id: 'boho',
        title: 'SHOP BOHO ANKLETS',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
        path: '/shop?category=family&category=anklets'
    },
    {
        id: 'gifts',
        title: 'SHOP GIFTS FOR HER',
        image: sistersImg,
        path: '/shop?category=family&filter=gifts'
    }
];

const FamilyCuratedCollections = () => {
    return (
        <section className="py-12 md:py-20 bg-white">
            <div className="container mx-auto px-4 md:px-8">
                
                {/* Section Header */}
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-light text-[#111] font-display tracking-tight">
                        Curated Collections
                    </h2>
                </div>

                {/* Collections Grid - Horizontal Scroll on Mobile, Flex on Desktop */}
                <div className="flex overflow-x-auto pb-4 md:pb-0 scrollbar-hide gap-3 md:grid md:grid-cols-4 md:gap-6">
                    {collections.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.15 }}
                            className="min-w-[210px] md:min-w-0 group relative aspect-[3/4] rounded-none overflow-hidden"
                        >
                            <Link to={item.path} className="block w-full h-full relative">
                                {/* Image */}
                                <img 
                                    src={item.image} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />

                                {/* Subtle Overlay with Gradient at bottom */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                                {/* Text content bottom left */}
                                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                                    <h3 
                                        className="text-white font-bold text-xs md:text-sm tracking-[0.2em] uppercase leading-tight"
                                        style={{ fontFamily: "'Inter', sans-serif" }}
                                    >
                                        {item.title}
                                    </h3>
                                    <ChevronRight className="w-4 h-4 text-white shrink-0 group-hover:translate-x-2 transition-transform duration-300" />
                                </div>

                                {/* Hover Border Shine */}
                                <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 transition-all duration-500" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FamilyCuratedCollections;
