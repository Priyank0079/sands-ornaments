import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ShoppingBag, Sparkles } from 'lucide-react';
import { ShopContext } from '../../../../context/ShopContext';
import toast from 'react-hot-toast';

const collections = [
    {
        id: 1,
        title: "Gifts for Her",
        subtitle: "The surprise her heart'll adore. Gift her Silver",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop",
        link: "/shop?category=women-gifts"
    },
    {
        id: 2,
        title: "Bridal Bliss",
        subtitle: "Elegance for your most special day.",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
        link: "/shop?category=bridal"
    },
    {
        id: 3,
        title: "Office Chic",
        subtitle: "Minimalist designs for the modern professional.",
        image: "https://images.unsplash.com/photo-1529139572765-3974d3cf1606?q=80&w=1200&auto=format&fit=crop",
        link: "/shop?category=office"
    },
    {
        id: 4,
        title: "925 Silver Classics",
        subtitle: "Timeless purity in every shimmer.",
        image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1200&auto=format&fit=crop",
        link: "/shop?category=silver"
    },
    {
        id: 5,
        title: "Dazzling Rings",
        subtitle: "Let your hands do the talking.",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop",
        link: "/shop?category=rings"
    },
    {
        id: 6,
        title: "Boho Anklets",
        subtitle: "Trendy pieces for the free-spirited.",
        image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1200&auto=format&fit=crop",
        link: "/shop?category=anklets"
    }
];

// Duplicate for seamless loop
const duplicatedCollections = [...collections, ...collections];

const WomenCuratedCollections = () => {
    const { addToCart, products } = useContext(ShopContext);

    const handleQuickAdd = (e, item) => {
        e.stopPropagation();
        
        const realProduct = products.find(p => p.category?.toLowerCase() === item.title.toLowerCase().replace('shop ', '').replace(' for her', ''));
        
        if (realProduct) {
            addToCart(realProduct);
            toast.success(`Exclusive ${item.title} item added to cart!`, { icon: '🌸' });
        } else {
            const mockProduct = {
                id: item.id + '-women-mock',
                _id: item.id + '-women-mock',
                name: item.title,
                price: 2499,
                image: item.image,
                variants: [{ id: item.id + '-v1', price: 2499 }]
            };
            addToCart(mockProduct);
            toast.success(`${item.title} item added to bag!`, {
                style: { background: '#D39A9F', color: '#fff', fontSize: '12px' },
                icon: '🛍️'
            });
        }
    };

    return (
        <section className="py-24 bg-white overflow-hidden select-none relative">
            {/* Background Decorative Text */}
            <div className="absolute top-0 left-0 w-full opacity-[0.03] pointer-events-none select-none">
                <div className="text-[15vw] font-serif font-bold whitespace-nowrap leading-none transition-transform duration-1000">
                    SANDS ROYAL WOMEN SANDS ROYAL WOMEN
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-10 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block"
                    >
                        <div className="flex items-center justify-center gap-2 text-[#D39A9F] mb-1">
                            <Sparkles className="w-4 h-4 opacity-70" />
                            <span className="text-[9px] font-bold uppercase tracking-[0.6em] text-[#D39A9F]/80">The Exclusive List</span>
                            <Sparkles className="w-4 h-4 opacity-70" />
                        </div>
                        <h2 className="text-3xl md:text-[40px] font-serif font-black text-black mb-3 uppercase tracking-tighter leading-none">
                            Signature <span className="italic text-[#D39A9F] font-light">Collections</span>
                        </h2>
                        <div className="w-16 h-1 bg-[#D39A9F]/40 mx-auto rounded-full"></div>
                    </motion.div>
                </div>

                {/* Marquee Container */}
                <div className="flex relative w-full overflow-hidden">
                    {/* The Scrolling Strip */}
                    <motion.div 
                        className="flex gap-6 pr-6"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ 
                            x: {
                                duration: 35, 
                                repeat: Infinity,
                                ease: "linear"
                            }
                        }}
                    >
                        {duplicatedCollections.map((item, idx) => (
                            <motion.div 
                                key={`${item.id}-${idx}`}
                                className="flex-shrink-0 w-[240px] md:w-[310px] aspect-[4/5] relative rounded-[2rem] overflow-hidden shadow-2xl group/card border border-[#EBCDD0]/10"
                            >
                                <img 
                                    src={item.image} 
                                    alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2.5s] group-hover/card:scale-110 brightness-[0.95] group-hover/card:brightness-100"
                                />
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-500 group-hover/card:via-black/30"></div>

                                {/* Quick Add Button Overlay */}
                                <div className="absolute top-5 right-5 opacity-0 group-hover/card:opacity-100 transition-all duration-500 transform translate-y-3 group-hover/card:translate-y-0">
                                    <button 
                                        onClick={(e) => handleQuickAdd(e, item)}
                                        className="p-3 bg-white text-black rounded-full shadow-2xl hover:bg-[#D39A9F] hover:text-white transition-all duration-300 scale-90 group-hover/card:scale-100"
                                    >
                                        <ShoppingBag className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Text Content - More compact and professional */}
                                <div className="absolute bottom-5 left-4 right-4 group-hover/card:bottom-6 transition-all duration-700">
                                    <div className="bg-white/95 backdrop-blur-2xl p-5 md:p-6 rounded-[1.8rem] border border-[#EBCDD0]/30 shadow-2xl transform transition-all duration-1000 group-hover/card:bg-[#D39A9F] group/inner">
                                        <p className="text-[#D39A9F] text-[9px] md:text-[10px] font-bold mb-1 uppercase tracking-[0.25em] line-clamp-1 group-hover/card:text-white/80 transition-colors">
                                            {item.subtitle}
                                        </p>
                                        <div className="flex items-center justify-between gap-4">
                                            <h3 className="text-black font-serif font-black text-lg md:text-xl uppercase tracking-tighter group-hover/card:text-white transition-colors leading-tight">
                                                {item.title}
                                            </h3>
                                            <div className="w-7 h-7 rounded-full bg-[#D39A9F]/10 flex items-center justify-center group-hover/card:bg-white/20 transition-colors flex-shrink-0">
                                                <ChevronRight className="w-4 h-4 text-black group-hover/card:text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                    
                    {/* Soft Vignette Gradients */}
                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
                </div>
            </div>
        </section>
    );
};

export default WomenCuratedCollections;
