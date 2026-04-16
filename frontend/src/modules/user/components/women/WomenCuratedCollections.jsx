import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buildWomenShopPath } from '../../utils/womenNavigation';

import SilverImg from '../../../../assets/collections/SilverClassics.png';
import RingsImg from '../../../../assets/collections/DazzlingRings.png';

// Assets from public folder
const GiftsImg = '/images/collections/GiftsForHer.png';
const BridalImg = '/images/collections/BridalBliss.png';
const OfficeImg = '/images/collections/OfficeChic.png';
const BohoImg = '/images/collections/BohoAnklets.png';

const collections = [
    {
        id: 1,
        title: "925 Silver Classics",
        image: SilverImg,
        link: buildWomenShopPath({ metal: 'silver' })
    },
    {
        id: 2,
        title: "Astra Collection",
        image: RingsImg,
        link: buildWomenShopPath({ category: 'rings' })
    },
    {
        id: 3,
        title: "Boho Anklets",
        image: BohoImg,
        link: buildWomenShopPath({ category: 'anklets' })
    },
    {
        id: 4,
        title: "Gifts for Her",
        image: GiftsImg,
        link: buildWomenShopPath({ products: 'w1,w2,w3', limit: 3, sort: 'random' })
    },
    {
        id: 5,
        title: "Bridal Bliss",
        image: BridalImg,
        link: buildWomenShopPath({ search: 'bridal' })
    },
    {
        id: 6,
        title: "Office Chic",
        image: OfficeImg,
        link: buildWomenShopPath({ search: 'office' })
    }
];

const WomenCuratedCollections = () => {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            const scrollAmount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Auto-scroll functionality
    useEffect(() => {
        if (isHovered) return;

        const interval = setInterval(() => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                // If we've reached the end, scroll back to start smoothly
                if (scrollLeft >= scrollWidth - clientWidth - 10) {
                    scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scroll('right');
                }
            }
        }, 3500); // 3.5 seconds per slide

        return () => clearInterval(interval);
    }, [isHovered]);

    return (
        <section className="py-6 md:py-10 bg-white">
            <div className="max-w-[1400px] mx-auto px-3 sm:px-6">
                {/* Header matching ref 2 */}
                <div className="text-center mb-8">
                    <motion.h2 
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-2xl sm:text-3xl md:text-4xl font-normal text-zinc-900 tracking-tight"
                    >
                        Curated Collections
                    </motion.h2>
                </div>

                <div 
                    className="relative group/slider"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Navigation Buttons */}
                    <AnimatePresence>
                        {canScrollLeft && (
                            <motion.button
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                onClick={() => scroll('left')}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-20 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-zinc-800 hover:bg-zinc-50 transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </motion.button>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {canScrollRight && (
                            <motion.button
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                onClick={() => scroll('right')}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-20 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-zinc-800 hover:bg-zinc-50 transition-colors"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </motion.button>
                        )}
                    </AnimatePresence>

                    {/* Scrollable Container */}
                    <div 
                        ref={scrollRef}
                        onScroll={checkScroll}
                        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
                    >
                        {collections.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: 100 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                                whileHover={{ y: -5 }}
                                className="flex-shrink-0 w-[160px] sm:w-[220px] md:w-[320px] aspect-[3/4] relative overflow-hidden cursor-pointer group snap-start"
                            >
                                <Link
                                    to={item.link}
                                    aria-label={`Shop ${item.title}`}
                                    className="absolute inset-0 z-20"
                                />

                                {/* Media Content */}
                                <div className="absolute inset-0 w-full h-full">
                                    {item.video ? (
                                        <video 
                                            src={item.video}
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <img 
                                            src={item.image} 
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    )}
                                </div>

                                {/* Dark Overlay at bottom */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                                {/* Label matching ref 2 */}
                                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white border-b border-white/20 pb-2 z-10 pointer-events-none">
                                    <span className="text-xs md:text-sm font-bold tracking-widest uppercase">
                                        {item.title.includes('Collection') ? item.title : `Shop ${item.title}`}
                                    </span>
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WomenCuratedCollections;
