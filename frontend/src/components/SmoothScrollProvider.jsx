import { useEffect } from 'react';
import { destroyLenis, initLenis } from '../lib/lenis';

const SmoothScrollProvider = () => {
    useEffect(() => {
        // Disable on mobile — native scroll is faster and Lenis adds CPU overhead
        const isMobile = window.innerWidth < 768;
        if (isMobile) return undefined;

        if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
            return undefined;
        }

        const lenis = initLenis();

        if (!lenis) return undefined;

        document.documentElement.classList.add('lenis');
        document.documentElement.classList.add('lenis-smooth');

        return () => {
            destroyLenis();
            document.documentElement.classList.remove('lenis');
            document.documentElement.classList.remove('lenis-smooth');
        };
    }, []);

    return null;
};

export default SmoothScrollProvider;
