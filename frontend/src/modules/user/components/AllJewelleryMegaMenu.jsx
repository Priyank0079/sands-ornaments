import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft } from 'lucide-react';

// Import assets for banners and purities
import goldBanner from '@assets/hero/bridal_royal.png';
import silverBanner from '@assets/hero/spring_silver_campaign.png';
import purity24k from '@assets/categories/sets.png';
import purity22k from '@assets/categories/bangle.png';
import purity18k from '@assets/categories/rings.png';
import purity14k from '@assets/categories/earrings.png';
import puritySterling from '@assets/categories/pendants.png';
import purityFine from '@assets/categories/anklets.png';

const AllJewelleryMegaMenu = ({ resetMenu, initialView = 'main' }) => {
    const [view, setView] = useState(initialView); // 'main', 'gold', 'silver'

    const goldPurities = [
        // Shop.jsx expects `metal=gold` + `karat=14|18|22|24`
        { id: '24k', name: '24K GOLD', sub: 'PURE 99.9% GOLD', image: purity24k, path: '/shop?metal=gold&karat=24' },
        { id: '22k', name: '22K GOLD', sub: 'PREMIUM HALLMARKED', image: purity22k, path: '/shop?metal=gold&karat=22' },
        { id: '18k', name: '18K GOLD', sub: 'LUXURY DESIGN', image: purity18k, path: '/shop?metal=gold&karat=18' },
        { id: '14k', name: '14K GOLD', sub: 'DAILY ELEGANCE', image: purity14k, path: '/shop?metal=gold&karat=14' },
    ];

    const silverPurities = [
        // Shop.jsx expects `metal=silver` + `silver_type=fine|sterling`
        { id: '925', name: 'STERLING SILVER', sub: '925 HALLMARKED', image: puritySterling, path: '/shop?metal=silver&silver_type=sterling' },
        { id: 'fine', name: 'FINE SILVER', sub: 'PURE & SIMPLE', image: purityFine, path: '/shop?metal=silver&silver_type=fine' },
    ];

    return (
        <div className="bg-white min-w-[800px] max-w-[1000px] shadow-2xl border border-gray-100 overflow-hidden relative min-h-[400px]">
            <AnimatePresence mode="wait">
                {view === 'main' && (
                    <motion.div
                        key="main"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="p-8"
                    >
                        <h3 className="text-[#9C3D5E] text-[11px] font-black uppercase tracking-[0.3em] mb-8">
                            Explore Metal Collections
                        </h3>

                        <div className="flex flex-col gap-6">
                            {/* Gold Collection Banner */}
                            <div 
                                onClick={() => setView('gold')}
                                className="group relative h-[140px] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500"
                            >
                                <img src={goldBanner} alt="Gold" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                                <div className="absolute inset-y-0 left-10 flex flex-col justify-center text-white">
                                    <h2 className="text-3xl font-bold tracking-tight mb-1">GOLD COLLECTION</h2>
                                    <p className="text-[11px] font-medium opacity-80 tracking-widest uppercase">Pure 24K • 22K • 18K • 14K</p>
                                </div>
                                <div className="absolute right-10 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:bg-white/40 transition-all">
                                    <ChevronRight className="w-6 h-6 text-white" />
                                </div>
                            </div>

                            {/* Silver Collection Banner */}
                            <div 
                                onClick={() => setView('silver')}
                                className="group relative h-[140px] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500"
                            >
                                <img src={silverBanner} alt="Silver" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                                <div className="absolute inset-y-0 left-10 flex flex-col justify-center text-white">
                                    <h2 className="text-3xl font-bold tracking-tight mb-1">SILVER COLLECTION</h2>
                                    <p className="text-[11px] font-medium opacity-80 tracking-widest uppercase">925 Sterling • Fine Silver</p>
                                </div>
                                <div className="absolute right-10 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:bg-white/40 transition-all">
                                    <ChevronRight className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {view === 'gold' && (
                    <motion.div
                        key="gold"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="p-10 bg-[#FFFDF7]"
                    >
                        <button 
                            onClick={() => setView('main')}
                            className="flex items-center gap-3 text-[#B88B4A] font-bold text-[12px] uppercase tracking-[0.2em] mb-10 hover:translate-x-[-4px] transition-transform"
                        >
                            <div className="w-9 h-9 rounded-full bg-[#B88B4A]/10 flex items-center justify-center">
                                <ArrowLeft className="w-4 h-4" />
                            </div>
                            Gold Purities
                        </button>

                        <div className="grid grid-cols-4 gap-8">
                            {goldPurities.map((item) => (
                                <Link 
                                    key={item.id} 
                                    to={item.path} 
                                    onClick={resetMenu}
                                    className="group flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 border border-[#B88B4A]/5"
                                >
                                    <div className="w-full aspect-[4/5] overflow-hidden bg-[#FAF3F0]">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                    </div>
                                    <div className="p-6 text-center">
                                        <h4 className="text-[14px] font-black text-gray-900 mb-1 uppercase tracking-wider">{item.name}</h4>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{item.sub}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}

                {view === 'silver' && (
                    <motion.div
                        key="silver"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="p-10 bg-[#F9FAFB]"
                    >
                        <button 
                            onClick={() => setView('main')}
                            className="flex items-center gap-3 text-[#64748B] font-bold text-[12px] uppercase tracking-[0.2em] mb-10 hover:translate-x-[-4px] transition-transform"
                        >
                            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                                <ArrowLeft className="w-4 h-4" />
                            </div>
                            Silver Purities
                        </button>

                        <div className="grid grid-cols-2 gap-10 max-w-[640px] mx-auto">
                            {silverPurities.map((item) => (
                                <Link 
                                    key={item.id} 
                                    to={item.path} 
                                    onClick={resetMenu}
                                    className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 border border-gray-100"
                                >
                                    <div className="w-full aspect-[4/5] overflow-hidden bg-[#F3F4F6]">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                    </div>
                                    <div className="p-8 text-center">
                                        <h4 className="text-[16px] font-black text-gray-900 mb-1 uppercase tracking-widest">{item.name}</h4>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{item.sub}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AllJewelleryMegaMenu;

