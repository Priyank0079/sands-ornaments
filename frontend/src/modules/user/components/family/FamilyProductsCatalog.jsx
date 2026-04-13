import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, ShoppingBag, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../../../../context/ShopContext';
import toast from 'react-hot-toast';
import giftMother from '../../assets/gift_mother_silver.png';
import giftFather from '../../assets/gift_husband_silver.png';
import giftBrother from '../../assets/gift_brother_silver.png';
import giftSister from '../../assets/gift_sister_silver.png';
import giftHusband from '../../assets/gift_husband_silver.png';
import giftWife from '../../assets/gift_wife_silver.png';

const familyProducts = [
    {
        id: 'f1',
        recipient: 'mother',
        name: 'Grace Bloom Silver Pendant for Mother',
        price: '2,499',
        originalPrice: '3,699',
        discountPrice: '1,999',
        image: giftMother,
        rating: 4.7,
        reviews: 132,
        badge: "Mother's Pick"
    },
    {
        id: 'f2',
        recipient: 'mother',
        name: 'Heritage Silver Gift Set for Mother',
        price: '4,299',
        originalPrice: '6,299',
        discountPrice: '3,439',
        image: giftMother,
        rating: 4.9,
        reviews: 208,
        badge: 'Limited Edition'
    },
    {
        id: 'f3',
        recipient: 'father',
        name: 'Classic Crest Silver Ring for Father',
        price: '3,199',
        originalPrice: '4,699',
        discountPrice: '2,559',
        image: giftFather,
        rating: 4.9,
        reviews: 341,
        badge: 'Bestseller'
    },
    {
        id: 'f4',
        recipient: 'father',
        name: 'Signature Link Bracelet for Father',
        price: '3,899',
        originalPrice: '5,500',
        discountPrice: '3,119',
        image: giftFather,
        rating: 4.6,
        reviews: 79,
        badge: 'Gift Ready'
    },
    {
        id: 'f5',
        recipient: 'brother',
        name: 'Bold Chain Bracelet for Brother',
        price: '2,799',
        originalPrice: '4,099',
        discountPrice: '2,239',
        image: giftBrother,
        rating: 4.5,
        reviews: 55,
        badge: 'Top Pick'
    },
    {
        id: 'f6',
        recipient: 'brother',
        name: 'Minimal Silver Ring for Brother',
        price: '1,999',
        originalPrice: '3,099',
        discountPrice: '1,599',
        image: giftBrother,
        rating: 4.8,
        reviews: 91,
        badge: 'Essentials'
    },
    {
        id: 'f7',
        recipient: 'sister',
        name: 'Rose Glow Earrings for Sister',
        price: '2,199',
        originalPrice: '3,199',
        discountPrice: '1,759',
        image: giftSister,
        rating: 4.7,
        reviews: 114,
        badge: "Sister's Fave"
    },
    {
        id: 'f8',
        recipient: 'sister',
        name: 'Heart Charm Pendant for Sister',
        price: '2,899',
        originalPrice: '4,099',
        discountPrice: '2,319',
        image: giftSister,
        rating: 4.8,
        reviews: 176,
        badge: 'New Arrival'
    },
    {
        id: 'f9',
        recipient: 'husband',
        name: 'Modern Silver Band for Husband',
        price: '3,499',
        originalPrice: '5,099',
        discountPrice: '2,799',
        image: giftHusband,
        rating: 4.8,
        reviews: 124,
        badge: 'Top Rated'
    },
    {
        id: 'f10',
        recipient: 'husband',
        name: 'Statement Pendant for Husband',
        price: '4,099',
        originalPrice: '5,999',
        discountPrice: '3,279',
        image: giftHusband,
        rating: 4.6,
        reviews: 88,
        badge: 'Premium Pick'
    },
    {
        id: 'f11',
        recipient: 'wife',
        name: 'Moonlight Silver Necklace for Wife',
        price: '4,699',
        originalPrice: '6,899',
        discountPrice: '3,759',
        image: giftWife,
        rating: 4.9,
        reviews: 243,
        badge: 'Most Loved'
    },
    {
        id: 'f12',
        recipient: 'wife',
        name: 'Sparkle Drop Earrings for Wife',
        price: '2,599',
        originalPrice: '3,799',
        discountPrice: '2,079',
        image: giftWife,
        rating: 4.7,
        reviews: 167,
        badge: 'Gift Ready'
    }
];

const recipientLabels = {
    all: 'All Family Collections',
    mother: 'Mother Collections',
    father: 'Father Collections',
    brother: 'Brother Collections',
    sister: 'Sister Collections',
    husband: 'Husband Collections',
    wife: 'Wife Collections'
};

const PINK_LIGHT = '#FFD9E0';
const MAROON = '#8E2B45';

