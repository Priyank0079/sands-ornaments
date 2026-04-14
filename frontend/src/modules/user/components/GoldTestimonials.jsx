import React, { useRef } from 'react';
import { motion } from 'framer-motion';

// Import local customer portraits
import customer1 from '../../../assets/testimonial_customer_1.png';
import customer2 from '../../../assets/testimonial_customer_2.png';
import customer3 from '../../../assets/testimonial_customer_3.png';

const GOLD_TESTIMONIALS = [
    {
        id: 1,
        name: "Shashi",
        image: customer1,
        text: "This time for our 5th year anniversary I wanted to gift her something different. Glad I got to custom make a modern solitaire ring for her...simple yet different, and exactly what I had pictured."
    },
    {
        id: 2,
        name: "Renuka",
        image: customer2,
        text: "Most gold rings for men look dated. I wanted to gift him something that matches the wedding ring he got me too. Finally got to know SANDS' gold made-to-order option."
    },
    {
        id: 3,
        name: "Priya",
        image: customer3,
        text: "Wanted something special and matchy for my sister. So I got these rings custom-made with our coloured diamonds. And well, diamonds are a girl's best friend for a reason!"
    },
    {
        id: 4,
        name: "Aditya",
        image: customer1,
        text: "Becoming a parent changes everything. When my wife became a mother, I wanted to gift her diamonds that felt meaningful. Sustainability mattered to us, so this choice felt right."
    },
    {
        id: 5,
        name: "Shruti",
        image: customer2,
        text: "When I planned a trip to Ladakh, I wanted something hatke. So I got this ring for our couple trip, custom-made, and it was just right!"
    }
];

const GoldTestimonials = () => {
    const scrollRef = useRef(null);

    return (
        <section 
            className="w-full pt-8 md:pt-10 pb-0 overflow-hidden select-none"
            style={{ background: 'linear-gradient(135deg, #D6EDE9 0%, #E8F5F2 100%)' }}
        >
            <div className="container mx-auto px-4 mb-6 text-center">
                <h2 className="text-[28px] md:text-[42px] font-serif text-[#1e1e1e] font-light leading-tight">
                    Moments, Made by Heer
                </h2>
            </div>

            {/* Horizontal Scroll Containers - Custom Scrollbar Hidden */}
            <div 
                ref={scrollRef}
                className="flex overflow-x-auto gap-8 px-6 md:px-12 pb-6 scrollbar-hide snap-x snap-mandatory"
            >
                {GOLD_TESTIMONIALS.map((item, idx) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        className="flex-shrink-0 w-[240px] md:w-[280px] snap-center flex flex-col"
                    >
                        {/* White Card */}
                        <div className="bg-white rounded-[24px] p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-sm min-h-[220px] md:min-h-[260px] relative">
                            <p className="text-[#444] font-serif italic text-xs md:text-[14px] leading-relaxed">
                                "{item.text}"
                            </p>
                            
                            {/* Portrait Photo - Absolute positioned at the bottom center, overlapping outside */}
                            <div className="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-[#E8F5F2] shadow-md z-10">
                                <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Name - Below current and portrait */}
                        <div className="mt-14 md:mt-16 text-center">
                            <p className="text-[#1e1e1e] font-serif font-bold text-sm md:text-lg">
                                {item.name}
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

export default GoldTestimonials;
