import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ShoppingBag } from 'lucide-react';
import { ShopContext } from '../../../../context/ShopContext';
import toast from 'react-hot-toast';

const collections = [
    {
        id: 1,
        title: "Shop Gifts for Him",
        subtitle: "He'll Love to Wear This On Repeat. Gift him Silver",
        image: "https://images.unsplash.com/photo-1617135641162-d63732a38611?q=80&w=2070&auto=format&fit=crop",
        link: "/shop?category=gifts"
    },
    {
        id: 2,
        title: "The Classics for Him",
        subtitle: "Timeless designs for the modern gentleman.",
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2070&auto=format&fit=crop",
        link: "/shop?category=classics"
    },
    {
        id: 3,
        title: "Pendants for Him",
        subtitle: "Minimalist and statement pendants in silver.",
        image: "https://images.unsplash.com/photo-1644342371408-ae78f6ec6d81?q=80&w=1974&auto=format&fit=crop",
        link: "/shop?category=pendants"
    },
    {
        id: 4,
        title: "Shop for 925 Silver",
        subtitle: "Premium 925 Sterling Silver authentication.",
        image: "https://images.unsplash.com/photo-1612015900986-4c4d017d1648?q=80&w=1924&auto=format&fit=crop",
        link: "/shop?category=silver"
    },
    {
        id: 5,
        title: "Rings for Him",
        subtitle: "Let his Silver do the talking.",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2070&auto=format&fit=crop",
        link: "/shop?category=rings"
    },
    {
        id: 6,
        title: "Shop for GenZ",
        subtitle: "Edgy and trendy pieces for the bold.",
        image: "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?q=80&w=1974&auto=format&fit=crop",
        link: "/shop?category=genz"
    }
];

// Duplicate for seamless loop
const duplicatedCollections = [...collections, ...collections];

const MenCuratedCollections = () => {
    const { addToCart, products } = useContext(ShopContext);

    const handleQuickAdd = (e, item) => {
        e.stopPropagation(); // Don't trigger card navigation
        
        // Try to find a real product or use mock
        const realProduct = products.find(p => p.category?.toLowerCase() === item.title.toLowerCase().replace('shop ', '').replace(' for him', ''));
        
        if (realProduct) {
            addToCart(realProduct);
            toast.success(`Exclusive ${item.title} item added to cart!`);
        } else {
            const mockProduct = {
                id: item.id + '-coll-mock',
                _id: item.id + '-coll-mock',
                name: item.title,
                price: 2499,
                image: item.image,
                variants: [{ id: item.id + '-v1', price: 2499 }]
            };
            addToCart(mockProduct);
            toast.success(`${item.title} item added to cart!`);
        }
    };

    return (
        <section className="py-20 bg-white overflow-hidden select-none">
            <div className="container mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black text-[#111] mb-4 uppercase tracking-tight"
                    >
                        Curated Collections
                    </motion.h2>
                    <div className="w-24 h-1.5 bg-[#3B82F6] mx-auto rounded-full"></div>
                </div>

                {/* Marquee Container */}
                <div className="flex relative w-full overflow-hidden">
                    {/* The Scrolling Strip */}
                    <motion.div 
                        className="flex gap-6 pr-6"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ 
                            x: {
                                duration: 25, 
                                repeat: Infinity,
                                ease: "linear"
                            }
                        }}
                    >
                        {duplicatedCollections.map((item, idx) => (
                            <motion.div 
                                key={`${item.id}-${idx}`}
                                className="flex-shrink-0 w-[240px] md:w-[300px] aspect-[4/5] relative rounded-[30px] overflow-hidden shadow-2xl group/card border border-gray-100"
                            >
                                <img 
                                    src={item.image} 
                                    alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110"
                                    onError={(e) => {
                                        e.target.src = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop";
                                    }}
                                />
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>

                                {/* Quick Add Button Overlay */}
                                <div className="absolute top-4 right-4 opacity-0 group-hover/card:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/card:translate-y-0">
                                    <button 
                                        onClick={(e) => handleQuickAdd(e, item)}
                                        className="p-3 bg-white text-[#111] rounded-full shadow-2xl hover:bg-[#3B82F6] hover:text-white transition-all duration-300"
                                        title="Quick Add to Cart"
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Text Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                                    <div className="bg-[#0B1528] p-4 md:p-5 rounded-[24px] border border-white/5 shadow-2xl transform transition-all duration-500 group-hover/card:-translate-y-2 group-hover/card:bg-[#3B82F6]">
                                        <p className="text-white/60 text-[9px] md:text-[10px] font-bold mb-1.5 uppercase tracking-widest line-clamp-1">
                                            {item.subtitle}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-white font-black text-base uppercase tracking-tight md:text-lg">
                                                {item.title}
                                            </h3>
                                            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center group-hover/card:bg-white/20 transition-colors">
                                                <ChevronRight className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                    
                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
                </div>
            </div>
            
            <style>
                {`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                `}
            </style>
        </section>
    );
};

export default MenCuratedCollections;
