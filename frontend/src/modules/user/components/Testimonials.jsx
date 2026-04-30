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
        <section className="w-full pt-4 pb-12 md:pt-6 md:pb-20 bg-white overflow-hidden select-none">
            {/* Heading Section */}
            <div className="container mx-auto px-4 mb-10 md:mb-16 text-center">
                <h2 className="text-2xl md:text-3xl font-sans text-gray-900 font-medium tracking-tight">
                    {sectionData?.label || 'Customer Stories'}
                </h2>
            </div>

            {/* Horizontal Scroll Containers */}
            <div className="flex overflow-x-auto gap-4 md:gap-8 px-6 md:px-12 pb-16 scrollbar-hide snap-x snap-mandatory justify-start md:justify-center">
                {displayItems.map((testimonial, index) => (
                    <motion.div
                        key={testimonial.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="flex-shrink-0 w-[280px] md:w-[320px] snap-center"
                    >
                        {/* Peach Card (Reference to Img 1) */}
                        <div className="bg-[#FFE8BC] rounded-[20px] p-8 md:p-10 flex flex-col items-center text-center shadow-sm min-h-[240px] md:min-h-[280px] relative">
                            {/* Name at the Top */}
                            <h3 className="text-gray-900 font-sans font-semibold text-lg md:text-xl mb-4 md:mb-6">
                                {testimonial.name.split(' ')[0]}
                            </h3>

                            {/* Testimonial Text */}
                            <p className="text-gray-800 font-sans text-sm md:text-base leading-relaxed line-clamp-4">
                                {testimonial.text}
                            </p>

                            {/* Portrait Photo - Absolute positioned at the bottom center, overlapping outside */}
                            <div className="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white shadow-lg z-10">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
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


