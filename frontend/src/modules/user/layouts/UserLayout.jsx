
import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import CategoryNav from '../components/CategoryNav';
import OfferStrip from '../components/OfferStrip';
import Footer from '../components/Footer';
import WhatsAppFloating from '../components/WhatsAppFloating';
import MobileBottomNav from '../components/MobileBottomNav';

const UserLayout = () => {
    return (
        <div className="flex flex-col min-h-screen font-sans bg-background">
            <header className="sticky top-0 z-[150] flex flex-col shrink-0 bg-white shadow-md">
                <TopBar />
                <Navbar />
                <CategoryNav />
                <OfferStrip />
            </header>
            <main className="flex-grow pb-16 md:pb-0">
                <Outlet />
            </main>
            <Footer />
            <WhatsAppFloating />
            <MobileBottomNav />
        </div>
    );
};

export default UserLayout;
