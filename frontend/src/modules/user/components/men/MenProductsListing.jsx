import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../../../../context/ShopContext';
import toast from 'react-hot-toast';

const dummyProducts = [
    {
        id: 'p1',
        name: "Silver Fibonacci Flow Ring For Him",
        price: "2,899",
        originalPrice: "4,699",
        discountPrice: "1,739",
        image: "/images/men-categories/rings.png",
        rating: 4.6,
        reviews: 107,
        badge: "New Arrival",
        buttonText: "Add to Cart"
    },
    {
        id: 'p2',
        name: "Silver Anjaneya Pendant With Box Chain",
        price: "3,799",
        originalPrice: "6,199",
        discountPrice: "2,279",
        image: "/images/men-categories/pendants.png",
        rating: 4.6,
        reviews: 100,
        badge: "",
        buttonText: "Add to Cart"
    },
    {
        id: 'p3',
        name: "Silver Classic Band For Him",
        price: "3,499",
        originalPrice: "5,499",
        discountPrice: "2,099",
        image: "/images/men-categories/sets.png",
        rating: 3.8,
        reviews: 51,
        badge: "",
        buttonText: "Add to Cart"
    },
    {
        id: 'p4',
        name: "Silver Trooper Bracelet For Him",
        price: "4,199",
        originalPrice: "6,999",
        discountPrice: "2,519",
        image: "/images/men-categories/bracelets.png",
        rating: 4.9,
        reviews: 215,
        badge: "Bestseller",
        buttonText: "Add to Cart"
    },
    {
        id: 'p5',
        name: "Silver Statement Link Chain",
        price: "6,599",
        originalPrice: "9,999",
        discountPrice: "3,959",
        image: "/images/men-categories/chains.png",
        rating: 4.8,
        reviews: 84,
        badge: "",
        buttonText: "Add to Cart"
    },
    {
        id: 'p6',
        name: "Silver Classic Cufflinks Set",
        price: "2,999",
        originalPrice: "4,500",
        discountPrice: "1,799",
        image: "/images/men-categories/cufflinks.png",
        rating: 4.5,
        reviews: 42,
        badge: "Trending",
        buttonText: "Add to Cart"
    },
    {
        id: 'p7',
        name: "Oxidized Warrior Ring For Men",
        price: "1,899",
        originalPrice: "2,999",
        discountPrice: "1,139",
        image: "/images/men-categories/spiritual.png",
        rating: 4.3,
        reviews: 67,
        badge: "",
        buttonText: "Add to Cart"
    },
    {
        id: 'p8',
        name: "Silver Minimalist Anchor Bracelet",
        price: "3,150",
        originalPrice: "4,800",
        discountPrice: "1,890",
        image: "/images/men-categories/custom.png",
        rating: 4.7,
        reviews: 130,
        badge: "",
        buttonText: "Add to Cart"
    }
];

const MenProductsListing = () => {
    const navigate = useNavigate();
    const { addToCart, products } = useContext(ShopContext);

    const handleAddToCart = (product) => {
        // In a real app, we would match dummyProducts with real DB products.
        // For now, we'll try to find a matching product in context or pass the dummy data.
        const realProduct = products.find(p => p.id === product.id || p.name === product.name);
        
        if (realProduct) {
            addToCart(realProduct);
        } else {
            // Transform dummy to context-friendly format
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
        
        // Instant feedback and navigation
        setTimeout(() => {
            navigate('/cart');
        }, 500);
    };

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">
                
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-black text-[#111] mb-4 uppercase tracking-wide">
                        Men's Exclusives
                    </h2>
                    <div className="w-20 h-1.5 bg-[#3B82F6] mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {dummyProducts.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: (idx % 4) * 0.1 }}
                            className="bg-white border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col group border-gray-100"
                        >
                            {/* Top Banner */}
                            <div className="w-full bg-[#0B1528] py-2 text-center text-white font-bold text-[10px] tracking-[0.2em] uppercase">
                                Quick View
                            </div>

                            {/* Image Section */}
                            <div 
                                className="relative aspect-[4/5] bg-gray-50 cursor-pointer overflow-hidden p-6"
                                onClick={() => navigate(`/product/${product.id}`)}
                            >
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                                />
                                
                                {/* Wishlist Icon */}
                                <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors">
                                    <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" />
                                </button>
                                
                                {/* Rating Badge */}
                                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur border border-gray-100 px-2.5 py-1 flex items-center gap-1.5 rounded-lg text-[10px] font-bold text-gray-700 shadow-md">
                                    {product.rating} <Star className="w-3 h-3 text-orange-400 fill-orange-400" /> <span className="text-gray-300 font-normal">|</span> {product.reviews}
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-5 flex flex-col flex-grow bg-white">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-2xl font-black text-[#111]">₹{product.price}</span>
                                    <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                                </div>
                                
                                <h3 
                                    className="text-sm font-bold text-gray-600 mb-4 line-clamp-2 min-h-[40px] cursor-pointer hover:text-[#3B82F6] transition-colors leading-relaxed"
                                    onClick={() => navigate(`/product/${product.id}`)}
                                >
                                    {product.name}
                                </h3>
                                
                                <div className="mt-auto bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                                    <p className="text-[#3B82F6] text-[11px] font-bold tracking-wide uppercase mb-1">
                                        Special Offer
                                    </p>
                                    <p className="text-gray-600 text-[11px]">
                                        Get it for <span className="font-bold text-[#111]">₹{product.discountPrice}</span> with exclusive member coupons
                                    </p>
                                </div>
                                
                            </div>
                            
                            {/* Bottom Button */}
                            <div className="px-5 pb-5">
                                <button 
                                    onClick={() => handleAddToCart(product)}
                                    className="w-full py-3.5 bg-[#0B1528] text-white font-bold text-xs tracking-[0.2em] uppercase hover:bg-[#3B82F6] transition-all duration-300 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-[#0B1528]/10"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    {product.buttonText}
                                </button>
                            </div>

                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default MenProductsListing;
