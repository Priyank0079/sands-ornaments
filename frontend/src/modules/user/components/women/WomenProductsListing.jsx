import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, ShoppingBag, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../../../../context/ShopContext';
import toast from 'react-hot-toast';

import prod1 from '../../assets/prod_ring_main.png';
import prod2 from '../../assets/cat_earrings.png';
import prod3 from '../../assets/cat_rings.png';
import prod4 from '../../assets/cat_bracelets.png';
import prod5 from '../../assets/new_launch_anklets.png';
import prod6 from '../../assets/premium_ring_product.png';
import prod7 from '../../assets/trending_modern.png';
import prod8 from '../../assets/cat_chain_wine.png';

const dummyProducts = [
    {
        id: 'w1',
        name: "Rose Glow Sterling Drop Earrings",
        price: "1,899",
        originalPrice: "3,299",
        discountPrice: "1,699",
        image: prod2,
        rating: 4.8,
        reviews: 245,
        badge: "Trending",
    },
    {
        id: 'w2',
        name: "Eternal Blossom Pendant Necklace",
        price: "2,499",
        originalPrice: "4,199",
        discountPrice: "2,249",
        image: prod7,
        rating: 4.9,
        reviews: 180,
        badge: "Bestseller",
    },
    {
        id: 'w3',
        name: "Infinite Love Stackable Silver Ring",
        price: "1,299",
        originalPrice: "2,499",
        discountPrice: "1,169",
        image: prod1,
        rating: 4.6,
        reviews: 92,
        badge: "New",
    },
    {
        id: 'w4',
        name: "Shimmering Triple-Link Bracelet",
        price: "3,199",
        originalPrice: "5,800",
        discountPrice: "2,879",
        image: prod4,
        rating: 4.7,
        reviews: 156,
        badge: "Exclusive",
    },
    {
        id: 'w5',
        name: "Crystal Starlight Silver Anklet",
        price: "1,499",
        originalPrice: "2,699",
        discountPrice: "1,349",
        image: prod5,
        rating: 4.5,
        reviews: 64,
        badge: "Trending",
    },
    {
        id: 'w6',
        name: "Serene Moissanite Solitaire Ring",
        price: "4,599",
        originalPrice: "7,999",
        discountPrice: "4,139",
        image: prod6,
        rating: 5.0,
        reviews: 310,
        badge: "Eco-Lux",
    },
    {
        id: 'w7',
        name: "Layered Gold-Dip Zodiac Necklace",
        price: "2,799",
        originalPrice: "4,500",
        discountPrice: "2,519",
        image: prod7,
        rating: 4.4,
        reviews: 87,
        badge: "New",
    },
    {
        id: 'w8',
        name: "Classic 925 Sterling Rope Chain",
        price: "2,199",
        originalPrice: "3,800",
        discountPrice: "1,979",
        image: prod8,
        rating: 4.7,
        reviews: 115,
        badge: "Luxury",
    }
];

const PINK = '#E8638A';
const PINK_BG = '#FFF0F4';

const WomenProductsListing = () => {
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
        toast.success(`${product.name} added to your bag!`, {
            style: { background: PINK, color: '#fff', fontSize: '12px' },
            icon: '💖'
        });
        setTimeout(() => navigate('/cart'), 800);
    };

    return (
        <section className="py-6 md:py-10" style={{ background: PINK_BG }}>
            <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">

                {/* Section Header */}
                <div className="text-center mb-6 md:mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
                        style={{ background: `${PINK}22`, border: `1px solid ${PINK}44` }}
                    >
                        <Sparkles className="w-3.5 h-3.5" style={{ color: PINK }} />
                        <span className="text-xs font-black uppercase tracking-widest" style={{ color: PINK }}>For Her</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-serif text-zinc-900 tracking-tight mb-3"
                    >
                        Women's <span className="italic" style={{ color: PINK }}>Exclusives</span>
                    </motion.h2>
                    <div className="w-20 h-1 mx-auto rounded-full" style={{ background: PINK }} />
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
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
                            <div className="relative aspect-square bg-[#F9F9F9] overflow-hidden mb-3" onClick={() => navigate(`/product/${product.id}`)}>
                                {/* Ribbon */}
                                {idx < 3 && (
                                    <div className="absolute top-0 left-0 z-20">
                                        <div className="bg-[#E8638A] text-white text-[10px] font-bold px-3 py-1 flex items-center relative overflow-visible">
                                            Bestseller
                                            {/* Flag cutout effect */}
                                            <div className="absolute top-0 -right-2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[10px] border-[#E8638A]"></div>
                                        </div>
                                    </div>
                                )}
                                
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                                />
                                
                                {/* Wishlist */}
                                <button className="absolute top-4 right-4 z-10 p-1.5 rounded-full hover:bg-white/80 transition-all">
                                    <Heart className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                                </button>

                                {/* Rating Badge */}
                                <div className="absolute bottom-3 left-3 bg-[#F3F4F6]/90 backdrop-blur-sm px-2 py-0.5 rounded flex items-center gap-1 text-[10px] md:text-xs font-medium text-gray-700 shadow-sm">
                                    {product.rating} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    <span className="text-gray-300 mx-0.5">|</span>
                                    {product.reviews}
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="flex flex-col px-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-base md:text-lg font-bold text-gray-900">₹{product.price}</span>
                                    <span className="text-[10px] md:text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                                </div>
                                <h3 className="text-[12px] md:text-[14px] text-gray-600 font-medium mb-1.5 line-clamp-1 leading-tight hover:text-gray-900" onClick={() => navigate(`/product/${product.id}`)}>
                                    {product.name}
                                </h3>

                                {/* Promo Text */}
                                <p className="text-[10px] md:text-[11px] font-bold text-[#1E3A8A] mb-3 uppercase tracking-tight">
                                    {idx % 2 === 0 ? 'PRICE DROP!' : 'EXTRA 15% OFF with coupon'}
                                </p>

                                {/* CTA Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart(product);
                                    }}
                                    className="w-full py-2.5 rounded-md font-bold text-[11px] md:text-[13px] text-gray-700 transition-all duration-300 transform active:scale-95 shadow-sm"
                                    style={{ background: '#FFE1E6' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#FFD1D9'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#FFE1E6'}
                                >
                                    Add to Cart
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
                        onClick={() => navigate('/shop?category=women')}
                        className="px-12 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all shadow-lg hover:shadow-xl text-white"
                        style={{ background: PINK }}
                    >
                        Explore All Women's Jewellery →
                    </motion.button>
                </div>
            </div>
        </section>
    );
};

export default WomenProductsListing;
