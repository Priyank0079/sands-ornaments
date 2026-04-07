import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import { ShopContext } from '../../../../context/ShopContext';

// Static assets from public folder
const GiftsImg = '/images/collections/GiftsForHer.png';
const BridalImg = '/images/collections/BridalBliss.png';
const OfficeImg = '/images/collections/OfficeChic.png';
const SilverImg = '/images/collections/SilverClassics.png';
const RingsImg = '/images/collections/DazzlingRings.png';
const BohoImg = '/images/collections/BohoAnklets.png';

const collections = [
    {
        id: 1,
        title: "925 Silver Classics",
        subtitle: "Timeless purity in every shimmer",
        image: SilverImg,
        link: "/shop?category=silver"
    },
    {
        id: 2,
        title: "Dazzling Rings",
        subtitle: "Let your hands do the talking",
        image: RingsImg,
        link: "/shop?category=rings"
    },
    {
        id: 3,
        title: "Boho Anklets",
        subtitle: "Trendy pieces for the free-spirited",
        image: BohoImg,
        link: "/shop?category=anklets"
    },
    {
        id: 4,
        title: "Gifts for Her",
        subtitle: "The surprise her heart'll adore",
        image: GiftsImg,
        link: "/shop?category=women-gifts"
    },
    {
        id: 5,
        title: "Bridal Bliss",
        subtitle: "Elegance for your special day",
        image: BridalImg,
        link: "/shop?category=bridal"
    },
    {
        id: 6,
        title: "Office Chic",
        subtitle: "Minimalist modern designs",
        image: OfficeImg,
        link: "/shop?category=office"
    }
];

// Duplicate for seamless loop marquee
const duplicatedCollections = [...collections, ...collections];

const WomenCuratedCollections = () => {
    return (
        <section className="py-24 bg-white overflow-hidden relative">
            {/* Background Decorative Large Text */}
            <div className="absolute top-0 left-0 w-full opacity-[0.03] pointer-events-none select-none">
                <div className="text-[15vw] font-serif font-black whitespace-nowrap leading-none tracking-tighter">
                    SANDS ROYAL WOMEN SANDS ROYAL WOMEN
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Simplified Professional Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-center gap-3 text-rose-400">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em]">The Exclusive List</span>
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <h2 className="text-4xl md:text-6xl font-serif text-black uppercase tracking-tight">
                            Signature <span className="italic font-light text-rose-400">Collections</span>
                        </h2>
                        <div className="w-20 h-[1.5px] bg-rose-200 mx-auto" />
                    </motion.div>
                </div>

                {/* Marquee Carousel Container */}
                <div className="flex relative w-full overflow-hidden py-10">
                    <motion.div 
                        className="flex gap-8 group"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ 
                            x: {
                                duration: 40, 
                                repeat: Infinity,
                                ease: "linear"
                            }
                        }}
                    >
                        {duplicatedCollections.map((item, idx) => (
                            <div 
                                key={`${item.id}-${idx}`}
                                className="flex-shrink-0 w-[280px] md:w-[350px] aspect-[4/5] relative rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-700 bg-zinc-100 group/card"
                            >
                                <img 
                                    src={item.image} 
                                    alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover/card:scale-110"
                                />
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover/card:opacity-40 transition-opacity" />

                                {/* Professional & Simple Text Box */}
                                <div className="absolute bottom-6 left-5 right-5">
                                    <div className="bg-white/95 backdrop-blur-md px-6 py-5 rounded-[1.8rem] shadow-2xl flex items-center justify-between gap-4 translate-y-2 group-hover/card:translate-y-0 transition-transform duration-700">
                                        <div className="space-y-0.5 overflow-hidden">
                                            <p className="text-rose-400 text-[9px] font-black uppercase tracking-widest line-clamp-1">
                                                {item.subtitle}
                                            </p>
                                            <h3 className="text-zinc-900 font-serif text-lg md:text-xl leading-none truncate tracking-tight">
                                                {item.title}
                                            </h3>
                                        </div>
                                        
                                        {/* Premium Round Button */}
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center transition-all duration-500 group-hover/card:bg-zinc-900 group-hover/card:text-white group/btn">
                                            <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                    
                    {/* Edge Fades for the Professional Look */}
                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
                </div>
            </div>
        </section>
    );
};

export default WomenCuratedCollections;
