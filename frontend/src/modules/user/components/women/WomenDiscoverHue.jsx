import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const hues = [
    {
        id: 1,
        title: "Silver",
        tag: "Pure 925 Silver",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=90&w=1600&auto=format&fit=crop",
        swatch: "bg-gradient-to-tr from-slate-300 via-slate-100 to-slate-300",
        path: "/shop?metal=silver"
    },
    {
        id: 2,
        title: "Gold Plated",
        tag: "18 KT Gold Plated",
        image: "https://images.unsplash.com/photo-1621112904887-419379ce6824?q=90&w=1600&auto=format&fit=crop",
        swatch: "bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-400",
        path: "/shop?metal=gold"
    },
    {
        id: 3,
        title: "Rose Gold Plated",
        tag: "18 KT Rose Gold Plated",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=90&w=1600&auto=format&fit=crop",
        swatch: "bg-gradient-to-tr from-rose-400 via-rose-200 to-rose-400",
        path: "/shop?metal=rose-gold"
    },
    {
        id: 4,
        title: "Oxidised Silver",
        tag: "Pure 925 Silver",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=90&w=1600&auto=format&fit=crop",
        swatch: "bg-gradient-to-tr from-stone-500 via-stone-300 to-stone-500",
        path: "/shop?metal=oxidised-silver"
    }
];

const WomenDiscoverHue = () => {
    return (
        <section className="py-24 bg-[#FFF6F7] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-serif font-black text-slate-900 tracking-tight"
                    >
                        Discover Your Hue
                    </motion.h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                    {hues.map((hue, index) => (
                        <motion.div
                            key={hue.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center"
                        >
                            <Link 
                                to={hue.path}
                                className="group relative w-full aspect-square rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-xl mb-6 bg-white"
                            >
                                {/* Floating Tag */}
                                <div className="absolute top-4 left-4 z-20">
                                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md border border-slate-100">
                                        <span className="text-[10px] md:text-xs">✨</span>
                                        <span className="text-[9px] md:text-[11px] font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                                            {hue.tag}
                                        </span>
                                    </div>
                                </div>

                                <img
                                    src={hue.image}
                                    alt={hue.title}
                                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                                />

                                {/* Dark Gradient at bottom for swatch contrast */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                {/* Floating Swatch Circle */}
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-30 translate-y-1/2">
                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white p-1 shadow-2xl ring-2 ring-[#FFF6F7]">
                                        <div className={`w-full h-full rounded-full ${hue.swatch} border border-white/50 shadow-inner`} />
                                    </div>
                                </div>
                            </Link>

                            <h3 className="mt-8 text-xl md:text-2xl font-serif font-bold text-slate-800 tracking-tight">
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
