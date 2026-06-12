
import React, { useRef, useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import CategoryNav from '../components/CategoryNav';
import OfferStrip from '../components/OfferStrip';
import Footer from '../components/Footer';
import WhatsAppFloating from '../components/WhatsAppFloating';

const UserLayout = () => {
    const headerRef = useRef(null);
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        const updateHeight = () => {
            if (headerRef.current) {
                setHeaderHeight(headerRef.current.offsetHeight);
            }
        };

        updateHeight();

        const observer = new ResizeObserver(updateHeight);
        if (headerRef.current) {
            observer.observe(headerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div className="flex flex-col min-h-screen font-sans bg-background">
            {/* Fixed header — always pinned to top */}
            <header
                ref={headerRef}
                data-lenis-prevent
                className="fixed top-0 left-0 right-0 z-[150] flex flex-col shrink-0 bg-white shadow-md"
                style={{ transform: 'translateZ(0)', willChange: 'transform' }}
            >
                <TopBar />
                <Navbar />
                <CategoryNav />
                <OfferStrip />
            </header>

            {/* Spacer so page content isn't hidden behind the fixed header */}
            <div style={{ height: headerHeight }} aria-hidden="true" />

            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
            <WhatsAppFloating />
        </div>
    );
};

export default UserLayout;