const FamilyProductsCatalog = ({ selectedRecipient = 'all', onSelectRecipient }) => {
    const navigate = useNavigate();
    const { addToCart } = useContext(ShopContext);

    const visibleProducts = selectedRecipient === 'all'
        ? familyProducts
        : familyProducts.filter((product) => product.recipient === selectedRecipient);

    const handleAddToCart = (product) => {
        const parsedPrice = parseFloat(product.price.replace(/,/g, ''));
        const mockProduct = {
            ...product,
            _id: product.id,
            price: parsedPrice,
            variants: [{ id: `${product.id}-v1`, price: parsedPrice }]
        };

        addToCart(mockProduct);
        toast.success(`${product.name} added to your bag!`, {
            style: { background: MAROON, color: '#fff', fontSize: '12px' }
        });
        setTimeout(() => navigate('/cart'), 800);
    };

    return (
        <section id="family-products" className="py-6 md:py-10 bg-white">
            <div className="container mx-auto px-4 md:px-12 max-w-[1500px]">
                <div className="text-center mb-6 md:mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: -15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-none mb-4"
                        style={{ background: PINK_LIGHT, border: `1px solid ${MAROON}22` }}
                    >
                        <Gift className="w-3.5 h-3.5" style={{ color: MAROON }} />
                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: MAROON }}>For Family</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#2D060F] tracking-tight mb-2"
                    >
                        {recipientLabels[selectedRecipient] || 'Family Collections'} <span className="italic" style={{ color: MAROON }}>Edit</span>
                    </motion.h2>
                    <p className="text-[10px] md:text-xs text-zinc-500 max-w-xl mx-auto italic">
                        "Curated boutique jewellery picks for every family member."
                    </p>
                    <div className="w-12 h-[1px] mx-auto mt-5" style={{ background: PINK_LIGHT }} />
                </div>

                <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-10">
                    {Object.entries(recipientLabels).map(([recipientId, label]) => {
                        const isActive = recipientId === selectedRecipient;

                        return (
                            <button
                                key={recipientId}
                                type="button"
                                onClick={() => onSelectRecipient?.(recipientId)}
                                className="px-4 py-2 rounded-none text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] transition-all border"
                                style={{
                                    background: isActive ? PINK_LIGHT : '#fff',
                                    color: isActive ? MAROON : '#444',
                                    borderColor: isActive ? PINK_LIGHT : '#eee'
                                }}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {visibleProducts.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55, delay: (idx % 4) * 0.1 }}
                            className="group relative"
                        >
                            <div
                                className="bg-white rounded-none overflow-hidden transition-all duration-500 flex flex-col h-full border border-amber-50"
                                style={{ boxShadow: '0 4px 20px rgba(217,119,6,0.08)' }}
                                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 16px 40px rgba(217,119,6,0.2)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(217,119,6,0.08)'; }}
                            >
                                {product.badge && (
                                     <div
                                         className="absolute top-4 left-4 z-10 px-3 py-1 rounded-none text-[#8E2B45] text-[9px] font-black uppercase tracking-wider shadow-sm"
                                         style={{ background: PINK_LIGHT }}
                                     >
                                         {product.badge}
                                     </div>
                                 )}

                                 <div
                                     className="relative aspect-[4/5] overflow-hidden cursor-pointer"
                                     style={{ background: '#F9F6F3' }}
                                     onClick={() => navigate(`/product/${product.id}`)}
                                 >
                                     <img
                                         src={product.image}
                                         alt={product.name}
                                         className="w-full h-full object-cover transition-transform duration-[1.8s] group-hover:scale-110"
                                     />
                                     <button type="button" className="absolute top-4 right-4 p-2 bg-white/90 rounded-none shadow-sm hover:bg-pink-50 transition-colors">
                                         <Heart className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#8E2B45] transition-colors" />
                                     </button>
                                 </div>

                                 <div className="p-5 flex flex-col flex-grow">
                                     <div className="flex items-center gap-1 mb-2">
                                         {[...Array(5)].map((_, i) => (
                                             <Star
                                                 key={i}
                                                 className={`w-2.5 h-2.5 ${i < Math.floor(product.rating) ? 'fill-[#C9A24D] text-[#C9A24D]' : 'text-gray-200'}`}
                                             />
                                         ))}
                                         <span className="text-[9px] text-gray-400 ml-1">({product.reviews}) reviews</span>
                                     </div>

                                     <h3
                                         className="text-[12px] font-bold text-gray-800 mb-2 line-clamp-2 leading-snug cursor-pointer hover:text-[#8E2B45] transition-colors uppercase tracking-tight"
                                         onClick={() => navigate(`/product/${product.id}`)}
                                     >
                                         {product.name}
                                     </h3>

                                     <div className="flex items-baseline gap-2 mb-3">
                                         <span className="text-lg font-black text-zinc-900 font-serif">₹{product.price}</span>
                                         <span className="text-[10px] text-gray-400 line-through">₹{product.originalPrice}</span>
                                     </div>

                                     <p className="text-[10px] text-gray-400 mb-4 italic">"A timeless heirloom piece for your collection."</p>

                                     <button
                                         type="button"
                                         onClick={() => handleAddToCart(product)}
                                         className="mt-auto w-full py-2.5 rounded-none font-bold text-[10px] uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2"
                                         style={{ 
                                             background: PINK_LIGHT,
                                             color: MAROON
                                         }}
                                         onMouseEnter={(e) => { 
                                             e.currentTarget.style.background = '#ffd0d9';
                                         }}
                                         onMouseLeave={(e) => { 
                                             e.currentTarget.style.background = PINK_LIGHT;
                                         }}
                                     >
                                         <ShoppingBag className="w-3.5 h-3.5" />
                                         Shop Collection
                                     </button>
                                 </div>
                             </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 md:mt-12 text-center">
                     <motion.button
                         type="button"
                         initial={{ opacity: 0, y: 20 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true }}
                         onClick={() => {
                             onSelectRecipient?.('all');
                             navigate('/category/family');
                         }}
                         className="px-10 py-3.5 rounded-none font-bold uppercase tracking-widest text-[10px] transition-all shadow-md hover:shadow-lg"
                         style={{ background: PINK_LIGHT, color: MAROON }}
                     >
                         View All Collections →
                     </motion.button>
                 </div>
            </div>
        </section>
    );
};

export default FamilyProductsCatalog;
