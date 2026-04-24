import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft, Heart, ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';
import { COLLECTION_MOCK_PRODUCTS } from '../data/mockCollectionData.js';

// Import diverse assets for categories
import goldBanner from '@assets/banner_party.png'; 
import silverBanner from '@assets/banner_office.png';

// Sub-category images (Gold)
import img24k from '@assets/cat_pendant.png';
import img22k from '@assets/cat_rings.png';
import img18k from '@assets/cat_bracelets.png';
import img14k from '@assets/cat_earrings.png';

// Sub-category images (Silver)
import imgSterling from '@assets/silver_earrings_product.png';
import imgSilver from '@assets/cat_anklets.png';

import Loader from '../../shared/components/Loader';

const JewelleryCollectionsPage = () => {
    const { products, categories, activeMetal } = useShop();
    const [viewLevel, setViewLevel] = useState('CATEGORIES');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, [activeMetal]);

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

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setViewLevel('PRODUCTS');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goBack = () => {
        if (viewLevel === 'PRODUCTS') {
            setViewLevel('CATEGORIES');
            setSelectedCategory(null);
        }
    };

    const filteredProducts = useMemo(() => {
        let list = products.filter(p => {
            const metalMatch = String(p.metal || '').toLowerCase() === String(activeMetal || '').toLowerCase();
            const purityMatch = String(p.purity || '').toLowerCase().includes(String(selectedCategory?.purity || '').toLowerCase());
            return metalMatch && (selectedCategory?.purity ? purityMatch : true);
        }).map(p => ({
            ...p,
            id: p._id || p.id,
            displayPrice: p.salePrice || p.price || 0,
            displayImage: p.images?.[0] || p.image || null
        }));

        if (selectedCategory?.purity) {
            const mocks = COLLECTION_MOCK_PRODUCTS[selectedCategory.purity] || [];
            const processedMocks = mocks.map(m => ({
                id: m.id,
                name: m.name,
                displayPrice: m.price,
                displayImage: m.img,
                isMock: true
            }));
            
            list = [...processedMocks, ...list];
        }

        if (list.length === 0 && activeMetal) {
             list = products.filter(p => String(p.metal || '').toLowerCase() === String(activeMetal || '').toLowerCase()).map(p => ({
                ...p,
                id: p._id || p.id,
                displayPrice: p.salePrice || p.price || 0,
                displayImage: p.images?.[0] || p.image || null
            }));
        }
        
        return list.slice(0, 12); 
    }, [products, selectedCategory, activeMetal]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { y: 10, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-[#FDF5F6] pt-8 pb-20 px-4 md:px-8 font-sans">
            <div className="container mx-auto max-w-6xl">
                
                {/* Clean Header with Back Button */}
                <div className="flex items-center gap-5 mb-12">
                    <button 
                        onClick={goBack}
                        className="w-10 h-10 flex items-center justify-center bg-[#FFF0F3] rounded-full text-[#8E2B45] hover:bg-[#FFE0E6] transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-[16px] md:text-[18px] font-medium text-[#8E2B45] uppercase tracking-[0.4em]">
                        {viewLevel === 'CATEGORIES' ? `${activeMetal} Purities`.toUpperCase() : `${selectedCategory.name}`.toUpperCase()}
                    </h1>
                </div>

                <AnimatePresence mode="wait">
                    {viewLevel === 'CATEGORIES' && (
                        <motion.div 
                            key="categories"
                            variants={containerVariants}
                            initial={{ opacity: 0, y: 15 }}
                            animate="visible"
                            exit={{ opacity: 0, y: -15 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
                        >
                            {(activeMetal === 'gold' ? goldSubCategories : silverSubCategories).map((cat) => (
                                <motion.div
                                    key={cat.id}
                                    variants={itemVariants}
                                    onClick={() => handleCategoryClick(cat)}
                                    className="group relative aspect-[1/1.2] rounded-[24px] overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-700"
                                >
                                    {/* Full-Bleed Image with Slow Zoom */}
                                    <img 
                                        src={cat.image} 
                                        alt={cat.name} 
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                                    />
                                    
                                    {/* Cinematic Bottom Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Simple, Elegant Content Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-start">
                                        <h3 className="text-white text-xl md:text-2xl font-medium tracking-tight mb-3">
                                            {cat.name}
                                        </h3>
                                        
                                        <div className="flex items-center gap-4">
                                            <span className="text-white/80 text-[10px] md:text-[11px] uppercase font-bold tracking-[0.2em]">
                                                {cat.description}
                                            </span>
                                            <div className="h-[1px] w-0 bg-white/50 group-hover:w-12 transition-all duration-700 ease-out" />
                                        </div>
                                    </div>

                                    {/* Subtle Overlay Border */}
                                    <div className="absolute inset-0 border border-white/10 rounded-[24px] pointer-events-none" />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {viewLevel === 'PRODUCTS' && (
                        <motion.div 
                            key="products"
                            variants={containerVariants}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate="visible"
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10"
                        >
                            {filteredProducts.map((p) => (
                                <motion.div
                                    key={p.id}
                                    variants={itemVariants}
                                    className="flex flex-col items-center text-center group"
                                >
                                    <Link to={`/product/${p.id}`} className="flex flex-col items-center w-full">
                                        <div className="relative mb-4">
                                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                                                <img src={p.displayImage || 'https://via.placeholder.com/300'} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            </div>
                                        </div>
                                        <h4 className="text-[10px] md:text-xs font-bold text-black uppercase tracking-wide line-clamp-1 group-hover:text-[#9C5B61] transition-colors">{p.name}</h4>
                                        <p className="text-[9px] md:text-[10px] font-bold text-[#9C5B61] mt-1 tracking-widest">₹ {p.displayPrice?.toLocaleString()}</p>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            {/* Custom Styles to match Navbar */}
            <style dangerouslySetInnerHTML={{ __html: `
                .font-body {
                    font-family: 'Lato', sans-serif;
                }
            `}} />
        </div>
    );
};

export default JewelleryCollectionsPage;

