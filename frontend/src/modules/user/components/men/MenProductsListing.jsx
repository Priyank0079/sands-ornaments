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
        <section className="py-12 md:py-24" style={{ background: BG_COLOR }}>
            <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">

                {/* Section Header */}
                <div className="text-center mb-10 md:mb-16">
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
                            <div
                                className="bg-white rounded-2xl overflow-hidden transition-all duration-500 flex flex-col h-full border border-blue-50"
                                style={{ boxShadow: '0 4px 20px rgba(37,99,235,0.08)', }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 16px 40px rgba(37,99,235,0.18)'}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,99,235,0.08)'}
                            >
                                {/* Top Quick View Bar */}
                                <div className="hidden md:block w-full py-2 text-center text-white font-bold text-[10px] tracking-[0.2em] uppercase" style={{ background: ACCENT_DARK }}>
                                    Quick View
                                </div>

                                {/* Badge */}
                                {product.badge && (
                                    <div
                                        className="absolute top-2 md:top-10 left-2 md:left-4 z-10 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-white text-[8px] md:text-[10px] font-black uppercase tracking-wider shadow"
                                        style={{ background: ACCENT }}
                                    >
                                        {product.badge}
                                    </div>
                                )}

                                {/* Image */}
                                <div
                                    className="relative aspect-[4/5] overflow-hidden bg-blue-50 cursor-pointer"
                                    onClick={() => navigate(`/product/${product.id}`)}
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-[1.8s] group-hover:scale-110"
                                    />
                                    <button className="absolute top-2 md:top-4 right-2 md:right-4 p-1.5 md:p-2 bg-white/90 rounded-full shadow hover:bg-blue-50 transition-colors">
                                        <Heart className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                    </button>
                                    {/* Rating Badge */}
                                    <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 bg-white/95 backdrop-blur px-1.5 md:px-2.5 py-0.5 md:py-1 flex items-center gap-1 md:gap-1.5 rounded-md md:rounded-lg text-[8px] md:text-[10px] font-bold text-gray-700 shadow">
                                        {product.rating} <Star className="w-2.5 h-2.5 md:w-3 h-3 fill-amber-400 text-amber-400" />
                                        <span className="text-gray-300">|</span> {product.reviews}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-3 md:p-5 flex flex-col flex-grow">
                                    <div className="flex items-baseline gap-1.5 md:gap-2 mb-1 md:mb-2">
                                        <span className="text-base md:text-xl font-black text-zinc-900">₹{product.price}</span>
                                        <span className="text-[10px] md:text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                                    </div>
                                    <h3
                                        className="text-[11px] md:text-sm font-bold text-gray-600 mb-2 md:mb-4 line-clamp-2 leading-snug cursor-pointer transition-colors"
                                        style={{ minHeight: '32px' }}
                                        onClick={() => navigate(`/product/${product.id}`)}
                                        onMouseEnter={e => e.currentTarget.style.color = ACCENT}
                                        onMouseLeave={e => e.currentTarget.style.color = ''}
                                    >
                                        {product.name}
                                    </h3>

                                    {/* Offer box */}
                                    <div className="mt-auto rounded-lg md:rounded-xl p-2 md:p-3 mb-2 md:mb-4 border" style={{ background: `${ACCENT}0D`, borderColor: `${ACCENT}22` }}>
                                        <p className="text-[9px] md:text-[11px] font-extrabold uppercase tracking-wide mb-0.5 md:mb-1" style={{ color: ACCENT }}>Special Offer</p>
                                        <p className="text-gray-600 text-[9px] md:text-[11px]">
                                            Get it for <span className="font-bold text-zinc-900">₹{product.discountPrice}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="px-3 md:px-5 pb-3 md:pb-5">
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="w-full py-2.5 md:py-3.5 font-bold text-[9px] md:text-xs tracking-[0.2em] uppercase rounded-lg md:rounded-xl flex items-center justify-center gap-2 text-white transition-all duration-300"
                                        style={{ background: ACCENT_DARK }}
                                        onMouseEnter={e => e.currentTarget.style.background = ACCENT}
                                        onMouseLeave={e => e.currentTarget.style.background = ACCENT_DARK}
                                    >
                                        <ShoppingBag className="w-3.5 h-3.5 md:w-4 h-4" />
                                        Add to Cart
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
