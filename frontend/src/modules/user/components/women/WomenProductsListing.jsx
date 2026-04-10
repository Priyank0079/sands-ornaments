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
        <section className="py-12 md:py-24" style={{ background: PINK_BG }}>
            <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">

                {/* Section Header */}
                <div className="text-center mb-10 md:mb-16">
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
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {dummyProducts.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55, delay: (idx % 4) * 0.1 }}
                            className="group relative"
                        >
                            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(232,99,138,0.1)] hover:shadow-[0_16px_40px_rgba(232,99,138,0.22)] transition-all duration-500 flex flex-col h-full border border-pink-50">

                                {/* Top Badge Bar */}
                                {product.badge && (
                                    <div
                                        className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-wider shadow-md"
                                        style={{ background: PINK }}
                                    >
                                        {product.badge}
                                    </div>
                                )}

                                {/* Image */}
                                <div
                                    className="relative aspect-[4/5] overflow-hidden bg-pink-50 cursor-pointer"
                                    onClick={() => navigate(`/product/${product.id}`)}
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-[1.8s] group-hover:scale-110"
                                    />
                                    {/* Wishlist */}
                                    <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow hover:bg-pink-50 transition-colors">
                                        <Heart className="w-3.5 h-3.5 text-gray-400 group-hover:text-pink-500 transition-colors" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-4 md:p-5 flex flex-col flex-grow">
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
                                        className="text-sm font-bold text-gray-800 mb-3 line-clamp-2 leading-snug cursor-pointer hover:text-pink-500 transition-colors"
                                        onClick={() => navigate(`/product/${product.id}`)}
                                    >
                                        {product.name}
                                    </h3>

                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-xl font-black text-zinc-900">₹{product.price}</span>
                                        <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                                    </div>

                                    {/* CTA */}
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="mt-auto w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 text-white"
                                        style={{ background: PINK }}
                                        onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                    >
                                        <ShoppingBag className="w-3.5 h-3.5" />
                                        Add to Bag
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
