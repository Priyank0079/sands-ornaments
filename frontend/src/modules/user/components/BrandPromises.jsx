import React from 'react';
import { motion } from 'framer-motion';
import { Gem, RotateCcw, Truck, FileText, Shield, Gift, Sparkles, Lock, CreditCard } from 'lucide-react';
import { useHomepageCms } from '../hooks/useHomepageCms';

const iconMap = {
    gem: Gem,
    'rotate-ccw': RotateCcw,
    truck: Truck,
    'file-text': FileText,
    shield: Shield,
    gift: Gift,
    sparkles: Sparkles,
    lock: Lock,
    'credit-card': CreditCard
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
    const { data: homepageSections = {} } = useHomepageCms();
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
        <section className="py-12 md:py-16 bg-[#FDF8F8] relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-10 md:mb-14">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-sans text-2xl md:text-3xl text-gray-900 font-semibold tracking-tight"
                    >
                        {sectionData?.label || 'Our Commitments'}
                    </motion.h2>
                    <div className="w-12 h-[2px] bg-[#8E2B45]/20 mx-auto mt-4 rounded-full" />
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 max-w-6xl mx-auto">
                    {promises.map((item, index) => {
                        const Icon = iconMap[item.iconKey] || Gem;

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="relative group flex flex-col items-center p-6 md:p-8 bg-gradient-to-br from-[#8E2B45] via-[#721B32] to-[#5C1625] rounded-[2.5rem] shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-default"
                            >
                                {/* Inner Glow Effect */}
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                
                                <div className="relative z-10 flex flex-col items-center text-center w-full">
                                    {/* Icon Container */}
                                    <div className="mb-4 md:mb-6 p-4 rounded-2xl bg-white/10 border border-white/20 text-white group-hover:scale-110 group-hover:rotate-[360deg] transition-all duration-700">
                                        <Icon strokeWidth={1.5} className="w-7 h-7 md:w-9 md:h-9" />
                                    </div>

                                    <div className="space-y-1 md:space-y-2">
                                        <h3 className="font-sans font-bold text-base md:text-xl text-white leading-tight">
                                            {item.title}
                                        </h3>
                                        <h4 className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-[#D9C4B1]">
                                            {item.subtitle}
                                        </h4>
                                        <div className="w-8 h-px bg-white/20 mx-auto my-2 group-hover:w-12 group-hover:bg-[#D9C4B1] transition-all duration-500" />
                                        <p className="text-[10px] md:text-xs text-white/60 font-light leading-relaxed max-w-[140px] mx-auto group-hover:text-white/90 transition-colors">
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
