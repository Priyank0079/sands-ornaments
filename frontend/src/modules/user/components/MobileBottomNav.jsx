import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutGrid, User, BookOpen } from 'lucide-react';

const MobileBottomNav = () => {
    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Category', path: '/shop', icon: LayoutGrid },
        { name: 'Blogs', path: '/blogs', icon: BookOpen },
        { name: 'Profile', path: '/profile', icon: User },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-[200] pb-safe">
            <div className="flex items-center justify-around h-16 px-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                                isActive ? 'text-[#8E2B45]' : 'text-gray-500 hover:text-gray-900'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={`w-5 h-5 ${isActive ? 'fill-current' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                                <span className={`text-[10px] tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}>
                                    {item.name}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default MobileBottomNav;
