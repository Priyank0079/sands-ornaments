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
        <section className="py-6 md:py-8 px-4 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-6 space-y-2">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center"
                    >
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-[#8E2B45] mb-2 bg-[#FFD9E0] px-3 py-1">Family Edit</span>
                        <h2 className="text-2xl md:text-4xl font-serif text-[#2D060F] tracking-tight flex flex-col md:flex-row items-center gap-2">
                            SHOP BY <span className="italic font-light text-[#8E2B45]">RELATION</span>
                        </h2>
                        <p className="max-w-xl text-[10px] md:text-xs text-zinc-400 mt-2">
                            Explore curated gifting jewellery designed for every bond.
                        </p>
                        <div className="w-10 h-[1px] bg-[#FFD9E0] mt-4" />
                    </motion.div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4 md:gap-5">
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
                                className={`group relative block aspect-square rounded-2xl overflow-hidden text-left transition-all duration-500 ${
                                    isActive
                                        ? 'ring-2 ring-[#8E2B45] shadow-lg'
                                        : 'shadow-md hover:-translate-y-1 hover:shadow-xl'
                                }`}
                            >
                                <img
                                    src={recipient.image}
                                    alt={recipient.title}
                                    className="w-full h-full object-cover transition-transform duration-[1.8s] ease-out group-hover:scale-110"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                                <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                                    <span className="block text-white text-xs md:text-sm font-black tracking-[0.12em]">
                                        {recipient.title}
                                    </span>
                                    <span className="block mt-0.5 text-[9px] md:text-[10px] text-white/75 tracking-[0.08em] uppercase">
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
