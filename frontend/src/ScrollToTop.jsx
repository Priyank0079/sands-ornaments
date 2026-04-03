import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        // More robust scroll reset using requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
            window.scrollTo(0, 0);
            if (document.documentElement) {
                document.documentElement.scrollTop = 0;
            }
            if (document.body) {
                document.body.scrollTop = 0;
            }
        });
    }, [pathname]);

    return null;
};

export default ScrollToTop;
