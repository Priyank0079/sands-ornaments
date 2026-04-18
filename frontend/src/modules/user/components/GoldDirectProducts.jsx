import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useShop } from '../../../context/ShopContext';
import ProductCard from './ProductCard';
import { COLLECTION_MOCK_PRODUCTS } from '../data/mockCollectionData.js';

const GoldDirectProducts = () => {
    const { products } = useShop();

    const displayProducts = useMemo(() => {
        // 1. Try to get real products from context
        let list = products.filter(p => p.metal?.toLowerCase() === 'gold');

        // 2. If none, pull from our high-quality mock data
        if (list.length === 0) {
            const goldMocks = [
                ...COLLECTION_MOCK_PRODUCTS['24k'],
                ...COLLECTION_MOCK_PRODUCTS['22k']
            ];
            list = goldMocks.map(m => ({
                id: m.id,
                _id: m.id,
                name: m.name,
                price: m.price,
                img: m.img,
                image: m.img,
                images: [m.img],
                isTrending: true,
                rating: 4.5,
                reviewCount: 0,
                originalPrice: m.price * 1.5,
                priceDrop: true,
                metal: 'gold'
            }));
        }

        return list.slice(0, 4);
    }, [products]);

    return (
        <section className="w-full py-12 bg-white">
            <div className="max-w-[1450px] mx-auto px-6">
                
                {/* Header Style (Matching Boutique Branding) */}
                <div className="mb-10">
                    <p className="text-[#B58E3E] text-sm font-bold uppercase tracking-[0.3em] mb-1">
                        Our Collection
                    </p>
                    <h2 className="text-4xl md:text-5xl font-serif text-[#702931] leading-tight">
                        All Jewellery
                    </h2>
                </div>

                {/* Product Grid - Using standard ProductCard for consistent UI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                    {displayProducts.map((product, idx) => (
                        <motion.div
                            key={product.id || product._id}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GoldDirectProducts;
