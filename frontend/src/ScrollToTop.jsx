import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTop } from './lib/lenis';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        const frame = requestAnimationFrame(() => {
            scrollToTop();
        });

        return () => cancelAnimationFrame(frame);
    }, [pathname]);

    return null;
};

export default ScrollToTop;
