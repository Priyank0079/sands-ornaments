import { useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { scrollToTop } from './lib/lenis';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    const navType = useNavigationType();

    useLayoutEffect(() => {
        // Only scroll to top on PUSH (new navigation) or REPLACE
        // Ignore POP (back/forward buttons) to allow browser scroll restoration
        if (navType !== 'POP') {
            const frame = requestAnimationFrame(() => {
                scrollToTop();
            });
            return () => cancelAnimationFrame(frame);
        }
    }, [pathname, navType]);

    return null;
};

export default ScrollToTop;
