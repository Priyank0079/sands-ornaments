import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Import local images
import TempleDateImg from '../../../../assets/occasions/TempleDate.png';
import GirlOutingImg from '../../../../assets/occasions/GirlOuting.png';
import DateNightImg from '../../../../assets/occasions/DateNight.png';
import PartyGlamImg from '../../../../assets/occasions/PartyGlam.png';
import GotHitchedImg from '../../../../assets/occasions/GotHitched.png';

const occasions = [
    {
        id: 1,
        title: "Temple Date",
        image: TempleDateImg,
        path: "/shop?occasion=temple-date",
        height: "h-[350px] md:h-[450px]"
    },
    {
        id: 2,
        title: "Girl Outing",
        image: GirlOutingImg,
        path: "/shop?occasion=girl-outing",
        height: "h-[400px] md:h-[500px]"
    },
    {
        id: 3,
        title: "Date Night",
        image: DateNightImg,
        path: "/shop?occasion=date-night",
        height: "h-[450px] md:h-[550px]",
        featured: true
    },
    {
        id: 4,
        title: "Party Glam",
        image: PartyGlamImg,
        path: "/shop?occasion=party-glam",
        height: "h-[400px] md:h-[500px]"
    },
    {
        id: 5,
        title: "Got Hitched",
        image: GotHitchedImg,
        path: "/shop?occasion=wedding",
        height: "h-[350px] md:h-[450px]"
    }
];

const WomenOccasionCarousel = () => {
    const navigate = useNavigate();
    const targetRef = useRef(null);

    return (
        <section className="py-24 bg-[#FBF0F2] overflow-hidden select-none">
            <div className="container mx-auto px-6 mb-12">
                <div className="flex flex-col items-center text-center">
                    <motion.h3 
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-3xl md:text-5xl font-serif text-[#333] mb-8"
                    >
                        Shop by Occasion
                    </motion.h3>
                </div>
            </div>

            <div 
                ref={targetRef}
                className="flex items-center gap-4 md:gap-8 overflow-x-auto pb-12 px-6 md:px-24 snap-x snap-mandatory scroll-smooth no-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {occasions.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        onClick={() => navigate(item.path)}
                        className={`snap-center shrink-0 cursor-pointer group transition-all duration-700 w-[240px] md:w-[320px] ${item.height}`}
                    >
                        {/* Card Container */}
                        <div className={`relative w-full h-full rounded-[30px] md:rounded-[40px] overflow-hidden border-2 border-white shadow-xl transition-all duration-700 group-hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] group-hover:scale-[1.02]`}>
                            {/* Full Height Image */}
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                            />
                            
                            {/* Title Label in White Box */}
                            <div className="absolute inset-x-0 bottom-6 md:bottom-10 flex justify-center px-4">
                                <span className="bg-white px-8 md:px-12 py-3 md:py-4 rounded-[20px] md:rounded-[25px] text-zinc-800 font-bold text-base md:text-xl shadow-lg transition-all duration-500 group-hover:bg-zinc-900 group-hover:text-white">
                                    {item.title}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Visual Instruction Line */}
            <div className="flex justify-center mt-6">
                <div className="w-32 h-[2px] bg-zinc-300 rounded-full relative overflow-hidden">
                    <motion.div 
                        className="absolute inset-y-0 bg-[#D39A9F] w-1/2"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>
            </div>
        </section>
    );
};

export default WomenOccasionCarousel;
