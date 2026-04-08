import React, { useMemo, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MoveRight, ArrowLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Assets
import goldBanner from '../../assets/banner_party.png'; 
import silverBanner from '../../assets/banner_office.png';
import img24k from '../../assets/cat_pendant.png';
import img22k from '../../assets/cat_rings.png';
import img18k from '../../assets/cat_bracelets.png';
import img14k from '../../assets/cat_earrings.png';
import imgSterling from '../../assets/silver_earrings_product.png';
import imgSilver from '../../assets/cat_anklets.png';

import { COLLECTION_MOCK_PRODUCTS } from '../../data/mockCollectionData.js';

/* ─────────────────── Ripple Hook ─────────────────── */
function useRipple() {
    const [ripples, setRipples] = useState([]);
    const idRef = useRef(0);

    const createRipple = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = ++idRef.current;
        setRipples((prev) => [...prev, { id, x, y }]);
        setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
    };

    const RippleContainer = () => (
        <>
            {ripples.map((r) => (
                <span
                    key={r.id}
                    style={{ left: r.x, top: r.y }}
                    className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/40 animate-ping"
                />
            ))}
        </>
    );

    return { createRipple, RippleContainer };
}

/* ─────────────────── ClickCard: metal banner ─────────────────── */
const MetalCard = ({ imgSrc, alt, title, subtitle, subtitleColor, onClick }) => {
    const { createRipple, RippleContainer } = useRipple();

    return (
        <div
            onClick={(e) => { createRipple(e); onClick(); }}
            className="group relative h-[100px] rounded-xl overflow-hidden cursor-pointer border border-gray-100 shadow-sm transition-all hover:border-[#9C5B61]/30 hover:shadow-lg select-none"
        >
            <img src={imgSrc} alt={alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
            <div className="absolute inset-x-8 inset-y-0 flex flex-col justify-center text-white">
                <h4 className="text-xl font-bold uppercase tracking-widest">{title}</h4>
                <p className={`text-[9px] font-medium uppercase tracking-widest mt-1 ${subtitleColor}`}>{subtitle}</p>
            </div>
            <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 text-white w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            {/* click ripple */}
            <RippleContainer />
        </div>
    );
};

/* ─────────────────── ClickCard: purity thumbnail ─────────────────── */
const PurityCard = ({ cat, onClick }) => {
    const { createRipple, RippleContainer } = useRipple();

    return (
        <div
            onClick={(e) => { createRipple(e); onClick(); }}
            className="group relative bg-white rounded-xl p-3 cursor-pointer border border-gray-50 hover:border-[#9C5B61]/30 text-center transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 select-none overflow-hidden"
        >
            <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-gray-50">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h5 className="text-[11px] font-bold uppercase tracking-wide text-black">{cat.name}</h5>
            <p className="text-[8px] text-gray-400 uppercase tracking-widest mt-0.5">{cat.description}</p>
            <RippleContainer />
        </div>
    );
};

/* ─────────────────── ClickCard: product circle ─────────────────── */
const ProductCard = ({ product, onClick }) => {
    const { createRipple, RippleContainer } = useRipple();

    return (
        <div
            onClick={(e) => { createRipple(e); onClick(); }}
            className="relative flex flex-col items-center group text-center cursor-pointer select-none overflow-hidden rounded-xl p-2 hover:bg-gray-50 transition-colors duration-200"
        >
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300">
                <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h5 className="text-[9px] font-bold uppercase tracking-tight text-black mt-3">{product.name}</h5>
            <p className="text-[9px] text-[#9C5B61] font-bold mt-0.5">₹ {product.price.toLocaleString()}</p>
            <RippleContainer />
        </div>
    );
};

/* ─────────────────── Main Menu ─────────────────── */
const AllJewelleryMenu = ({
    menuViewLevel,
    setMenuViewLevel,
    menuSelectedMetal,
    setMenuSelectedMetal,
    menuSelectedCategory,
    setMenuSelectedCategory,
    resetMenu,
}) => {
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
            {/* ── header breadcrumb ── */}
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
                    {menuViewLevel === 'METALS' && 'Explore Metal Collections'}
                    {menuViewLevel === 'CATEGORIES' && `${menuSelectedMetal} PURITIES`}
                    {menuViewLevel === 'PRODUCTS' && `${menuSelectedCategory?.name}`}
                </h3>
            </div>

            <AnimatePresence mode="wait">
                {/* ── LEVEL 1: Gold & Silver banners ── */}
                {menuViewLevel === 'METALS' && (
                    <motion.div
                        key="m_metals"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-3"
                    >
                        <MetalCard
                            imgSrc={goldBanner}
                            alt="Gold"
                            title="Gold Collection"
                            subtitle="Pure 24K • 22K • 18K • 14K"
                            subtitleColor="text-[#D4AF37]"
                            onClick={() => { setMenuSelectedMetal('gold'); setMenuViewLevel('CATEGORIES'); }}
                        />
                        <MetalCard
                            imgSrc={silverBanner}
                            alt="Silver"
                            title="Silver Collection"
                            subtitle="925 Sterling • Fine Silver"
                            subtitleColor="text-gray-300"
                            onClick={() => { setMenuSelectedMetal('silver'); setMenuViewLevel('CATEGORIES'); }}
                        />
                    </motion.div>
                )}

                {/* ── LEVEL 2: Purity variants ── */}
                {menuViewLevel === 'CATEGORIES' && (
                    <motion.div
                        key="m_cats"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-4 gap-4"
                    >
                        {(menuSelectedMetal === 'gold' ? goldSubCategories : silverSubCategories).map((cat) => (
                            <PurityCard
                                key={cat.id}
                                cat={cat}
                                onClick={() => { setMenuSelectedCategory(cat); setMenuViewLevel('PRODUCTS'); }}
                            />
                        ))}
                    </motion.div>
                )}

                {/* ── LEVEL 3: Products ── */}
                {menuViewLevel === 'PRODUCTS' && (
                    <motion.div
                        key="m_prods"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-4 gap-6"
                    >
                        {finalMenuProducts.map((p) => (
                            <ProductCard
                                key={p.id}
                                product={p}
                                onClick={() => { navigate(`/product/${p.id}`); resetMenu(); }}
                            />
                        ))}
                        <div className="col-span-full flex justify-center mt-4">
                            <Link
                                to="/shop"
                                onClick={resetMenu}
                                className="text-[9px] font-bold uppercase tracking-widest text-[#9C5B61] hover:text-black transition-colors flex items-center gap-1"
                            >
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
