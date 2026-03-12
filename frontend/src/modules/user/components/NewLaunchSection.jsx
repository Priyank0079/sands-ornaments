import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';

// Import images
import newEarrings from '../assets/new_launch_earrings.png';
import newChains from '../assets/new_launch_chains.png';
import newStuds from '../assets/new_launch_studs.png';
import newBracelets from '../assets/new_launch_bracelets.png';
import newAnklets from '../assets/new_launch_anklets.png';

const newLaunches = [
    { id: 'earrings', name: "Earrings", image: newEarrings, path: "/category/earrings" },
    { id: 'chains', name: "Chains", image: newChains, path: "/category/chains" },
    { id: 'studs', name: "Studs", image: newStuds, path: "/category/studs" },
    { id: 'bracelets', name: "Bracelets", image: newBracelets, path: "/category/bracelets" },
    { id: 'anklets', name: "Anklets", image: newAnklets, path: "/category/anklets" }
];

const NewLaunchSection = () => {
    const { homepageSections } = useShop();

    // Use admin-configured items if available, otherwise fall back to defaults
    const sectionData = homepageSections?.['new-launch'];
    const displayItems = sectionData?.items && sectionData.items.length > 0 ? sectionData.items : newLaunches;

    return (
        <section className="py-16 md:py-24 bg-[#FFF0F0] relative overflow-hidden">

            <div className="container mx-auto px-2 md:px-4 relative z-10">

                {/* Header Area */}
                {/* Header Area - Center Heading, Right Button */}
                <div className="relative flex flex-col md:block items-center justify-center mb-10">

                    {/* Centered Content */}
                    <div className="flex flex-col items-center justify-center gap-3 text-center md:w-full">
                        {/* Simple Wine Badge */}
                        <div className="inline-block bg-[#722F37] text-white px-4 py-1 font-display tracking-wider text-xs uppercase rounded-sm shadow-sm opacity-90">
                            New Launch
                        </div>

                        {/* Classy & Sweet Heading - Straight */}
                        <h3 className="font-display text-[#1F1F1F] text-3xl md:text-4xl font-medium tracking-wider uppercase">
                            {sectionData?.label || "Limited Edition"}
                        </h3>
                    </div>

                </div>

                {/* Cards Row */}
                <div className="flex flex-wrap md:flex-nowrap justify-center gap-6 md:gap-8">
                    {displayItems.map((item, index) => {
                        const itemLabel = item.name || item.label;

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="w-[45%] md:w-56 lg:w-64"
                            >
                                <Link to={item.path} className="group block relative">
                                    {/* Square Card Container */}
                                    <div className="relative rounded-3xl overflow-hidden aspect-square bg-white shadow-[0_15px_35px_rgba(0,0,0,0.2)] group-hover:shadow-[0_25px_50px_rgba(114,47,55,0.4)] transition-all duration-500 transform group-hover:-translate-y-2 isolate">



                                        {/* Image */}
                                        <div className="absolute inset-0 overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={itemLabel}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#2A0505]/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                                        {/* Content - Bottom Center */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center justify-end text-center z-10">

                                            {/* Name */}
                                            <h4 className="font-display font-medium text-xl text-white tracking-wide mb-1 transform transition-transform duration-300 group-hover:-translate-y-1">
                                                {itemLabel}
                                            </h4>

                                            {/* Divider */}
                                            <div className="w-8 h-0.5 bg-[#C9A24D] rounded-full mb-2 opacity-50 group-hover:w-16 group-hover:opacity-100 transition-all duration-500"></div>

                                            {/* Action Text */}
                                            <span className="text-[#C9A24D] text-xs font-medium uppercase tracking-[0.2em] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                                Discover
                                            </span>
                                        </div>

                                        {/* Border Glow Effect */}
                                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#C9A24D]/30 rounded-3xl transition-colors duration-300 pointer-events-none"></div>
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>

            </div>
        </section>
    );
};

export default NewLaunchSection;
