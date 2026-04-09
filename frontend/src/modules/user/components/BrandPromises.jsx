import React from 'react';
import { motion } from 'framer-motion';
import { Gem, RotateCcw, Truck, FileText } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';

const iconMap = {
    gem: Gem,
    'rotate-ccw': RotateCcw,
    truck: Truck,
    'file-text': FileText
};

const FALLBACK_PROMISES = [
    {
        id: 1,
        iconKey: 'gem',
        title: 'Pure 925',
        subtitle: 'SILVER',
        desc: 'Certified Authenticity'
    },
    {
        id: 2,
        iconKey: 'rotate-ccw',
        title: '30-Day Easy',
        subtitle: 'RETURN',
        desc: 'Hassle-free Refund'
    },
    {
        id: 3,
        iconKey: 'truck',
        title: 'Free Delivery',
        subtitle: 'ABOVE INR 999',
        desc: 'Fast Shipping'
    },
    {
        id: 4,
        iconKey: 'file-text',
        title: 'T&C Apply',
        subtitle: 'SECURE SHOP',
        desc: '100% Protection'
    }
];

const BrandPromises = () => {
    const { homepageSections } = useShop();
    const sectionData = homepageSections?.['brand-promises'];

    const promises = Array.isArray(sectionData?.items) && sectionData.items.length > 0
        ? sectionData.items.map((item, index) => ({
            id: item.itemId || item.id || item._id || `promise-${index + 1}`,
            iconKey: item.iconKey || FALLBACK_PROMISES[index]?.iconKey || 'gem',
            title: item.name || item.label || FALLBACK_PROMISES[index]?.title || 'Promise',
            subtitle: item.subtitle || FALLBACK_PROMISES[index]?.subtitle || '',
            desc: item.description || FALLBACK_PROMISES[index]?.desc || ''
        }))
        : FALLBACK_PROMISES;

    return (
        <section className="py-12 md:py-24 bg-[#FDF8F8] relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12 md:mb-20">
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[#9C5AF6] text-[9px] md:text-xs font-bold tracking-[0.4em] uppercase mb-4 block opacity-60"
                        style={{ color: '#4A0E0E' }}
                    >
                        Our Commitments
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-display text-4xl md:text-5xl text-[#4A0E0E]"
                    >
                        {sectionData?.label || 'Premium Experience'}
                    </motion.h2>
                    <div className="w-16 h-1 bg-[#D9C4B1] mx-auto mt-6 rounded-full" />
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-10 max-w-7xl mx-auto px-4">
                    {promises.map((item, index) => {
                        const Icon = iconMap[item.iconKey] || Gem;

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className="relative group flex flex-col items-center pt-16 pb-10 px-6 cursor-default isolate"
                            >
                                {/* Dark Background UI Card */}
                                <div 
                                    className="absolute inset-0 bg-[#3D0A0A] rounded-[2.5rem] md:rounded-[4rem] transition-all duration-700 shadow-2xl group-hover:bg-[#4A0E0E] group-hover:scale-[1.03]"
                                    style={{ 
                                        clipPath: 'polygon(0% 25%, 50% 0%, 100% 25%, 100% 100%, 0% 100%)',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                                    }}
                                />
                                
                                {/* Inner Glow Effect */}
                                <div className="absolute inset-0 rounded-[4rem] opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none bg-gradient-to-t from-white to-transparent" />

                                <div className="relative z-10 flex flex-col items-center text-center w-full">
                                    {/* Icon Container with Gold Accent */}
                                    <div className="mb-8 p-4 rounded-full bg-white/5 border border-white/10 text-[#D9C4B1] group-hover:text-white group-hover:scale-110 group-hover:rotate-[360deg] transition-all duration-700 shadow-lg">
                                        <Icon strokeWidth={1} className="w-8 h-8 md:w-10 md:h-10" />
                                    </div>

                                    <div className="relative mb-3 w-full px-2">
                                        <h3 className="font-serif italic text-xl md:text-3xl text-white leading-tight tracking-tight">
                                            {item.title}
                                        </h3>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-[#D9C4B1]/80 group-hover:text-[#D9C4B1] transition-colors">
                                            {item.subtitle}
                                        </h4>
                                        <div className="w-8 h-px bg-white/20 mx-auto transition-all duration-500 group-hover:w-16 group-hover:bg-[#D9C4B1]/50" />
                                        <p className="text-[10px] md:text-xs text-rose-100/40 font-light leading-relaxed max-w-[120px] mx-auto opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default BrandPromises;
