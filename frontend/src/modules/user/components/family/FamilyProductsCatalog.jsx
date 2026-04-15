import React from 'react';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { buildFamilyShopPath, normalizeFamilyRecipient } from '../../utils/familyNavigation';
import ProductCard from '../ProductCard';
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

const FamilyProductsCatalog = ({
    selectedRecipient = 'all',
    onSelectRecipient,
    allowedProductIds = null,
    minPrice = null,
    maxPrice = null,
    titleOverride = null,
    eyebrowOverride = null,
    subtitleOverride = null,
    hideRecipientFilters = false
}) => {
    const navigate = useNavigate();

    const parseMoney = (value) => Number(String(value || '').replace(/[^0-9.]/g, '')) || 0;

    const visibleProducts = familyProducts.filter((product) => {
        const price = parseMoney(product.price);
        const matchesRecipient = selectedRecipient === 'all' || product.recipient === selectedRecipient;
        const matchesAllowedIds = !Array.isArray(allowedProductIds) || allowedProductIds.length === 0 || allowedProductIds.includes(product.id);
        const matchesMin = minPrice === null || Number.isNaN(minPrice) || price >= minPrice;
        const matchesMax = maxPrice === null || Number.isNaN(maxPrice) || price <= maxPrice;
        return matchesRecipient && matchesAllowedIds && matchesMin && matchesMax;
    });

    const handleSelectRecipient = (recipientId) => {
        const normalizedRecipient = normalizeFamilyRecipient(recipientId);
        onSelectRecipient?.(normalizedRecipient);
        navigate(buildFamilyShopPath({ recipient: normalizedRecipient }));
    };

    const toCardProduct = (product) => {
        const price = parseMoney(product.price);
        const originalPrice = parseMoney(product.originalPrice);
        const isBestseller = String(product.badge || '').toLowerCase().includes('bestseller');

        return {
            id: product.id,
            _id: product.id,
            name: product.name,
            image: product.image,
            price,
            originalPrice,
            rating: product.rating,
            reviews: product.reviews,
            isTrending: isBestseller,
            priceDrop: originalPrice > price,
            variants: [{ id: `${product.id}-v1`, price, mrp: originalPrice }]
        };
    };

    return (
        <section id="family-products" className="py-3 md:py-10 bg-white">
            <div className="container mx-auto px-4 md:px-12 max-w-[1500px]">
                <div className="text-center mb-4 md:mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: -15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-none mb-2"
                        style={{ background: PINK_LIGHT, border: `1px solid ${MAROON}22` }}
                    >
                        <Gift className="w-3.5 h-3.5" style={{ color: MAROON }} />
                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: MAROON }}>
                            For Family
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-xl sm:text-3xl md:text-4xl font-serif text-[#2D060F] tracking-tight mb-1"
                    >
                        {(titleOverride || recipientLabels[selectedRecipient] || 'Family Collections')}{' '}
                        <span className="italic" style={{ color: MAROON }}>
                            {eyebrowOverride || 'Edit'}
                        </span>
                    </motion.h2>

                    <p className="text-[10px] md:text-xs text-zinc-500 max-w-xl mx-auto italic">
                        {subtitleOverride || '"Curated boutique jewellery picks for every family member."'}
                    </p>
                    <div className="w-10 h-[1px] mx-auto mt-2.5 md:mt-5" style={{ background: PINK_LIGHT }} />
                </div>

                {!hideRecipientFilters && (
                    <div className="grid grid-cols-2 gap-2 max-w-[560px] mx-auto md:flex md:flex-wrap md:justify-center md:gap-3 mb-4 md:mb-10">
                        {Object.entries(recipientLabels).map(([recipientId, label], index, entries) => {
                            const isActive = recipientId === selectedRecipient;
                            const isLastOdd = entries.length % 2 === 1 && index === entries.length - 1;

                            return (
                                <button
                                    key={recipientId}
                                    type="button"
                                    onClick={() => handleSelectRecipient(recipientId)}
                                    className={`w-full md:w-auto px-3 py-1.5 md:px-4 md:py-2 rounded-none text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] transition-all border leading-none ${isLastOdd ? 'col-span-2' : ''}`}
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
                )}

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                    {visibleProducts.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55, delay: (idx % 4) * 0.1 }}
                            className="group relative"
                        >
                            <ProductCard product={toCardProduct(product)} />
                        </motion.div>
                    ))}
                </div>

                <div className="mt-6 md:mt-12 text-center">
                    <motion.button
                        type="button"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        onClick={() => handleSelectRecipient('all')}
                        className="px-8 py-3 md:px-10 md:py-3.5 rounded-none font-bold uppercase tracking-widest text-[10px] transition-all shadow-md hover:shadow-lg"
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
