import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft, Heart, ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';
import { COLLECTION_MOCK_PRODUCTS } from '../data/mockCollectionData.js';

// Import diverse assets for categories
import goldBanner from '../assets/banner_party.png'; 
import silverBanner from '../assets/banner_office.png';

// Sub-category images (Gold)
import img24k from '../assets/cat_pendant.png';
import img22k from '../assets/cat_rings.png';
import img18k from '../assets/cat_bracelets.png';
import img14k from '../assets/cat_earrings.png';

// Sub-category images (Silver)
import imgSterling from '../assets/silver_earrings_product.png';
import imgSilver from '../assets/cat_anklets.png';

const JewelleryCollectionsPage = () => {
    const { products, categories, activeMetal } = useShop();
    const [viewLevel, setViewLevel] = useState('CATEGORIES');
    const [selectedCategory, setSelectedCategory] = useState(null);

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
        <div className="min-h-screen bg-[#FDF5F6] pt-6 pb-20 px-4 md:px-8 font-body">
            <div className="container mx-auto max-w-5xl">
                
                <div className="flex items-center gap-4 mb-8">
                    {viewLevel !== 'CATEGORIES' && (
                        <button 
                            onClick={goBack}
                            className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-[#9C5B61]"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                    )}
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-black uppercase tracking-wider">
                            {viewLevel === 'CATEGORIES' && `${activeMetal} Collection`}
                            {viewLevel === 'PRODUCTS' && `${selectedCategory.name}`}
                        </h1>
                        <nav className="flex items-center gap-2 mt-1 text-[10px] font-medium uppercase tracking-widest text-gray-500">
                            <span>Home</span>
                            <ChevronRight className="w-2.5 h-2.5" />
                            <span className={`cursor-pointer ${viewLevel === 'CATEGORIES' ? 'text-[#9C5B61]' : ''}`} onClick={() => setViewLevel('CATEGORIES')}>All Jewellery</span>
                            {activeMetal && (
                                <>
                                    <ChevronRight className="w-2.5 h-2.5" />
                                    <span className={viewLevel === 'CATEGORIES' ? 'text-[#9C5B61]' : ''}>{activeMetal}</span>
                                </>
                            )}
                        </nav>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {viewLevel === 'CATEGORIES' && (
                        <motion.div 
                            key="categories"
                            variants={containerVariants}
                            initial={{ opacity: 0, x: 10 }}
                            animate="visible"
                            exit={{ opacity: 0, x: -10 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-4"
                        >
                            {(activeMetal === 'gold' ? goldSubCategories : silverSubCategories).map((cat) => (
                                <motion.div
                                    key={cat.id}
                                    variants={itemVariants}
                                    onClick={() => handleCategoryClick(cat)}
                                    className="group bg-white rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all border border-gray-100 p-3"
                                >
                                    <div className="aspect-square relative overflow-hidden rounded-xl bg-gray-50 mb-3">
                                        <img 
                                            src={cat.image} 
                                            alt={cat.name} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <h3 className="text-xs md:text-sm font-bold text-black uppercase tracking-wide text-center">{cat.name}</h3>
                                    <p className="text-[8px] md:text-[9px] font-medium text-gray-400 uppercase tracking-widest text-center mt-0.5">{cat.description}</p>
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
