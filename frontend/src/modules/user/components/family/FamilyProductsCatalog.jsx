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

const GOLD = '#D97706';
const GOLD_LIGHT = '#FEF3C7';
const GOLD_BG = '#FFFBEB';

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
            style: { background: GOLD, color: '#fff', fontSize: '12px' }
        });
        setTimeout(() => navigate('/cart'), 800);
    };

    return (
        <section id="family-products" className="py-8 md:py-16" style={{ background: GOLD_BG }}>
            <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">
                <div className="text-center mb-10 md:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
                        style={{ background: `${GOLD}22`, border: `1px solid ${GOLD}44` }}
                    >
                        <Gift className="w-3.5 h-3.5" style={{ color: GOLD }} />
                        <span className="text-xs font-black uppercase tracking-widest" style={{ color: GOLD }}>For Family</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-serif text-zinc-900 tracking-tight mb-3"
                    >
                        {recipientLabels[selectedRecipient] || 'Family Collections'} <span className="italic" style={{ color: GOLD }}>Edit</span>
                    </motion.h2>
                    <p className="text-sm md:text-base text-zinc-600 max-w-2xl mx-auto">
                        Curated silver jewellery picks for every family member, all using local collection assets.
                    </p>
                    <div className="w-20 h-1 mx-auto rounded-full mt-5" style={{ background: GOLD }} />
                </div>

                <div className="flex flex-wrap justify-center gap-3 mb-8 md:mb-12">
                    {Object.entries(recipientLabels).map(([recipientId, label]) => {
                        const isActive = recipientId === selectedRecipient;

                        return (
                            <button
                                key={recipientId}
                                type="button"
                                onClick={() => onSelectRecipient?.(recipientId)}
                                className="px-5 py-2.5 rounded-full text-[11px] md:text-xs font-black uppercase tracking-[0.18em] transition-all border"
                                style={{
                                    background: isActive ? GOLD : '#fff',
                                    color: isActive ? '#fff' : '#7c5a14',
                                    borderColor: isActive ? GOLD : '#f0d8a8'
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
                                className="bg-white rounded-2xl overflow-hidden transition-all duration-500 flex flex-col h-full border border-amber-50"
                                style={{ boxShadow: '0 4px 20px rgba(217,119,6,0.08)' }}
                                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 16px 40px rgba(217,119,6,0.2)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(217,119,6,0.08)'; }}
                            >
                                {product.badge && (
                                    <div
                                        className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-wider shadow"
                                        style={{ background: GOLD }}
                                    >
                                        {product.badge}
                                    </div>
                                )}

                                <div
                                    className="relative aspect-[4/5] overflow-hidden cursor-pointer"
                                    style={{ background: GOLD_LIGHT }}
                                    onClick={() => navigate(`/product/${product.id}`)}
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-[1.8s] group-hover:scale-110"
                                    />
                                    <button type="button" className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow hover:bg-amber-50 transition-colors">
                                        <Heart className="w-3.5 h-3.5 text-gray-400 group-hover:text-amber-500 transition-colors" />
                                    </button>
                                </div>

                                <div className="p-5 flex flex-col flex-grow">
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
                                        className="text-sm font-bold text-gray-800 mb-3 line-clamp-2 leading-snug cursor-pointer hover:text-amber-600 transition-colors"
                                        onClick={() => navigate(`/product/${product.id}`)}
                                    >
                                        {product.name}
                                    </h3>

                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-xl font-black text-zinc-900">INR {product.price}</span>
                                        <span className="text-xs text-gray-400 line-through">INR {product.originalPrice}</span>
                                    </div>

                                    <p className="text-xs text-gray-400 mb-4">Explore premium silver gifting ideas for your loved ones.</p>

                                    <button
                                        type="button"
                                        onClick={() => handleAddToCart(product)}
                                        className="mt-auto w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 text-white"
                                        style={{ background: GOLD }}
                                        onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                                    >
                                        <ShoppingBag className="w-3.5 h-3.5" />
                                        Shop Now
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-10 md:mt-16 text-center">
                    <motion.button
                        type="button"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        onClick={() => {
                            onSelectRecipient?.('all');
                            navigate('/category/family');
                        }}
                        className="px-12 py-4 rounded-full font-bold uppercase tracking-widest text-xs text-white transition-all shadow-lg hover:shadow-xl"
                        style={{ background: GOLD }}
                    >
                        Explore All Family Collections
                    </motion.button>
                </div>
            </div>
        </section>
    );
};

export default FamilyProductsCatalog;
