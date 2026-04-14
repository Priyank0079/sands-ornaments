import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, ShoppingBag, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../../../../context/ShopContext';
import toast from 'react-hot-toast';
import { buildFamilyShopPath } from '../../utils/familyNavigation';

import fProd1 from '../../assets/nav_gift_kids.png';
import fProd2 from '../../assets/nav_gift_women.png';
import fProd3 from '../../assets/nav_gift_couple.png';
import fProd4 from '../../assets/nav_gift_kids.png';
import fProd5 from '../../assets/cat_anklets.png';
import fProd6 from '../../assets/nav_gift_kids.png';
import fProd7 from '../../assets/trending_heritage.png';
import fProd8 from '../../assets/nav_gift_girls.png';

const familyProducts = [
    {
        id: 'f1',
        name: "Tiny Sparkle Kids Silver Studs",
        price: "1,299",
        originalPrice: "2,499",
        discountPrice: "1,039",
        image: fProd1,
        rating: 4.7,
        reviews: 132,
        badge: "Kids' Fave",
    },
    {
        id: 'f2',
        name: "Mother-Daughter Bloom Lockets",
        price: "4,299",
        originalPrice: "7,500",
        discountPrice: "3,439",
        image: fProd2,
        rating: 4.9,
        reviews: 208,
        badge: "Limited Edition",
    },
    {
        id: 'f3',
        name: "Eternal Bond Couple Ring Set",
        price: "8,999",
        originalPrice: "15,000",
        discountPrice: "7,199",
        image: fProd3,
        rating: 4.9,
        reviews: 341,
        badge: "Bestseller",
    },
    {
        id: 'f4',
        name: "Little Prince Silver Bracelet",
        price: "1,899",
        originalPrice: "3,200",
        discountPrice: "1,519",
        image: fProd4,
        rating: 4.6,
        reviews: 79,
        badge: "Gift Ready",
    },
    {
        id: 'f5',
        name: "Petite Heart Anklet for Girls",
        price: "999",
        originalPrice: "1,800",
        discountPrice: "799",
        image: fProd5,
        rating: 4.5,
        reviews: 55,
        badge: "Top Pick",
    },
    {
        id: 'f6',
        name: "Guardian Angel Baby Silver Pin",
        price: "2,499",
        originalPrice: "4,500",
        discountPrice: "1,999",
        image: fProd6,
        rating: 4.8,
        reviews: 91,
        badge: "Essentials",
    },
    {
        id: 'f7',
        name: "Family Tree Heritage Pendant",
        price: "3,599",
        originalPrice: "5,800",
        discountPrice: "2,879",
        image: fProd7,
        rating: 4.7,
        reviews: 114,
        badge: "Heirloom",
    },
    {
        id: 'f8',
        name: "Infinite Love Parent-Child Set",
        price: "5,199",
        originalPrice: "9,200",
        discountPrice: "4,159",
        image: fProd8,
        rating: 4.8,
        reviews: 176,
        badge: "New Arrival",
    }
];

const GOLD = '#D97706';
const GOLD_LIGHT = '#FEF3C7';
const GOLD_BG = '#FFFBEB';

const FamilyProductsListing = () => {
    const navigate = useNavigate();
    const { addToCart } = useContext(ShopContext);

    const handleAddToCart = (product) => {
        const mockProduct = {
            ...product,
            _id: product.id,
            price: parseFloat(product.price.replace(',', '')),
            variants: [{ id: product.id + '-v1', price: parseFloat(product.price.replace(',', '')) }]
        };
        addToCart(mockProduct);
        toast.success(`${product.name} added to your bag!`, {
            style: { background: GOLD, color: '#fff', fontSize: '12px' },
            icon: '🏠'
        });
        setTimeout(() => navigate('/cart'), 800);
    };

    return (
        <section className="py-12 md:py-24" style={{ background: GOLD_BG }}>
            <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">

                {/* Section Header */}
                <div className="text-center mb-10 md:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
                        style={{ background: `${GOLD}22`, border: `1px solid ${GOLD}44` }}
                    >
                        <Gift className="w-3.5 h-3.5" style={{ color: GOLD }} />
                        <span className="text-xs font-black uppercase tracking-widest" style={{ color: GOLD }}>For Family</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-serif text-zinc-900 tracking-tight mb-3"
                    >
                        Family <span className="italic" style={{ color: GOLD }}>Collections</span>
                    </motion.h2>
                    <div className="w-20 h-1 mx-auto rounded-full" style={{ background: GOLD }} />
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {familyProducts.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55, delay: (idx % 4) * 0.1 }}
                            className="group relative"
                        >
                            <div
                                className="bg-white rounded-2xl overflow-hidden transition-all duration-500 flex flex-col h-full border border-amber-50"
                                style={{ boxShadow: '0 4px 20px rgba(217,119,6,0.08)' }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 16px 40px rgba(217,119,6,0.2)'}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(217,119,6,0.08)'}
                            >
                                {/* Badge */}
                                {product.badge && (
                                    <div
                                        className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-wider shadow"
                                        style={{ background: GOLD }}
                                    >
                                        {product.badge}
                                    </div>
                                )}

                                {/* Image */}
                                <div
                                    className="relative aspect-[4/5] overflow-hidden cursor-pointer"
                                    style={{ background: GOLD_LIGHT }}
                                    onClick={() => navigate(`/product/${product.id}`)}
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-[1.8s] group-hover:scale-110"
                                    />
                                    <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow hover:bg-amber-50 transition-colors">
                                        <Heart className="w-3.5 h-3.5 text-gray-400 group-hover:text-amber-500 transition-colors" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-grow">
                                    {/* Rating */}
                                    <div className="flex items-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                                            />
                                        ))}
                                        <span className="text-[10px] text-gray-400 ml-1">({product.reviews})</span>
                                    </div>

                                    <h3
                                        className="text-sm font-bold text-gray-800 mb-3 line-clamp-2 leading-snug cursor-pointer hover:text-amber-600 transition-colors"
                                        onClick={() => navigate(`/product/${product.id}`)}
                                    >
                                        {product.name}
                                    </h3>

                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-xl font-black text-zinc-900">₹{product.price}</span>
                                        <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                                    </div>

                                    <p className="text-xs text-gray-400 mb-4">Explore legacy gift ideas for your loved ones</p>

                                    {/* CTA */}
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="mt-auto w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 text-white"
                                        style={{ background: GOLD }}
                                        onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                    >
                                        <ShoppingBag className="w-3.5 h-3.5" />
                                        Shop Now
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Explore Button */}
                <div className="mt-10 md:mt-16 text-center">
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        onClick={() => navigate(buildFamilyShopPath({ recipient: 'all' }))}
                        className="px-12 py-4 rounded-full font-bold uppercase tracking-widest text-xs text-white transition-all shadow-lg hover:shadow-xl"
                        style={{ background: GOLD }}
                    >
                        Explore All Family Collections →
                    </motion.button>
                </div>
            </div>
        </section>
    );
};

export default FamilyProductsListing;
