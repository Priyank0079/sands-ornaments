import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, ShoppingBag, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../../../../context/ShopContext';
import toast from 'react-hot-toast';

import mProd1 from '../../assets/men_prod_ring.png';
import mProd2 from '../../assets/men_prod_pendant.png';
import mProd3 from '../../assets/men_prod_ring.png';
import mProd4 from '../../assets/men_prod_bracelet.png';
import mProd5 from '../../assets/men_prod_chain.png';
import mProd6 from '../../assets/men_prod_stud.png';
import mProd7 from '../../assets/men_prod_ring.png';
import mProd8 from '../../assets/men_prod_bracelet.png';

const dummyProducts = [
    {
        id: 'p1',
        name: "Silver Fibonacci Flow Ring For Him",
        price: "2,899",
        originalPrice: "4,699",
        discountPrice: "1,739",
        image: mProd1,
        rating: 4.6,
        reviews: 107,
        badge: "New Arrival",
    },
    {
        id: 'p2',
        name: "Silver Anjaneya Pendant With Box Chain",
        price: "3,799",
        originalPrice: "6,199",
        discountPrice: "2,279",
        image: mProd2,
        rating: 4.6,
        reviews: 100,
        badge: "",
    },
    {
        id: 'p3',
        name: "Silver Classic Band For Him",
        price: "3,499",
        originalPrice: "5,499",
        discountPrice: "2,099",
        image: mProd3,
        rating: 3.8,
        reviews: 51,
        badge: "",
    },
    {
        id: 'p4',
        name: "Silver Trooper Bracelet For Him",
        price: "4,199",
        originalPrice: "6,999",
        discountPrice: "2,519",
        image: mProd4,
        rating: 4.9,
        reviews: 215,
        badge: "Bestseller",
    },
    {
        id: 'p5',
        name: "Silver Statement Link Chain",
        price: "6,599",
        originalPrice: "9,999",
        discountPrice: "3,959",
        image: mProd5,
        rating: 4.8,
        reviews: 84,
        badge: "Luxury",
    },
    {
        id: 'p6',
        name: "Silver Classic Cufflinks Set",
        price: "2,999",
        originalPrice: "4,500",
        discountPrice: "1,799",
        image: mProd6,
        rating: 4.5,
        reviews: 42,
        badge: "Trending",
    },
    {
        id: 'p7',
        name: "Oxidized Warrior Ring For Men",
        price: "1,899",
        originalPrice: "2,999",
        discountPrice: "1,139",
        image: mProd7,
        rating: 4.3,
        reviews: 67,
        badge: "",
    },
    {
        id: 'p8',
        name: "Silver Minimalist Anchor Bracelet",
        price: "3,150",
        originalPrice: "4,800",
        discountPrice: "1,890",
        image: mProd8,
        rating: 4.7,
        reviews: 130,
        badge: "",
    }
];

const ACCENT = '#7A2E3A'; // Wine
const ACCENT_DARK = '#3B2516'; // Dark Brown
const BG_COLOR = '#FDF5F6'; // Luxury Beige
const GOLD = '#C9A24D';

const MenProductsListing = () => {
    const navigate = useNavigate();
    const { addToCart, products } = useContext(ShopContext);

    const handleAddToCart = (product) => {
        const realProduct = products.find(p => p.id === product.id || p.name === product.name);
        if (realProduct) {
            addToCart(realProduct);
        } else {
            const mockToCart = {
                ...product,
                _id: product.id,
                price: parseFloat(product.price.replace(',', '')),
                originalPrice: parseFloat(product.originalPrice.replace(',', '')),
                finalPrice: parseFloat(product.discountPrice.replace(',', '')),
                variants: [{ id: product.id + '-v1', price: parseFloat(product.price.replace(',', '')) }]
            };
            addToCart(mockToCart);
        }
        setTimeout(() => navigate('/cart'), 500);
    };

    return (
        <section className="py-4 md:py-16" style={{ background: BG_COLOR }}>
            <div className="container mx-auto px-4 md:px-8 max-w-[1200px]">

                {/* Section Header */}
                <div className="text-center mb-4 md:mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
                        style={{ background: `${ACCENT}22`, border: `1px solid ${ACCENT}44` }}
                    >
                        <Zap className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                        <span className="text-xs font-black uppercase tracking-widest" style={{ color: ACCENT }}>For Him</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-serif text-zinc-900 tracking-tight mb-3"
                    >
                        Men's <span className="italic" style={{ color: ACCENT }}>Exclusives</span>
                    </motion.h2>
                    <div className="w-20 h-1 mx-auto rounded-full" style={{ background: ACCENT }} />
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-8">
                    {dummyProducts.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.05 }}
                            className="bg-white group cursor-pointer"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-square bg-[#FBFBFB] overflow-hidden mb-1.5 md:mb-3" onClick={() => navigate(`/product/${product.id}`)}>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-2 md:p-4 transition-transform duration-700 group-hover:scale-105"
                                />
                                
                                {/* Wishlist */}
                                <button className="absolute top-3 right-3 z-10 p-1.5 rounded-full hover:bg-white/80 transition-all">
                                    <Heart className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                                </button>

                                {/* Rating Badge */}
                                <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 bg-[#F3F4F6]/90 backdrop-blur-sm px-1.5 py-0.5 md:px-2 md:py-0.5 rounded flex items-center gap-0.5 md:gap-1 text-[8px] md:text-xs font-medium text-gray-700 shadow-sm">
                                    {product.rating} <Star className="w-2 h-2 md:w-3 md:h-3 fill-amber-400 text-amber-400" />
                                    <span className="text-gray-300 mx-0.5">|</span>
                                    {product.reviews}
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="flex flex-col px-1">
                                <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1">
                                    <span className="text-[13px] md:text-lg font-bold text-gray-900 leading-tight">₹{product.price}</span>
                                    <span className="text-[9px] md:text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                                </div>
                                <h3 className="text-[10px] md:text-[14px] text-gray-600 font-medium mb-1 md:mb-1.5 line-clamp-1 leading-tight hover:text-gray-900" onClick={() => navigate(`/product/${product.id}`)}>
                                    {product.name}
                                </h3>

                                {/* Promo Text */}
                                <p className="text-[8px] md:text-[11px] font-bold text-[#2B6CB0] mb-1.5 md:mb-3 leading-tight">
                                    {idx % 2 === 0 ? `EXTRA 20% OFF with coupon` : `Get it for ₹${product.discountPrice} with coupon`}
                                </p>

                                {/* CTA Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart(product);
                                    }}
                                    className="w-full py-1.5 md:py-2.5 rounded-md font-bold text-[9px] md:text-[13px] text-gray-700 transition-all duration-300 transform active:scale-95"
                                    style={{ background: '#FFE1E6' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#FFD1D9'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#FFE1E6'}
                                >
                                    {idx === 1 ? 'Choose options' : 'Add to Cart'}
                                </button>
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
                        onClick={() => navigate('/shop?category=men')}
                        className="px-12 py-4 rounded-full font-bold uppercase tracking-widest text-xs text-white transition-all shadow-lg hover:shadow-xl"
                        style={{ background: ACCENT }}
                    >
                        Explore All Men's Jewellery →
                    </motion.button>
                </div>
            </div>
        </section>
    );
};

export default MenProductsListing;
