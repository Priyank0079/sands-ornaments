import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MoveRight, ArrowLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Assets (Imports moved here to prevent preloading on main page load)
import goldBanner from '../../assets/banner_party.png'; 
import silverBanner from '../../assets/banner_office.png';
import img24k from '../../assets/cat_pendant.png';
import img22k from '../../assets/cat_rings.png';
import img18k from '../../assets/cat_bracelets.png';
import img14k from '../../assets/cat_earrings.png';
import imgSterling from '../../assets/silver_earrings_product.png';
import imgSilver from '../../assets/cat_anklets.png';

import { COLLECTION_MOCK_PRODUCTS } from '../../data/mockCollectionData.js';



const AllJewelleryMenu = ({ menuViewLevel, setMenuViewLevel, menuSelectedMetal, setMenuSelectedMetal, menuSelectedCategory, setMenuSelectedCategory, resetMenu }) => {
    const navigate = useNavigate();

    const goldSubCategories = [
        { id: '24k', name: '24K Gold', description: 'Pure 99.9% Gold', purity: '24k', image: img24k },
        { id: '22k', name: '22K Gold', description: 'Premium Hallmarked', purity: '22k', image: img22k },
        { id: '18k', name: '18K Gold', description: 'Luxury Design', purity: '18k', image: img18k },
        { id: '14k', name: '14K Gold', description: 'Daily Elegance', purity: '14k', image: img14k },
    ];

    const silverSubCategories = [
        { id: 'sterling', name: 'Sterling Silver', description: '925 Hallmarked', purity: 'sterling', image: imgSterling },
        { id: 'silver', name: 'Fine Silver', description: 'Pure & Simple', purity: 'pure', image: imgSilver },
    ];

    const finalMenuProducts = useMemo(() => {
        if (!menuSelectedCategory) return [];
        return COLLECTION_MOCK_PRODUCTS[menuSelectedCategory.purity] || [];
    }, [menuSelectedCategory]);

    return (
        <div className="animate-in fade-in duration-300">
            <div className="flex items-center gap-4 mb-6 border-b border-gray-50 pb-4">
                {menuViewLevel !== 'METALS' && (
                    <button 
                        onClick={() => {
                            if (menuViewLevel === 'PRODUCTS') setMenuViewLevel('CATEGORIES');
                            else setMenuViewLevel('METALS');
                        }}
                        className="p-1.5 bg-gray-50 rounded-full text-[#9C5B61] hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                )}
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#9C5B61]">
                    {menuViewLevel === 'METALS' && "Explore Metal Collections"}
                    {menuViewLevel === 'CATEGORIES' && `${menuSelectedMetal} PURITIES`}
                    {menuViewLevel === 'PRODUCTS' && `${menuSelectedCategory.name}`}
                </h3>
            </div>

            <AnimatePresence mode="wait">
                {menuViewLevel === 'METALS' && (
                    <motion.div key="m_metals" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
                        <div onClick={() => { setMenuSelectedMetal('gold'); setMenuViewLevel('CATEGORIES'); }} className="group relative h-[100px] rounded-xl overflow-hidden cursor-pointer border border-gray-100 shadow-sm transition-all hover:border-[#9C5B61]/20">
                            <img src={goldBanner} alt="Gold" className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                            <div className="absolute inset-x-8 inset-y-0 flex flex-col justify-center text-white">
                                <h4 className="text-xl font-bold uppercase tracking-widest">Gold Collection</h4>
                                <p className="text-[9px] font-medium uppercase tracking-widest text-[#D4AF37] mt-1">Pure 24K • 22K • 18K • 14K</p>
                            </div>
                            <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 text-white w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <div onClick={() => { setMenuSelectedMetal('silver'); setMenuViewLevel('CATEGORIES'); }} className="group relative h-[100px] rounded-xl overflow-hidden cursor-pointer border border-gray-100 shadow-sm transition-all hover:border-[#9C5B61]/20">
                            <img src={silverBanner} alt="Silver" className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                            <div className="absolute inset-x-8 inset-y-0 flex flex-col justify-center text-white">
                                <h4 className="text-xl font-bold uppercase tracking-widest">Silver Collection</h4>
                                <p className="text-[9px] font-medium uppercase tracking-widest text-gray-300 mt-1">925 Sterling • Fine Silver</p>
                            </div>
                            <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 text-white w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </motion.div>
                )}

                {menuViewLevel === 'CATEGORIES' && (
                    <motion.div key="m_cats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-4 gap-4">
                        {(menuSelectedMetal === 'gold' ? goldSubCategories : silverSubCategories).map((cat) => (
                            <div key={cat.id} onClick={() => { setMenuSelectedCategory(cat); setMenuViewLevel('PRODUCTS'); }} className="group bg-white rounded-xl p-3 cursor-pointer border border-gray-50 hover:border-[#9C5B61]/20 text-center transition-all shadow-sm">
                                <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-gray-50">
                                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <h5 className="text-[11px] font-bold uppercase tracking-wide text-black">{cat.name}</h5>
                                <p className="text-[8px] text-gray-400 uppercase tracking-widest mt-0.5">{cat.description}</p>
                            </div>
                        ))}
                    </motion.div>
                )}

                {menuViewLevel === 'PRODUCTS' && (
                    <motion.div key="m_prods" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-4 gap-6">
                        {finalMenuProducts.map((p) => (
                            <div key={p.id} className="flex flex-col items-center group text-center cursor-pointer" onClick={() => { navigate(`/product/${p.id}`); resetMenu(); }}>
                                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-sm group-hover:shadow-md group-hover:translate-y-[-2px] transition-all duration-300">
                                    <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                </div>
                                <h5 className="text-[9px] font-bold uppercase tracking-tight text-black mt-3">{p.name}</h5>
                                <p className="text-[9px] text-[#9C5B61] font-bold mt-0.5">₹ {p.price.toLocaleString()}</p>
                            </div>
                        ))}
                        <div className="col-span-full flex justify-center mt-4">
                            <Link to="/shop" onClick={resetMenu} className="text-[9px] font-bold uppercase tracking-widest text-[#9C5B61] hover:text-black transition-colors flex items-center gap-1">
                                View Full Collection <MoveRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AllJewelleryMenu;
