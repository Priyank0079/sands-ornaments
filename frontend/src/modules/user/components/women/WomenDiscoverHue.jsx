import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Static assets from public folder
const GoldImg = '/images/hues/Gold.png';
const RoseGoldImg = '/images/hues/RoseGold.png';
const SilverImg = '/images/hues/Silver.png';
const OxidisedImg = '/images/hues/Oxidised.png';

const hues = [
    {
        id: 1,
        title: "Silver",
        tag: "Pure 925 Silver",
        image: SilverImg,
        gradient: "from-slate-300 via-slate-100 to-slate-400",
        path: "/shop?metal=silver"
    },
    {
        id: 2,
        title: "Gold Plated",
        tag: "18 KT Gold Plated",
        image: GoldImg,
        gradient: "from-amber-400 via-yellow-200 to-amber-500",
        path: "/shop?metal=gold"
    },
    {
        id: 3,
        title: "Rose Gold Plated",
        tag: "18 KT Rose Gold Plated",
        image: RoseGoldImg,
        gradient: "from-rose-400 via-rose-100 to-rose-500",
        path: "/shop?metal=rose-gold"
    },
    {
        id: 4,
        title: "Oxidised Silver",
        tag: "Pure 925 Silver",
        image: OxidisedImg,
        gradient: "from-stone-600 via-stone-300 to-stone-700",
        path: "/shop?metal=oxidised-silver"
    }
];

const WomenDiscoverHue = () => {
    return (
        <section className="py-24 bg-[#FFF9FA] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16 space-y-4">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-serif text-zinc-900 tracking-tight"
                    >
                        Discover Your Hue
                    </motion.h2>
                    <div className="w-20 h-1 bg-rose-200 mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    {hues.map((hue, index) => (
                        <motion.div
                            key={hue.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center group"
                        >
                            <Link 
                                to={hue.path}
                                className="relative w-full aspect-square rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl mb-12 bg-white ring-1 ring-zinc-100"
                            >
                                {/* PURE badge at top */}
                                <div className="absolute top-6 left-6 z-20">
                                    <div className="bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg ring-1 ring-zinc-100">
                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                                        <span className="text-[10px] md:text-xs font-black text-zinc-600 uppercase tracking-widest">
                                            {hue.tag}
                                        </span>
                                    </div>
                                </div>

                                <img
                                    src={hue.image}
                                    alt={hue.title}
                                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                                />

                                {/* Color Circle at bottom overlap */}
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-30 translate-y-1/2">
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white p-2 shadow-[0_10px_30px_rgba(0,0,0,0.1)] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-shadow">
                                        <div className={`w-full h-full rounded-full bg-gradient-to-tr ${hue.gradient} border-[3px] border-white shadow-inner`} />
                                    </div>
                                </div>
                            </Link>

                            <h3 className="text-2xl md:text-3xl font-serif text-zinc-800 tracking-tight mt-4 transition-colors group-hover:text-rose-500">
                                {hue.title}
                            </h3>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WomenDiscoverHue;
