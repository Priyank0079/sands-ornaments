import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import proposalRingsImg from '../assets/home_banners/home_proposal_rings.png';

const DiamondStoryBanner = () => {
    const to = '/shop?category=rings&sort=latest';

    return (
        <section className="py-6 md:py-10 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="relative overflow-hidden rounded-3xl border border-[#4A1015]/20 bg-gradient-to-r from-[#2B070B] via-[#3A0A0F] to-[#2B070B] shadow-[0_24px_60px_rgba(47,10,15,0.25)]">
                    <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(800px_circle_at_70%_30%,rgba(255,255,255,0.10),transparent_60%)]" />

                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10 p-4 md:p-8 items-center">
                        <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10">
                            <img
                                src={proposalRingsImg}
                                alt="Proposal Rings"
                                className="w-full h-full object-cover aspect-[16/11] md:aspect-[16/12]"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                        </div>

                        <div className="text-[#F7F2EF] px-2 md:px-0">
                            <div className="inline-flex items-center rounded-full border border-[#C9A24D]/40 bg-black/15 px-4 py-1.5">
                                <span className="text-[10px] md:text-[11px] font-semibold tracking-[0.30em] text-[#E3C57A] uppercase">
                                    The Diamond Story
                                </span>
                            </div>

                            <h3 className="mt-4 font-display text-3xl md:text-5xl tracking-wide">
                                Proposal Rings
                            </h3>
                            <p className="mt-2 font-serif italic text-[#F7F2EF]/80 text-lg md:text-2xl">
                                Timeless Elegance
                            </p>
                            <p className="mt-4 text-sm md:text-base text-[#F7F2EF]/70 leading-relaxed max-w-xl">
                                Timeless pieces for your most memorable moments. Every love story deserves a perfect beginning.
                            </p>

                            <div className="mt-6">
                                <Link
                                    to={to}
                                    className="inline-flex items-center gap-3 bg-white text-[#2F0A0F] hover:bg-[#F7F2EF] transition-colors rounded-full px-6 py-3 font-semibold shadow-sm"
                                >
                                    Explore Collection
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Decorative arrows (single-slide UI) */}
                    <button
                        type="button"
                        aria-label="Previous"
                        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-black/30 text-white border border-white/10"
                        disabled
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        type="button"
                        aria-label="Next"
                        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-black/30 text-white border border-white/10"
                        disabled
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default DiamondStoryBanner;

