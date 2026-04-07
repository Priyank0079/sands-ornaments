import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, ShoppingBag, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../../../../context/ShopContext';
import toast from 'react-hot-toast';

const dummyProducts = [
    {
        id: 'w1',
        name: "Rose Glow Sterling Drop Earrings",
        price: "1,899",
        originalPrice: "3,299",
        discountPrice: "1,699",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=90&w=1600&auto=format&fit=crop",
        rating: 4.8,
        reviews: 245,
        badge: "Trending",
        color: "#D39A9F"
    },
    {
        id: 'w2',
        name: "Eternal Blossom Pendant Necklace",
        price: "2,499",
        originalPrice: "4,199",
        discountPrice: "2,249",
        image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=90&w=1600&auto=format&fit=crop",
        rating: 4.9,
        reviews: 180,
        badge: "Bestseller",
        color: "#D39A9F"
    },
    {
        id: 'w3',
        name: "Infinite Love Stackable Silver Ring",
        price: "1,299",
        originalPrice: "2,499",
        discountPrice: "1,169",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=90&w=1600&auto=format&fit=crop",
        rating: 4.6,
        reviews: 92,
        badge: "New",
        color: "#D39A9F"
    },
    {
        id: 'w4',
        name: "Shimmering Triple-Link Bracelet",
        price: "3,199",
        originalPrice: "5,800",
        discountPrice: "2,879",
        image: "https://images.unsplash.com/photo-1512163143273-bde0e3cc7407?q=90&w=1600&auto=format&fit=crop",
        rating: 4.7,
        reviews: 156,
        badge: "",
        color: "#D39A9F"
    },
    {
        id: 'w5',
        name: "Crystal Starlight Silver Anklet",
        price: "1,499",
        originalPrice: "2,699",
        discountPrice: "1,349",
        image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=90&w=1600&auto=format&fit=crop",
        rating: 4.5,
        reviews: 64,
        badge: "Trending",
        color: "#D39A9F"
    },
    {
        id: 'w6',
        name: "Serene Moissanite Solitaire Ring",
        price: "4,599",
        originalPrice: "7,999",
        discountPrice: "4,139",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=90&w=1600&auto=format&fit=crop",
        rating: 5.0,
        reviews: 310,
        badge: "Eco-Lux",
        color: "#D39A9F"
    },
    {
        id: 'w7',
        name: "Delicate Moonnose Silver Pin",
        price: "699",
        originalPrice: "1,200",
        discountPrice: "629",
        image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=90&w=1600&auto=format&fit=crop",
        rating: 4.4,
        reviews: 42,
        badge: "",
        color: "#D39A9F"
    },
    {
        id: 'w8',
        name: "Classic 925 Sterling Rope Chain",
        price: "2,199",
        originalPrice: "3,800",
        discountPrice: "1,979",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=90&w=1600&auto=format&fit=crop",
        rating: 4.7,
        reviews: 115,
        badge: "Luxury",
        color: "#D39A9F"
    }
];

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
            style: { background: '#D39A9F', color: '#fff', fontSize: '12px' },
            icon: '💖'
        });
        
        setTimeout(() => {
            navigate('/cart');
        }, 800);
    };

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">
                
                <div className="text-center mb-20 relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-serif font-black text-black mb-4 uppercase tracking-tighter">
                            Women's <span className="italic text-[#D39A9F]">Exclusives</span>
                        </h2>
                        <div className="w-24 h-1.5 bg-[#FDF5F6] border-2 border-[#D39A9F] mx-auto rounded-full" />
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                    {dummyProducts.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: (idx % 4) * 0.1 }}
                            className="group relative"
                        >
                            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-500 h-full flex flex-col">
                                {/* Image Section */}
                                <div 
                                    className="relative aspect-[4/5] cursor-pointer overflow-hidden bg-slate-50"
                                    onClick={() => navigate(`/product/${product.id}`)}
                                >
                                    <img 
                                        src={product.image} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                                    />
                                    
                                    {/* Subtle Wishlist */}
                                    <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full shadow-sm hover:bg-pink-50 transition-colors">
                                        <Heart className="w-3.5 h-3.5 text-gray-400 group-hover:text-pink-500" />
                                    </button>
                                </div>

                                {/* Content Section (Image 1 Style) */}
                                <div className="p-8 text-left bg-white flex flex-col flex-grow border-t border-gray-50">
                                    <h3 
                                        className="text-xl md:text-2xl font-black text-gray-900 leading-tight uppercase tracking-[-0.02em] mb-1 line-clamp-2 cursor-pointer"
                                        onClick={() => navigate(`/product/${product.id}`)}
                                    >
                                        {/* Adaptive Title matching "UNDER INR 2000" style */}
                                        {product.name}
                                    </h3>
                                    
                                    <p className="text-sm text-gray-400 font-medium mb-6">
                                        Discover the collection
                                    </p>
                                    
                                    <div className="mt-auto">
                                        <button 
                                            onClick={() => handleAddToCart(product)}
                                            className="w-full bg-[#FFDDE2]/80 hover:bg-[#FFDDE2] text-[#4A1015] py-4 rounded-xl font-bold text-xs md:text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-3 active:scale-95"
                                        >
                                            Shop Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Explore More Button */}
                <div className="mt-20 text-center">
                    <button 
                        onClick={() => navigate('/shop?category=women')}
                        className="px-12 py-5 border-2 border-[#D39A9F] text-[#D39A9F] rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#D39A9F] hover:text-white transition-all shadow-lg hover:shadow-xl"
                    >
                        Explore Entire Boutique
                    </button>
                </div>

            </div>
        </section>
    );
};

export default WomenProductsListing;
