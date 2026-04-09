import React from 'react';
import { motion } from 'framer-motion';

import giftMother from '../../assets/gift_mother_silver.png';
import giftFather from '../../assets/gift_husband_silver.png';
import giftBrother from '../../assets/gift_brother_silver.png';
import giftSister from '../../assets/gift_sister_silver.png';
import giftHusband from '../../assets/gift_husband_silver.png';
import giftWife from '../../assets/gift_wife_silver.png';

const recipients = [
    { id: 'all', title: 'ALL', image: giftMother, subtitle: 'Every loved one' },
    { id: 'mother', title: 'MOTHER', image: giftMother, subtitle: 'Graceful keepsakes' },
    { id: 'father', title: 'FATHER', image: giftFather, subtitle: 'Classic silver picks' },
    { id: 'brother', title: 'BROTHER', image: giftBrother, subtitle: 'Bold everyday styles' },
    { id: 'sister', title: 'SISTER', image: giftSister, subtitle: 'Delicate favourites' },
    { id: 'husband', title: 'HUSBAND', image: giftHusband, subtitle: 'Signature essentials' },
    { id: 'wife', title: 'WIFE', image: giftWife, subtitle: 'Elegant gifting edits' }
];

const FamilyRecipientCategories = ({ selectedRecipient = 'all', onSelectRecipient }) => {
    const handleClick = (recipientId) => {
        onSelectRecipient?.(recipientId);

        const productsSection = document.getElementById('family-products');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <section className="py-20 px-4 md:px-12 bg-[#FFF8F1]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center"
                    >
                        <span className="text-xs font-black uppercase tracking-[0.4em] text-amber-500 mb-3">Family Edit</span>
                        <h2 className="text-4xl md:text-6xl font-serif text-zinc-900 tracking-tight flex flex-col md:flex-row items-center gap-3">
                            SHOP BY <span className="italic font-light text-amber-600">RELATION</span>
                        </h2>
                        <p className="max-w-2xl text-sm md:text-base text-zinc-600">
                            Choose a family member and explore curated gifting jewellery designed for every bond.
                        </p>
                        <div className="w-24 h-[1px] bg-amber-200 mt-6" />
                    </motion.div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-5 md:gap-6">
                    {recipients.map((recipient, index) => {
                        const isActive = selectedRecipient === recipient.id;

                        return (
                            <motion.button
                                key={recipient.id}
                                type="button"
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                viewport={{ once: true }}
                                onClick={() => handleClick(recipient.id)}
                                className={`group relative block aspect-square rounded-[28px] overflow-hidden text-left transition-all duration-500 ${
                                    isActive
                                        ? 'ring-2 ring-amber-500 shadow-[0_20px_45px_-20px_rgba(180,83,9,0.55)]'
                                        : 'shadow-[0_18px_40px_-24px_rgba(0,0,0,0.22)] hover:-translate-y-2 hover:shadow-[0_22px_48px_-18px_rgba(0,0,0,0.28)]'
                                }`}
                            >
                                <img
                                    src={recipient.image}
                                    alt={recipient.title}
                                    className="w-full h-full object-cover transition-transform duration-[1.8s] ease-out group-hover:scale-110"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                                    <span className="block text-white text-sm md:text-base font-black tracking-[0.14em]">
                                        {recipient.title}
                                    </span>
                                    <span className="block mt-1 text-[11px] md:text-xs text-white/75 tracking-[0.08em] uppercase">
                                        {recipient.subtitle}
                                    </span>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FamilyRecipientCategories;
