import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../../../../context/ShopContext';
import toast from 'react-hot-toast';

const familyProducts = [
    {
        id: 'f1',
        name: "Tiny Sparkle Kids Studs",
        price: "1,299",
        originalPrice: "2,499",
        image: "https://images.unsplash.com/photo-1621112904887-419379ce6824?q=90&w=1600&auto=format&fit=crop",
        badge: "Kids' Choice"
    },
    {
        id: 'f2',
        name: "Mother-Daughter Bloom Lockets",
        price: "4,299",
        originalPrice: "7,500",
        image: "https://images.unsplash.com/photo-1544126592-807daa2b569b?q=90&w=1600&auto=format&fit=crop",
        badge: "Limited Edition"
    },
    {
        id: 'f3',
        name: "Eternal Bond Couple Bands",
        price: "8,999",
        originalPrice: "15,000",
        image: "https://images.unsplash.com/photo-1623934199716-dc3c23e62df9?q=90&w=1600&auto=format&fit=crop",
        badge: "Bestseller"
    },
    {
        id: 'f4',
        name: "Little Prince Silver Bracelet",
        price: "1,899",
        originalPrice: "3,200",
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe15201?q=90&w=1600&auto=format&fit=crop",
        badge: "Gift Ideas"
    },
    {
        id: 'f5',
        name: "Petite Heart Anklet for Girls",
        price: "999",
        originalPrice: "1,800",
        image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=90&w=1600&auto=format&fit=crop",
        badge: "Top Pick"
    },
    {
        id: 'f6',
        name: "Guardian Angel Baby Pin",
        price: "2,499",
        originalPrice: "4,500",
        image: "https://images.unsplash.com/photo-1603561591411-0e7320b97d0c?q=90&w=1600&auto=format&fit=crop",
        badge: "Essentials"
    },
    {
        id: 'f7',
        name: "Family Tree Heritage Pendant",
        price: "3,599",
        originalPrice: "5,800",
        image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=90&w=1600&auto=format&fit=crop",
        badge: "Heirloom"
    },
    {
        id: 'f8',
        name: "Infinite Love Parent-Child Set",
        price: "5,199",
        originalPrice: "9,200",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=90&w=1600&auto=format&fit=crop",
        badge: "New Arrival"
    }
];

const FamilyProductsListing = () => {
    const navigate = useNavigate();
    const { addToCart } = useContext(ShopContext);

    const handleAddToCart = (product) => {
        const mockProduct = {
            ...product,
            _id: product.id,
            price: parseFloat(product.price.replace(',', '')),
            variants: [{ id: product.id + '-v1', price: parseFloat(product.price.replace(',', '')) }]
        };
        addToCart(mockProduct);
        toast.success(`${product.name} added to your bag!`, {
            style: { background: '#D39A9F', color: '#fff', fontSize: '12px' },
            icon: '🏠'
        });
        setTimeout(() => navigate('/cart'), 800);
    };

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
                <div className="text-center mb-16 relative">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                        <h2 className="text-3xl md:text-5xl font-serif font-black text-black mb-4 uppercase tracking-tighter">
                            Family <span className="italic text-[#D39A9F]">Collections</span>
                        </h2>
                        <div className="w-16 h-1 bg-[#D39A9F] mx-auto rounded-full" />
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {familyProducts.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: (idx % 4) * 0.1 }}
                            className="group relative"
                        >
                            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                                <div className="relative aspect-[4/5] cursor-pointer overflow-hidden bg-slate-50" onClick={() => navigate(`/product/${product.id}`)}>
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
                                    <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full shadow-sm hover:bg-pink-50 transition-colors">
                                        <Heart className="w-3.5 h-3.5 text-gray-400 group-hover:text-pink-500" />
                                    </button>
                                </div>
                                <div className="p-8 text-left bg-white flex flex-col flex-grow border-t border-gray-50">
                                    <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight uppercase tracking-tighter mb-1 line-clamp-2">{product.name}</h3>
                                    <p className="text-sm text-gray-400 font-medium mb-6">Explore legacy gift ideas</p>
                                    <div className="mt-auto">
                                        <button 
                                            onClick={() => handleAddToCart(product)}
                                            className="w-full bg-[#FDF5F6] hover:bg-[#D39A9F] text-[#4A1015] hover:text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                                        >
                                            Shop Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FamilyProductsListing;
