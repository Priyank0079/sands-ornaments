import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { resolveLegacyCmsAsset } from '../utils/legacyCmsAssets';

// Import local high-end customer portraits
import customer1 from '../../../assets/testimonial_customer_1.png';
import customer2 from '../../../assets/testimonial_customer_2.png';
import customer3 from '../../../assets/testimonial_customer_3.png';

const TESTIMONIALS = [
    {
        id: 1,
        name: "Ananya Sharma",
        role: "Verified Buyer",
        image: customer1,
        rating: 5,
        text: "The 925 silver ring I ordered is even more beautiful in person! The craftsmanship is exquisite, and the packaging felt so premium. It's my new favorite piece of jewelry.",
        location: "Mumbai"
    },
    {
        id: 2,
        name: "Rahul Verma",
        role: "Gift Purchase",
        image: customer2,
        rating: 5,
        text: "Bought a bracelet for my sister's birthday. She absolutely loved it! The shine is perfect, and the delivery was very fast. Highly recommend Sands Ornaments for quality silver.",
        location: "Delhi"
    },
    {
        id: 3,
        name: "Priya Patel",
        role: "Regular Customer",
        image: customer3,
        rating: 5,
        text: "I've purchased multiple items now, and they never disappoint. The 'Style It Your Way' collections are so well-curated. Elegant, timeless, and very classy design language.",
        location: "Bangalore"
    }
];

const Testimonials = () => {
    const { homepageSections } = useShop();
    const sectionData = homepageSections?.testimonials;
    const configuredItems = Array.isArray(sectionData?.items) ? sectionData.items : [];
    const displayItems = configuredItems.length > 0
        ? configuredItems.map((item, index) => ({
            id: item.itemId || item._id || item.id || `testimonial-${index + 1}`,
            name: item.name || TESTIMONIALS[index]?.name || 'Customer Story',
            role: item.subtitle || TESTIMONIALS[index]?.role || 'Verified Buyer',
            image: resolveLegacyCmsAsset(item.image, TESTIMONIALS[index]?.image || customer1),
            rating: Number(item.rating) || TESTIMONIALS[index]?.rating || 5,
            text: item.description || TESTIMONIALS[index]?.text || '',
            location: item.location || TESTIMONIALS[index]?.location || ''
        }))
        : TESTIMONIALS;

    return (
        <section 
            className="w-full pt-10 md:pt-14 pb-0 overflow-hidden select-none"
            style={{ background: 'linear-gradient(135deg, #FDF4F6 0%, #FAEAF0 100%)' }}
        >
            {/* Heading Section */}
            <div className="container mx-auto px-4 mb-8 md:mb-10 text-center">
                <span className="text-[#A57A82] text-[10px] md:text-sm font-bold tracking-[0.4em] uppercase mb-2 block">Kind Words</span>
                <h2 className="text-[28px] md:text-[42px] font-serif text-[#4A1015] font-light leading-tight">
                    {sectionData?.label || 'Customer Stories'}
                </h2>
            </div>

            {/* Horizontal Scroll Containers - Matching Gold UI */}
            <div className="flex overflow-x-auto gap-8 px-6 md:px-12 pb-8 scrollbar-hide snap-x snap-mandatory">
                {displayItems.map((testimonial, index) => (
                    <motion.div
                        key={testimonial.id}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="flex-shrink-0 w-[240px] md:w-[280px] snap-center flex flex-col"
                    >
                        {/* White Card */}
                        <div className="bg-white rounded-[24px] p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-sm min-h-[220px] md:min-h-[260px] relative">
                            <p className="text-[#4A1015]/80 font-serif italic text-xs md:text-[14px] leading-relaxed">
                                "{testimonial.text}"
                            </p>
                            
                            {/* Portrait Photo - Absolute positioned at the bottom center, overlapping outside */}
                            <div className="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-[#FAEAF0] shadow-md z-10 font-bold">
                                <img 
                                    src={testimonial.image} 
                                    alt={testimonial.name} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Name - Below current and portrait */}
                        <div className="mt-14 md:mt-16 text-center">
                            <p className="text-[#4A1015] font-serif font-bold text-sm md:text-lg">
                                {testimonial.name}
                            </p>
                            <span className="text-[#A57A82] text-[10px] md:text-xs uppercase tracking-widest mt-1 block">
                                {testimonial.location}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
        </section>
    );
};

export default Testimonials;
