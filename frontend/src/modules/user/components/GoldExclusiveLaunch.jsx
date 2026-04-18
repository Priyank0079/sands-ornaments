import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import solitaireImg from '@assets/categories/gold_rings_green.png';
import statementImg from '@assets/categories/gold_sets_green.png';

const GoldExclusiveLaunch = () => {
    const navigate = useNavigate();

    const handleNavigate = (type) => {
        if (type === 'solitaire') {
            navigate('/shop?search=solitaire&metal=gold');
        } else if (type === 'statement') {
            navigate('/shop?search=statement&metal=gold');
        }
    };

    return (
        <section className="w-full py-10 bg-white overflow-hidden">
            <div className="max-w-[1450px] mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12">

                    {/* Left Side: Title - More compact */}
                    <div className="lg:w-[180px] flex flex-col items-start shrink-0">
                        <h2 className="text-[26px] md:text-[32px] font-medium leading-[1.1] text-[#1A1A1A] tracking-tight mb-6 font-body">
                            Exclusive<br />
                            Collection<br />
                            Launch
                        </h2>
                        <div
                            className="group cursor-pointer"
                            onClick={() => navigate('/shop?new_arrival=true&metal=gold')}
                        >
                            <div className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-full group-hover:border-black group-hover:bg-black transition-all duration-500">
                                <ArrowRight className="w-5 h-5 text-gray-900 group-hover:text-white transition-colors duration-500" />
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Two Cards - Reduced height for compactness */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

                        {/* Card 1: SOULitaire */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            onClick={() => handleNavigate('solitaire')}
                            className="relative h-[180px] md:h-[260px] rounded-[24px] overflow-hidden group cursor-pointer shadow-xl"
                        >
                            <div className="absolute inset-0 bg-[#0D2015]">
                                <img
                                    src={solitaireImg}
                                    alt="SOULitaire Collection"
                                    className="w-full h-full object-cover scale-[1.02] group-hover:scale-105 transition-transform duration-1000 ease-out p-3"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent opacity-50" />
                            </div>

                            <div className="relative h-full p-6 md:p-8 flex flex-col justify-start z-10">
                                <h3 className="text-white text-[22px] md:text-[30px] font-black leading-none mb-1 tracking-tighter uppercase font-body">
                                    SOULitaire
                                </h3>
                                <p className="text-white/80 text-[12px] md:text-[14px] font-medium tracking-wide font-body">
                                    Solitaire Collection
                                </p>
                            </div>

                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </motion.div>

                        {/* Card 2: Beyond Bold */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                            onClick={() => handleNavigate('statement')}
                            className="relative h-[180px] md:h-[260px] rounded-[24px] overflow-hidden group-pointer shadow-xl cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-[#0D2015]">
                                <img
                                    src={statementImg}
                                    alt="Beyond Bold Statement Collection"
                                    className="w-full h-full object-cover scale-[1.02] group-hover:scale-105 transition-transform duration-1000 ease-out p-3"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent opacity-50" />
                            </div>

                            <div className="relative h-full p-6 md:p-8 flex flex-col justify-start z-10">
                                <h3 className="text-white text-[22px] md:text-[30px] font-black leading-none mb-1 tracking-tighter uppercase font-body">
                                    Beyond Bold
                                </h3>
                                <p className="text-white/80 text-[12px] md:text-[14px] font-medium tracking-wide font-body">
                                    Statement Collection
                                </p>
                            </div>

                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </motion.div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default GoldExclusiveLaunch;
