import React from 'react';
import { motion } from 'framer-motion';
import { useHomepageCms } from '../hooks/useHomepageCms';
import { resolveLegacyCmsAsset } from '../utils/legacyCmsAssets';

// Import local high-end customer portraits
import customer1 from '@assets/testimonial_customer_1.png';
import customer2 from '@assets/testimonial_customer_2.png';
import customer3 from '@assets/testimonial_customer_3.png';

const TESTIMONIALS = [
    {
        id: 1,
        name: "Ananya Sharma",
        image: customer1,
        text: "A big shout out to you guys for improving my hubby's gifting tastes. Completely in love with my ring!",
        location: "Mumbai"
    },
    {
        id: 2,
        name: "Rahul Verma",
        image: customer2,
        text: "Never thought buying jewellery would be this easy, thanks for helping make my mom's birthday special.",
        location: "Delhi"
    },
    {
        id: 3,
        name: "Priya Patel",
        image: customer3,
        text: "Gifted these earrings to my sister on her wedding and she loved them! I am obsessed with buying gifts from Sands Ornaments.",
        location: "Bangalore"
    }
];

const Testimonials = () => {
    const { data: homepageSections = {} } = useHomepageCms();
    const sectionData = homepageSections?.testimonials;
    const configuredItems = Array.isArray(sectionData?.items) ? sectionData.items : [];
    const displayItems = configuredItems.length > 0
        ? configuredItems.map((item, index) => ({
            id: item.itemId || item._id || item.id || `testimonial-${index + 1}`,
            name: item.name || TESTIMONIALS[index]?.name || 'Customer Story',
            image: resolveLegacyCmsAsset(item.image, TESTIMONIALS[index]?.image || customer1),
            text: item.description || TESTIMONIALS[index]?.text || '',
            location: item.location || TESTIMONIALS[index]?.location || ''
        }))
        : TESTIMONIALS;

    return (
        <section className="w-full py-16 md:py-24 bg-[#F4F7F5] overflow-hidden select-none relative">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#142E1F]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            {/* Heading Section */}
            <div className="container mx-auto px-4 mb-12 md:mb-20 text-center relative z-10">
                <span className="text-[11px] uppercase tracking-[0.4em] text-[#B8860B] font-bold mb-4 block">
                    Our Patrons
                </span>
                <h2 className="text-3xl md:text-5xl font-display text-[#142E1F] tracking-tight">
                    {sectionData?.label || 'Movements Made by Her'}
                </h2>
                <div className="h-[1px] w-24 bg-[#B8860B]/30 mx-auto mt-6" />
            </div>

            {/* Horizontal Scroll Containers */}
            <div className="flex overflow-x-auto gap-6 md:gap-10 px-6 md:px-12 pb-20 scrollbar-hide snap-x snap-mandatory justify-start md:justify-center relative z-10">
                {displayItems.map((testimonial, index) => (
                    <motion.div
                        key={testimonial.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className="flex-shrink-0 w-[300px] md:w-[380px] snap-center"
                    >
                        <div className="bg-white rounded-[32px] p-8 md:p-12 flex flex-col items-center text-center shadow-[0_15px_45px_rgba(20,46,31,0.05)] min-h-[320px] md:min-h-[360px] relative border border-[#142E1F]/5 group hover:border-[#B8860B]/20 transition-all duration-500">
                            {/* Stars Rating */}
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-[#B8860B] text-sm">★</span>
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <div className="relative">
                                <span className="absolute -top-4 -left-2 text-4xl text-[#142E1F]/10 font-serif">"</span>
                                <p className="text-[#4A4A4A] font-serif italic text-base md:text-lg leading-relaxed mb-8 px-2">
                                    {testimonial.text}
                                </p>
                                <span className="absolute -bottom-8 -right-2 text-4xl text-[#142E1F]/10 font-serif rotate-180">"</span>
                            </div>

                            {/* Portrait Photo - Absolute positioned at the bottom center */}
                            <div className="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white shadow-xl z-20 transition-transform duration-500 group-hover:scale-105">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Name at the Bottom */}
                        <div className="mt-14 text-center">
                            <h3 className="text-[#142E1F] font-display font-bold text-lg md:text-xl tracking-widest uppercase">
                                {testimonial.name.split(' ')[0]}
                            </h3>
                            <p className="text-[#B8860B] text-[10px] uppercase tracking-[0.3em] font-bold mt-1">
                                {testimonial.location || 'Verified Buyer'}
                            </p>
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


