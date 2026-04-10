import React from 'react';
import { motion } from 'framer-motion';
import { Gem, RotateCcw, Truck, FileText, Shield, Gift, Sparkles, Lock, CreditCard } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';

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
        <section className="py-12 md:py-20 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12 md:mb-16">
                    <span className="text-[#D39A9F] text-[9px] md:text-xs font-bold tracking-[0.4em] uppercase mb-3 block">Our Commitments</span>
                    <h2 className="font-display text-3xl md:text-4xl text-[#8E4A50]">{sectionData?.label || 'Why Choose Us'}</h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 max-w-6xl mx-auto px-4">
                    {promises.map((item, index) => {
                        const Icon = iconMap[item.iconKey] || Gem;

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="relative group flex flex-col items-center pt-10 pb-6 px-4 cursor-default"
                            >
                                <div className="absolute inset-x-0 inset-y-0 border border-[#D39A9F]/25 rounded-t-full rounded-b-[2px] transition-all duration-500 group-hover:border-[#D39A9F]/50 shadow-[0_4px_25px_rgba(211,154,159,0.03)]" />

                                <div className="relative z-10 flex flex-col items-center text-center w-full">
                                    <div className="mb-6 text-[#8E4A50] group-hover:scale-110 transition-transform duration-500">
                                        <Icon strokeWidth={1} className="w-6 h-6 md:w-8 md:h-8" />
                                    </div>

                                    <div className="relative mb-2 w-full px-2">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-3 md:h-4 bg-[#D39A9F]/10 blur-md rounded-full -z-10 group-hover:bg-[#D39A9F]/20 transition-all duration-500" />

                                        <h3 className="font-serif italic text-lg md:text-2xl text-[#8E4A50] leading-none whitespace-nowrap tracking-tight">
                                            {item.title}
                                        </h3>
                                    </div>

                                    <div className="space-y-1">
                                        <h4 className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-[#D39A9F]">{item.subtitle}</h4>
                                        <p className="text-[9px] md:text-[11px] text-gray-400 font-medium leading-tight opacity-0 group-hover:opacity-100 transition-opacity duration-500">
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
