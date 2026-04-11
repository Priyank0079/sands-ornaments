import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../../../../context/ShopContext';
import toast from 'react-hot-toast';

// Reusing existing assets that fit the white-background minimalist theme
import prodRing from '../../assets/men_prod_ring.png';
import prodPendant from '../../assets/men_prod_pendant.png';
import prodBracelet from '../../assets/men_prod_bracelet.png';
import prodChain from '../../assets/men_prod_chain.png';
import prodStud from '../../assets/men_prod_stud.png';
import premiumRing from '../../assets/premium_ring_product.png';

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

    const handleAddToCart = (product) => {
        // Try to find if product exists in real products list, otherwise create a simplified object
        const realProduct = products?.find(p => p.id === product.id || p.name === product.name);
        
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
        <section className="py-10 md:py-16 bg-white overflow-hidden">
            <div className="container mx-auto px-4 max-w-[1400px]">
                
                {/* Section Header Matching Screenshot */}
                <div className="text-center mb-10 md:mb-14">
                    <h2 className="text-2xl md:text-[32px] font-medium text-gray-900 tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Men's Exclusive
                    </h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-10 md:gap-y-16">
                    {featuredProducts.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.05 }}
                            className="flex flex-col group"
                        >
                            {/* Product Image Container */}
                            <div className="relative aspect-square bg-[#F8F8F8] overflow-hidden rounded-sm mb-4 cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="w-full h-full object-contain p-6 md:p-8 transition-transform duration-500 group-hover:scale-105"
                                />
                                {/* Wishlist Heart */}
                                <button className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/80 transition-all">
                                    <Heart className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
                                </button>
                                {/* Rating Badge */}
                                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded flex items-center gap-1 text-[10px] md:text-xs font-medium text-gray-600 shadow-sm">
                                    {product.rating} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    <span className="text-gray-300 mx-0.5">|</span>
                                    {product.reviews}
                                </div>
                            </div>

                            {/* Product Details */}
                            <div className="flex flex-col flex-grow">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-base md:text-[19px] font-bold text-gray-900">₹{product.price}</span>
                                    <span className="text-xs text-gray-400 line-through font-medium">₹{product.originalPrice}</span>
                                </div>
                                <h3 className="text-xs md:text-[13px] text-gray-500 font-medium mb-2.5 line-clamp-2 leading-relaxed hover:text-gray-800 transition-colors cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                                    {product.name}
                                </h3>
                                
                                <p className="text-[10px] md:text-[11px] font-bold text-[#003B95] uppercase tracking-tight mb-5">
                                    {product.discountText}
                                </p>

                                {/* Action Button with requested Gradient and rounded style */}
                                <button 
                                    className="mt-auto w-full py-3 md:py-3.5 rounded-full bg-gradient-to-r from-[#FFBFCB] to-[#FFE5EC] text-[#1C2C5B] font-bold text-[13px] md:text-[15px] transition-all duration-300 hover:shadow-lg hover:brightness-[1.02] active:scale-95"
                                    onClick={() => handleAddToCart(product)}
                                >
                                    Add to Cart
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
