import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useHomepageCms } from '../hooks/useHomepageCms';
import { resolveLegacyCmsAsset } from '../utils/legacyCmsAssets';

import budget1000 from '../../../assets/promos/budget_1000.png';
import budget2000 from '../../../assets/promos/budget_2000.png';

const ShopByPrice = () => {
    const navigate = useNavigate();
    const { data: homepageSections = {} } = useHomepageCms();
    const sectionData = homepageSections?.['luxury-within-reach'];

    const configuredItems = Array.isArray(sectionData?.items) ? sectionData.items : [];
    const displayItems = configuredItems.length > 0
        ? configuredItems.map((item, index) => {
            const isFirst = index === 0;
            return {
                id: item.itemId || item._id || item.id || `price-${index}`,
                title: item.name || item.label || (isFirst ? 'UNDER INR 1000' : 'UNDER INR 1999'),
                image: resolveLegacyCmsAsset(item.image, isFirst ? budget1000 : budget2000),
                path: item.path || (item.priceMax ? `/shop?price_max=${item.priceMax}` : (isFirst ? '/shop?price_max=1000' : '/shop?price_max=1999'))
            };
        })
        : [
            {
                id: 'under-1000',
                title: 'UNDER INR 1000',
                image: budget1000,
                path: '/shop?price_max=1000'
            },
            {
                id: 'under-1999',
                title: 'UNDER INR 1999',
                image: budget2000,
                path: '/shop?price_max=1999'
            }
        ];

    return (
        <section className="py-8 md:py-16 bg-[#FFFBFB]">
            <div className="container mx-auto px-4 max-w-[1240px]">
                <div className="flex flex-col items-center mb-8 md:mb-12 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block bg-[#9C5B61] text-white px-4 py-1.5 text-[9px] md:text-[11px] font-black tracking-[0.4em] uppercase mb-4 rounded-sm shadow-md"
                    >
                        GIFT THE EXCELLENCE
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-6xl font-serif text-gray-950 tracking-tight leading-none mb-6"
                    >
                        Luxury <span className="italic font-light text-[#9C5B61]">within Reach</span>
                    </motion.h2>
                    <div className="w-16 h-[2px] bg-[#9C5B61]/30 rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-[1100px] mx-auto">
                    {displayItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            whileHover={{ y: -8 }}
                            onClick={() => navigate(item.path)}
                            className="relative aspect-[16/8] md:aspect-[16/7] rounded-[32px] overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-700"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-700" />
                            <div className="absolute inset-0 bg-[#9C5B61]/20 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700" />

                            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center">
                                <div className="transform transition-transform duration-700 group-hover:translate-x-3">
                                    <h3 className="text-white font-serif text-3xl md:text-5xl tracking-tight mb-2 drop-shadow-lg">
                                        {item.title}
                                    </h3>
                                    <div className="h-[3px] w-10 bg-[#C9A24D] mb-4 group-hover:w-24 transition-all duration-700 rounded-full shadow-glow" />
                                </div>
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none transform -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s]" />
                            <div className="absolute top-6 right-6 w-10 h-10 border-t-2 border-r-2 border-white/30 rounded-tr-xl group-hover:border-white/60 transition-colors duration-500" />
                        </motion.div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .shadow-glow {
                    box-shadow: 0 0 10px rgba(201, 162, 77, 0.5);
                }
            `}</style>
        </section>
    );
};

export default ShopByPrice;
