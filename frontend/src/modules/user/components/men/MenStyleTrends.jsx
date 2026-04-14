import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { buildMenShopPath } from '../../utils/menNavigation';

const trends = [
    {
        id: 1,
        number: '1',
        line1: 'Rings',
        line2: 'Stacking',
        image: '/men_style_1.png',
        link: buildMenShopPath({ category: 'rings' }),
    },
    {
        id: 2,
        number: '2',
        line1: 'Curated',
        line2: 'Combos',
        image: '/men_style_2.png',
        link: buildMenShopPath({ category: 'sets' }),
    },
    {
        id: 3,
        number: '3',
        line1: 'Chain',
        line2: 'Layering',
        image: '/men_style_3.png',
        link: buildMenShopPath({ category: 'chains' }),
    },
    {
        id: 4,
        number: '4',
        line1: 'Spiritual',
        line2: 'Picks',
        image: '/men_style_4.png',
        link: buildMenShopPath({ search: 'spiritual' }),
    },
];

const MenStyleTrends = () => {
    return (
        <section
            className="relative py-4 md:py-10"
            style={{ background: '#C9BAA8' }}
        >
            {/* Decorative corner lines — top left */}
            <div className="absolute top-5 left-5 opacity-35" style={{ width: 56, height: 50 }}>
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            top: i * 9,
                            left: 0,
                            width: 56 - i * 10,
                            height: 2,
                            background: '#6B5B4E',
                            borderRadius: 2,
                        }}
                    />
                ))}
            </div>
            {/* Decorative corner lines — bottom right */}
            <div className="absolute bottom-5 right-5 opacity-35" style={{ width: 56, height: 50 }}>
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            bottom: i * 9,
                            right: 0,
                            width: 56 - i * 10,
                            height: 2,
                            background: '#6B5B4E',
                            borderRadius: 2,
                        }}
                    />
                ))}
            </div>

            <div className="container mx-auto px-4 md:px-10 max-w-[1300px]">
                {/* Cards Row */}
                <div className="flex gap-2 md:gap-6 justify-start md:justify-center items-stretch overflow-x-auto scrollbar-hide pb-6 md:pb-8 px-4 md:px-0">
                    {trends.map((trend, idx) => (
                        <motion.div
                            key={trend.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="flex-shrink-0 group"
                            style={{ width: 'clamp(110px, 28vw, 240px)' }}
                        >
                            <Link to={trend.link} className="block relative">

                                {/* ── PHOTO CARD ── */}
                                <div
                                    className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-xl w-full"
                                    style={{
                                        height: 'clamp(140px, 38vw, 380px)',
                                        background: '#8B7D6B',
                                    }}
                                >
                                    <img
                                        src={trend.image}
                                        alt={`${trend.line1} ${trend.line2}`}
                                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                    />

                                    {/* Subtle dark gradient at bottom for text readability */}
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background:
                                                'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.12) 45%, transparent 100%)',
                                        }}
                                    />

                                    {/* ── TEXT LABEL — bottom-right inside card, away from number ── */}
                                    <div
                                        className="absolute bottom-4 right-4 text-right z-10"
                                    >
                                        <p
                                            style={{
                                                fontFamily: "'Georgia', 'Times New Roman', serif",
                                                fontSize: 'clamp(9px, 1.5vw, 17px)',
                                                fontWeight: 600,
                                                color: '#fff',
                                                lineHeight: 1.3,
                                                letterSpacing: '0.01em',
                                                textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                                            }}
                                        >
                                            {trend.line1}
                                            <br />
                                            {trend.line2}
                                        </p>
                                    </div>
                                </div>

                                {/* ── BIG NUMBER — bottom-left of card, overlapping bottom edge, inside section ── */}
                                <div
                                    className="absolute left-0 select-none pointer-events-none"
                                    style={{
                                        bottom: '-0.38em',
                                        fontSize: 'clamp(36px, 15vw, 140px)',
                                        fontWeight: 900,
                                        lineHeight: 1,
                                        color: 'rgba(255,255,255,0.85)',
                                        fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
                                        letterSpacing: '-0.05em',
                                        zIndex: 20,
                                    }}
                                >
                                    {trend.number}
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MenStyleTrends;
