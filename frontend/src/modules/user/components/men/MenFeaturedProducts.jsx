import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../../../../context/ShopContext';
import { useAuth } from '../../../../context/AuthContext';
import { getMenLoginRedirect, storeMenPendingCartItem } from '../../utils/menNavigation';
import toast from 'react-hot-toast';

// Reusing existing assets that fit the white-background minimalist theme
import prodRing from '@assets/men_prod_ring.png';
import prodPendant from '@assets/men_prod_pendant.png';
import prodBracelet from '@assets/men_prod_bracelet.png';
import prodChain from '@assets/men_prod_chain.png';
import prodStud from '@assets/men_prod_stud.png';
import premiumRing from '@assets/premium_ring_product.png';

const featuredProducts = [
    {
        id: 'fp1',
        name: "Golden Modest Leader Ring For Him",
        price: "3,099",
        originalPrice: "4,899",
        image: prodRing,
        rating: 4.5,
        reviews: 78,
        discountText: "EXTRA 15% OFF with coupon"
    },
    {
        id: 'fp2',
        name: "Silver Fibonacci Flow Ring For Him",
        price: "2,899",
        originalPrice: "4,699",
        image: premiumRing,
        rating: 4.6,
        reviews: 109,
        discountText: "Get it for ₹2,609 with coupon"
    },
    {
        id: 'fp3',
        name: "Silver Anjaneya Pendant With Box Chain",
        price: "3,799",
        originalPrice: "6,199",
        image: prodPendant,
        rating: 4.6,
        reviews: 100,
        discountText: "EXTRA 15% OFF with coupon"
    },
    {
        id: 'fp4',
        name: "Golden Classic Band For Him",
        price: "3,499",
        originalPrice: "5,499",
        image: prodRing,
        rating: 3.8,
        reviews: 51,
        discountText: "EXTRA 15% OFF with coupon"
    },
    {
        id: 'fp5',
        name: "Silver Trooper Bracelet For Him",
        price: "4,199",
        originalPrice: "6,999",
        image: prodBracelet,
        rating: 4.9,
        reviews: 124,
        discountText: "EXTRA 15% OFF with coupon"
    },
    {
        id: 'fp6',
        name: "Silver Statement Link Chain",
        price: "2,599",
        originalPrice: "3,999",
        image: prodChain,
        rating: 4.7,
        reviews: 86,
        discountText: "Get it for ₹2,199 with coupon"
    },
    {
        id: 'fp7',
        name: "Minimalist Gold Studs For Men",
        price: "1,899",
        originalPrice: "2,999",
        image: prodStud,
        rating: 4.4,
        reviews: 42,
        discountText: "EXTRA 15% OFF with coupon"
    },
    {
        id: 'fp8',
        name: "Signature Silver Band Ring",
        price: "2,299",
        originalPrice: "3,599",
        image: premiumRing,
        rating: 4.8,
        reviews: 95,
        discountText: "EXTRA 15% OFF with coupon"
    }
];

const MenFeaturedProducts = () => {
    const navigate = useNavigate();
    const { addToCart, products } = useContext(ShopContext);
    const { user } = useAuth();

    const redirectToLogin = () => {
        toast.error('Please login to continue');
        navigate(getMenLoginRedirect());
    };

    const resolveRealProduct = (product) => (
        products?.find((item) => item.id === product.id || item.name === product.name) || null
    );

    const handleProductOpen = (product) => {
        if (!user) {
            redirectToLogin();
            return;
        }

        const realProduct = resolveRealProduct(product);
        navigate(`/product/${realProduct?.id || product.id}`);
    };

    const handleAddToCart = (product) => {
        if (!user) {
            const realProduct = resolveRealProduct(product) || {
                ...product,
                _id: product.id,
                id: product.id
            };
            storeMenPendingCartItem(realProduct);
            redirectToLogin();
            return;
        }

        // Try to find if product exists in real products list, otherwise create a simplified object
        const realProduct = resolveRealProduct(product);
        
        if (realProduct) {
            addToCart(realProduct);
        } else {
            // Mock product object structure for context
            const mockProduct = {
                ...product,
                _id: product.id,
                price: parseFloat(product.price.replace(',', '')),
                originalPrice: parseFloat(product.originalPrice.replace(',', '')),
                variants: [{ id: product.id + '-default', price: parseFloat(product.price.replace(',', '')) }]
            };
            addToCart(mockProduct);
        }
        
        toast.success(`${product.name} added to cart!`);
        setTimeout(() => navigate('/cart'), 800);
    };

    return (
        <section className="py-4 md:py-16 bg-white overflow-hidden">
            <div className="container mx-auto px-4 max-w-[1400px]">
                
                {/* Section Header Matching Screenshot */}
                <div className="text-center mb-5 md:mb-14">
                    <h2 className="text-2xl md:text-[32px] font-medium text-gray-900 tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Men's Exclusive
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-8">
                    {featuredProducts.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.05 }}
                            className="bg-white group cursor-pointer"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-square bg-[#FBFBFB] overflow-hidden mb-1.5 md:mb-3" onClick={() => handleProductOpen(product)}>
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
                                <h3 className="text-[10px] md:text-[14px] text-gray-600 font-medium mb-1 md:mb-1.5 line-clamp-1 leading-tight hover:text-gray-900" onClick={() => handleProductOpen(product)}>
                                    {product.name}
                                </h3>

                                {/* Promo Text */}
                                <p className="text-[8px] md:text-[11px] font-bold text-[#2B6CB0] mb-1.5 md:mb-3 uppercase tracking-tight leading-tight">
                                    {product.discountText}
                                </p>

                                {/* CTA Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart(product);
                                    }}
                                    className="w-full py-1.5 md:py-3 rounded-md font-bold text-[9px] md:text-[14px] text-gray-700 transition-all duration-300 transform active:scale-95"
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
            </div>
        </section>
    );
};

export default MenFeaturedProducts;

