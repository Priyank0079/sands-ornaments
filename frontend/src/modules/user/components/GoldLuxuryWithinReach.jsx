import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import banner10k from '@assets/luxury_range_10k.png';
import range15k from '@assets/luxury_range_15k.png';
import range20k from '@assets/premium_ring_product.png';
import premiumGifts from '@assets/beyond_bold_emerald_set.png';

const GoldLuxuryWithinReach = () => {
    const navigate = useNavigate();

    const collections = [
        { id: '15k', title: 'Under ₹15k', image: range15k, path: '/shop?price_max=15000&metal=gold' },
        { id: '20k', title: 'Under ₹20k', image: range20k, path: '/shop?price_max=20000&metal=gold' },
        { id: 'premium', title: 'Premium Gifts', image: premiumGifts, path: '/shop?sort=price-desc&metal=gold' },
    ];

    return (
        <section className="w-full py-6 bg-[#F8FFF9] overflow-hidden">
            <div className="max-w-[1450px] mx-auto px-6">
                
                <div className="text-center mb-6">
                    <h2 className="text-xl md:text-2xl font-serif text-black">Luxury within Reach</h2>
                </div>

                {/* Main Wide Banner - Under 10K - Ultra Compact */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    onClick={() => navigate('/shop?price_max=10000&metal=gold')}
                    className="relative w-full h-[120px] md:h-[160px] rounded-[20px] overflow-hidden mb-5 group cursor-pointer shadow-md border border-white/20"
                >
                    <div className="absolute inset-0 bg-[#05140B]">
                        <img src={banner10k} alt="Gifts Under 10K" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2s]" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/10 to-transparent" />
                    </div>
                    
                    <div className="relative h-full flex flex-col justify-center px-8 md:px-12">
                        <div className="mb-0">
                             <p className="text-white/80 text-[10px] md:text-xs font-body leading-none mb-1 uppercase tracking-widest">Gifts</p>
                             <div className="flex items-baseline gap-1.5">
                                <span className="text-white text-2xl md:text-4xl font-black tracking-tighter">₹10K</span>
                                <span className="text-white/90 text-[10px] md:text-base font-medium uppercase">Under</span>
                             </div>
                        </div>
                        <div className="mt-2 md:mt-3">
                            <div className="bg-white/90 hover:bg-white text-black px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-2 transition-all">
                                Shop Now <ArrowRight size={12} />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom Grid - 15k, 20k, Premium - Ultra Compact */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
                    {collections.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            onClick={() => navigate(item.path)}
                            className="relative aspect-[3/1] md:aspect-[1.4] rounded-[20px] overflow-hidden group cursor-pointer shadow-sm border border-gray-100 bg-[#05140B]"
                        >
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-[1.5s]" />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                            
                            <div className="absolute inset-0 flex flex-col justify-end p-5">
                                <h3 className="text-white text-lg md:text-xl font-black tracking-tighter uppercase mb-0">{item.title}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default GoldLuxuryWithinReach;
