import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Import assets from silver category icons/gifts
import giftWife from '@assets/gift_wife_silver.png';
import giftGF from '@assets/gift_gf_silver.png';
import giftMother from '@assets/gift_mother_silver.png';
import giftSister from '@assets/gift_sister_silver.png';

const BONDS = [
    {
        id: 1,
        label: 'Wife',
        image: giftWife,
        path: '/shop?search=wife&metal=gold'
    },
    {
        id: 2,
        label: 'Girlfriend',
        image: giftGF,
        path: '/shop?search=girlfriend&metal=gold'
    },
    {
        id: 3,
        label: 'Mother',
        image: giftMother,
        path: '/shop?search=mother&metal=gold'
    },
    {
        id: 4,
        label: 'Sister',
        image: giftSister,
        path: '/shop?search=sister&metal=gold'
    }
];

const CuratedForEveryBond = () => {
    return (
        <section className="w-full bg-[#FBF3EF] py-6 md:py-8 px-4 md:px-12 overflow-hidden select-none">
            <div className="max-w-[1000px] mx-auto">
                <div className="text-center mb-6 md:mb-8">
                    <h2 className="text-[22px] md:text-[28px] font-serif text-[#333] tracking-wide">
                        Curated For Every Bond
                    </h2>
                </div>

                {/* Bonds Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {BONDS.map((bond) => (
                        <Link 
                            key={bond.id} 
                            to={bond.path} 
                            className="group block"
                        >
                            <motion.div 
                                whileHover={{ y: -6 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="relative flex flex-col items-center"
                            >
                                {/* Card Image with Portriat Ratio and Rounded Corners - No Green Effect */}
                                <div className="relative w-full aspect-[5/6] overflow-hidden rounded-[20px] shadow-sm border border-white/30">
                                    <img 
                                        src={bond.image} 
                                        alt={bond.label}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    {/* Subtle Overlay for depth only */}
                                    <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                                </div>

                                {/* White Label Box below card matching screenshot style */}
                                <div className="mt-[-15px] z-10 w-[80%] bg-white py-1.5 px-3 rounded-full shadow-md text-center border border-[#eee]">
                                    <span className="text-[#2A4D35] font-serif italic text-xs md:text-base font-medium tracking-tight">
                                        {bond.label}
                                    </span>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CuratedForEveryBond;

