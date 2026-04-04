import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

// Import local high-end customer portraits
import customer1 from '../../../assets/testimonial_customer_1.png';
import customer2 from '../../../assets/testimonial_customer_2.png';
import customer3 from '../../../assets/testimonial_customer_3.png';

const testimonials = [
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
    return (
        <section className="py-20 md:py-32 bg-[#F3E8EE] relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#D39A9F]/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4A1015]/5 rounded-full blur-[100px] -ml-48 -mb-48"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-16 md:mb-24">
                    <span className="text-[#4A1015] text-[10px] md:text-sm font-bold tracking-[0.4em] uppercase mb-3 block">Kind Words</span>
                    <h2 className="font-display text-3xl md:text-5xl text-[#4A1015] mb-4">Customer Stories</h2>
                    <div className="h-1 w-20 bg-[#D39A9F] mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-8 max-w-7xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="relative"
                        >
                            {/* The Card Structure Inspired by Reference */}
                            <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(74,16,21,0.08)] overflow-visible pt-16 pb-8 px-8 mt-12 relative min-h-[300px] flex flex-col items-center text-center">

                                {/* Top Header Block - Deep Wine */}
                                <div className="absolute top-0 left-0 right-0 h-24 bg-[#4A1015] rounded-t-3xl rounded-br-[100px] z-0 flex flex-col justify-end p-6 pl-8">
                                    <h4 className="text-white font-bold text-sm md:text-base uppercase tracking-widest leading-none mb-1">
                                        {testimonial.name}
                                    </h4>
                                    <span className="text-white/60 text-[10px] md:text-xs uppercase tracking-wider">
                                        {testimonial.role}
                                    </span>
                                </div>

                                {/* Star Rating over the Wine Block - Moved to left to avoid overlap */}
                                <div className="absolute bottom-[calc(100%-88px)] left-8 z-10 flex gap-0.5">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-3 md:w-4 h-3 md:h-4 fill-[#C9A24D] text-[#C9A24D]" />
                                    ))}
                                </div>

                                {/* Profile Image - Floating Top Right */}
                                <div className="absolute -top-12 -right-2 md:-right-6 w-24 h-24 md:w-32 md:h-32 rounded-full border-[6px] border-[#F3E8EE] shadow-xl overflow-hidden z-20">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Body Content */}
                                <div className="mt-8 relative z-10">
                                    <Quote className="w-10 h-10 text-[#D39A9F]/20 absolute -top-4 -left-6 z-0" />
                                    <p className="text-gray-600 font-serif italic text-sm md:text-base leading-relaxed mb-6 relative z-10">
                                        "{testimonial.text}"
                                    </p>

                                    <div className="flex flex-col items-center">
                                        <div className="h-[1px] w-12 bg-[#D39A9F]/30 mb-3" />
                                        <span className="text-[#D39A9F] text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">
                                            {testimonial.location}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
