import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { buildWomenShopPath } from '../../utils/womenNavigation';

import budgetEarrings from '../../../../assets/promos/budget_earrings.png';
import budgetPendant from '../../../../assets/promos/budget_pendant.png';

const WomenPriceRange = () => {
    return (
        <section className="py-8 md:py-16 bg-[#FDF8F8] overflow-hidden">
            <div className="container mx-auto px-4 max-w-[1250px]">
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    
                    {/* Left Design: Vertical Layout with Arrow */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-center md:items-start text-center md:text-left md:min-w-[240px]"
                    >
                        <div className="mb-6">
                            <h2 className="text-3xl md:text-5xl font-serif text-gray-900 leading-[1.1] tracking-tight">
                                Under <br />
                                <span className="text-[#9C5B61] italic font-light">₹999</span> <br />
                                Store
                            </h2>
                        </div>
                        
                        <Link 
                            to={buildWomenShopPath({ category: 'women', priceMax: 999 })}
                            className="group relative"
                        >
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-gray-200 flex items-center justify-center transition-all duration-700 ease-out group-hover:bg-[#9C5B61] group-hover:border-[#9C5B61] group-hover:text-white group-hover:shadow-lg">
                                <ArrowRight className="w-6 h-6 md:w-7 md:h-7 group-hover:translate-x-1.5 transition-transform duration-500" />
                            </div>
                            
                            {/* Decorative Ripple Effect */}
                            <div className="absolute inset-0 rounded-full bg-[#9C5B61]/20 scale-100 group-hover:scale-150 opacity-0 group-hover:opacity-0 transition-all duration-1000" />
                        </Link>
                    </motion.div>

                    {/* Right Design: Landscape Cards Flow */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-8 w-full">
                        
                        {/* Collection Card 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="w-full"
                        >
                            <Link to={buildWomenShopPath({ category: 'women', priceMax: 1499 })} className="group relative block w-full aspect-[16/9.5] overflow-hidden rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-500">
                                <img 
                                    src={budgetEarrings} 
                                    alt="Luxury Earrings" 
                                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" 
                                />
                                {/* Soft Brand Tint Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#4A1B24]/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                                
                                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                                    <motion.div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                                        <h3 className="text-white font-bold text-2xl md:text-3xl tracking-tight mb-1">SOULitaire</h3>
                                        <div className="h-[1px] w-8 bg-white/40 mb-2 group-hover:w-16 transition-all duration-500" />
                                        <p className="text-white/90 text-sm font-medium tracking-[0.1em] uppercase">Under ₹1499</p>
                                    </motion.div>
                                </div>
                            </Link>
                        </motion.div>

                        {/* Collection Card 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="w-full"
                        >
                            <Link to={buildWomenShopPath({ category: 'women', priceMax: 1999 })} className="group relative block w-full aspect-[16/9.5] overflow-hidden rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-500">
                                <img 
                                    src={budgetPendant} 
                                    alt="Luxury Pendant" 
                                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" 
                                />
                                {/* Soft Brand Tint Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#4A1B24]/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                                
                                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                                    <motion.div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                                        <h3 className="text-white font-bold text-2xl md:text-3xl tracking-tight mb-1">Beyond Bold</h3>
                                        <div className="h-[1px] w-8 bg-white/40 mb-2 group-hover:w-16 transition-all duration-500" />
                                        <p className="text-white/90 text-sm font-medium tracking-[0.1em] uppercase">Under ₹1999</p>
                                    </motion.div>
                                </div>
                            </Link>
                        </motion.div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default WomenPriceRange;
