import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useShop } from '../../../context/ShopContext';

// Import images
import giftMother from '../assets/gift_mother_silver.png';
import giftFriends from '../assets/gift_friends_silver.png';
import giftWife from '../assets/gift_wife_silver.png';
import giftSister from '../assets/gift_sister_silver.png';
import dividerImg from '../assets/ornament-divider.png';

const recipients = [
    { id: 'mother', name: "Mother", image: giftMother, path: "/shop?recipient=mother" },
    { id: 'friends', name: "Friends", image: giftFriends, path: "/shop?recipient=friends" },
    { id: 'wife', name: "Wife", image: giftWife, path: "/shop?recipient=wife" },
    { id: 'sister', name: "Sister", image: giftSister, path: "/shop?recipient=sister" }
];

const PerfectGift = () => {
    const { homepageSections } = useShop();

    // Use admin-configured items if available, otherwise fall back to defaults
    const sectionData = homepageSections?.['perfect-gift'];
    const displayItems = sectionData?.items && sectionData.items.length > 0 ? sectionData.items : recipients;

    return (
        <section className="py-8 md:py-12 bg-gradient-to-b from-[#4A1015] to-[#2A0505] text-white"> {/* Reduced spacing */}
            <div className="container mx-auto px-2 md:px-4">
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-2xl md:text-5xl font-display font-medium text-white mb-4"
                    >
                        {sectionData?.label || "Find the Perfect Gift For"}
                    </motion.h2>
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: 96 }} // 24 * 4 = 96px
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="h-1 bg-[#C9A24D] mx-auto rounded-full"
                    ></motion.div>
                </div>



                {/* Staggered Grid Layout on Mobile (Matches Desktop Feel) */}
                <div className="flex flex-wrap md:flex-nowrap justify-center gap-3 md:gap-10 px-2 md:px-4 mb-12 md:mb-24">
                    {displayItems.map((item, index) => {
                        // Staggered Logic:
                        // Mobile: 0 & 3 (Top aligned), 1 & 2 (Pushed down)

                        // Mobile margin logic: Removed to align all in one line (grid)
                        const mobileMargin = 'mt-0';

                        // Desktop margin logic (existing):
                        const desktopMargin = (index === 0 || index === 3) ? 'md:mt-0' : 'md:mt-24';

                        const itemLabel = item.name || item.label;

                        const key = item.itemId || item._id || item.id || itemLabel || index;
                        return (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className={`w-[calc(50%-0.5rem)] md:w-56 lg:w-72 ${mobileMargin} ${desktopMargin}`}
                            >
                                <Link
                                    to={item.path}
                                    className="group relative block w-full aspect-[3/4] rounded-2xl md:rounded-[2rem] overflow-hidden border border-[#C9A24D]/20 shadow-lg transition-all duration-500 hover:shadow-[0_0_25px_rgba(201,162,77,0.3)] hover:border-[#C9A24D]/60 hover:-translate-y-2"
                                >
                                    {/* Image with Zoom Effect */}
                                    <div className="absolute inset-0 overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={`Gift for ${itemLabel}`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-60" />
                                    </div>

                                    <div className="absolute bottom-0 inset-x-0 p-4 md:p-6 flex flex-col items-center justify-end h-full text-center">
                                        <div className="relative z-10 transform translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
                                            <span className="font-display text-[10px] md:text-sm tracking-[0.2em] text-[#C9A24D] uppercase mb-1 md:mb-2 block opacity-100 md:opacity-0 md:translate-y-4 md:transition-all md:duration-500 md:group-hover:opacity-100 md:group-hover:translate-y-0">
                                                Gift For
                                            </span>
                                            <h3 className="text-xl md:text-3xl font-display text-white mb-2 drop-shadow-md">
                                                {itemLabel}
                                            </h3>
                                            <div className="w-12 h-0.5 bg-[#C9A24D] mx-auto rounded-full transition-all duration-500 group-hover:w-24 group-hover:bg-white" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Divider */}
                <div className="flex justify-center w-full px-4 mt-[-40px] relative z-10">
                    <motion.img
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 3.5 }}
                        transition={{ duration: 0.8 }}
                        src={dividerImg}
                        alt="Decorative Divider"
                        className="h-20 md:h-32 w-auto object-contain opacity-90"
                    />
                </div>
            </div>
        </section>
    );
};

export default PerfectGift;
