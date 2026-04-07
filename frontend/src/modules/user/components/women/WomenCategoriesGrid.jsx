import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const budgetCollections = [
    {
        id: 1,
        title: "UNDER INR 2000",
        header: "TIMELESS PURITY IN EVERY...",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=90&w=1600&auto=format&fit=crop",
        path: "/shop?price_max=2000"
    },
    {
        id: 2,
        title: "UNDER INR 1999",
        header: "LET YOUR HANDS DO THE...",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=90&w=1600&auto=format&fit=crop",
        path: "/shop?price_max=1999"
    },
    {
        id: 3,
        title: "UNDER INR 2999",
        header: "DAZZLING RINGS",
        image: "https://images.unsplash.com/photo-1512163143273-bde0e3cc7407?q=90&w=1600&auto=format&fit=crop",
        path: "/shop?price_max=2999"
    },
    {
        id: 4,
        title: "UNDER INR 3999",
        header: "TRENDY PIECES FOR THE...",
        image: "https://images.unsplash.com/photo-1633192070622-c313a9686315?q=90&w=1600&auto=format&fit=crop",
        path: "/shop?price_max=3999"
    }
];

const WomenCategoriesGrid = () => {
    return (
        <section className="py-24 px-6 bg-white overflow-hidden relative">
            <div className="max-w-7xl mx-auto">
                {/* Smaller, More Professional Luxury Header */}
                <div className="text-center mb-12 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center"
                    >
                        <div className="flex items-center gap-2 text-rose-300 mb-2">
                            <span className="w-6 h-[1px] bg-rose-200"></span>
                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.5em] text-rose-400">HANDPICKED</span>
                            <span className="w-6 h-[1px] bg-rose-200"></span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-serif text-slate-900 tracking-tight leading-none mb-6">
                            CURATED <span className="italic font-light text-rose-300">COLLECTIONS</span>
                        </h2>
                        <div className="w-20 h-[2px] bg-rose-200/60 rounded-full" />
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {budgetCollections.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Link 
                                to={item.path}
                                className="group relative block aspect-[3/4] rounded-[48px] overflow-hidden bg-slate-950 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.2)] transition-all duration-700 hover:-translate-y-2"
                            >
                                {/* High-End Image Scaling */}
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover brightness-[0.9] transition-all duration-[2.5s] ease-out group-hover:scale-110 group-hover:brightness-100"
                                />
                                
                                {/* Dark Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity duration-700" />

                                {/* Polished Floating Label Layout */}
                                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-5 md:p-6 rounded-[32px] flex items-center justify-between shadow-xl transition-all duration-500 group-hover:bottom-6">
                                    <div className="space-y-0.5">
                                        <span className="text-[8px] md:text-[9px] font-black text-rose-400 tracking-[0.2em] uppercase block">
                                            {item.header}
                                        </span>
                                        <h4 className="text-slate-950 text-base md:text-lg font-serif font-bold tracking-tight leading-tight">
                                            {item.title}
                                        </h4>
                                    </div>
                                    
                                    {/* Smaller Circle Arrow Button */}
                                    <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 transition-all duration-500 group-hover:bg-rose-50 group-hover:border-rose-100">
                                        <ChevronRight 
                                            className="w-4 h-4 text-slate-900 transition-transform duration-500 group-hover:translate-x-0.5" 
                                            strokeWidth={3} 
                                        />
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

export default WomenCategoriesGrid;
