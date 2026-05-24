import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { scrollToTop, getLenis } from './lib/lenis';

/**
 * Bulletproof Scroll Restoration for Sands Ornaments
 * Uses useRef to remember viewport positions across navigations.
 * Optimized for Lenis Smooth Scroll.
 */
const ScrollToTop = () => {
    const location = useLocation();
    const navType = useNavigationType();
    
    // Persistent ref to store positions: { [pathname+search]: scrollY }
    const scrollPositions = useRef({});
    
    // We also use a ref for currentKey to avoid race conditions in scroll listeners
    const keyRef = useRef(location.pathname + location.search);

    useEffect(() => {
        keyRef.current = location.pathname + location.search;
    }, [location.pathname, location.search]);

    // 1. Set scroll restoration to manual globally
    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
    }, []);

    // 2. Continuously save scroll position
    useEffect(() => {
        const handleSavePosition = () => {
            const lenis = getLenis();
            const scrollY = lenis ? lenis.scroll : window.scrollY;
            
            // Only save if it's a meaningful scroll position
            if (scrollY >= 0) {
                scrollPositions.current[keyRef.current] = scrollY;
            }
        };

        const lenis = getLenis();
        if (lenis) {
            lenis.on('scroll', handleSavePosition);
            return () => lenis.off('scroll', handleSavePosition);
        } else {
            window.addEventListener('scroll', handleSavePosition, { passive: true });
            return () => window.removeEventListener('scroll', handleSavePosition);
        }
    }, []);

    // 3. Persist to sessionStorage as backup for hard refreshes
    useLayoutEffect(() => {
        const currentKey = location.pathname + location.search;
        return () => {
            const pos = scrollPositions.current[currentKey];
            if (pos > 0) {
                try {
                    sessionStorage.setItem(`scroll_${currentKey}`, String(pos));
                } catch (e) { /* ignore */ }
            }
        };
    }, [location.pathname, location.search]);

    // 4. Handle Restoration on POP (Back/Forward)
    useEffect(() => {
        const currentKey = location.pathname + location.search;

        if (navType === 'POP') {
            const savedScroll = scrollPositions.current[currentKey] || 
                               Number(sessionStorage.getItem(`scroll_${currentKey}`)) || 0;
            
            if (savedScroll > 0) {
                let attempts = 0;
                const performRestore = () => {
                    const lenis = getLenis();
                    const currentHeight = document.documentElement.scrollHeight;
                    
                    // Restoration logic: Wait for page height to be sufficient
                    // Jewellery pages often have dynamic images, so we retry several times
                    if (currentHeight >= savedScroll || attempts > 20) {
                        if (lenis) {
                            // Use immediate: true for instant jump on back navigation
                            lenis.scrollTo(savedScroll, { immediate: true });
                        } else {
                            window.scrollTo(0, savedScroll);
                        }
                        return true;
                    }
                    return false;
                };

                // Rapid-fire attempts for the first 500ms
                const interval = setInterval(() => {
                    attempts++;
                    if (performRestore() || attempts > 60) {
                        clearInterval(interval);
                    }
                }, 50);

                return () => clearInterval(interval);
            }
        } else if (navType === 'PUSH') {
            // New navigation: Always scroll to top
            const frame = requestAnimationFrame(() => {
                scrollToTop();
            });
            return () => cancelAnimationFrame(frame);
        }
    }, [location.pathname, location.search, navType]);

    return null;
};

export default ScrollToTop;
