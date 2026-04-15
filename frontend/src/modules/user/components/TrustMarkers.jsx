import React from 'react';
import { motion } from 'framer-motion';

const TrustMarkers = () => {
    const markers = [
        { id: 1, bold: "925", normal: "Fine Silver" },
        { id: 2, bold: "6 - Month", normal: "Warranty" },
        { id: 3, bold: "BIS", normal: "Hallmark" },
        { id: 4, bold: "Lifetime", normal: "Plating" },
        { id: 5, bold: "Easy 15 Days", normal: "Return" }
    ];

    return (
        <section className="w-full bg-gradient-to-r from-[#FFDDE2]/60 via-white to-[#FFDDE2]/60 py-3 md:py-6 border-y border-pink-50/50">
            <div className="container mx-auto px-4 max-w-[1400px]">
                <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:items-center md:justify-center md:gap-8">
                    {markers.map((marker, index) => (
                        <motion.div
                            key={marker.id}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className={`bg-white px-3 md:px-10 py-2 md:py-3.5 rounded-md md:rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-pink-50/30 flex items-center justify-center text-center whitespace-normal md:whitespace-nowrap group cursor-default ${index === markers.length - 1 ? 'col-span-2' : ''}`}
                        >
                            <span className="text-[#1A1A1A] text-[12px] md:text-base tracking-tight">
                                <span className="font-extrabold">{marker.bold}</span>{" "}
                                <span className="font-semibold text-gray-700">{marker.normal}</span>
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustMarkers;
