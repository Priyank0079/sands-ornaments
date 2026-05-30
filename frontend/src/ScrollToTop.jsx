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
    
    // Synchronously update current key to avoid race conditions during transitions
    const currentKey = location.pathname + location.search;
    const keyRef = useRef(currentKey);
    keyRef.current = currentKey;

    // 1. Set scroll restoration to manual globally
    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
    }, []);

    // 2. Continuously save scroll position on window scroll events
    // This bound window listener captures all scroll updates from both Lenis and native scrolling.
    useEffect(() => {
        const handleSavePosition = () => {
            const lenis = getLenis();
            const scrollY = lenis ? lenis.scroll : window.scrollY;
            
            // Only save if it's a meaningful scroll position
            if (scrollY >= 0) {
                scrollPositions.current[keyRef.current] = scrollY;
            }
        };

        window.addEventListener('scroll', handleSavePosition, { passive: true });
        return () => window.removeEventListener('scroll', handleSavePosition);
    }, []);

    // 3. Persist to sessionStorage as backup for hard refreshes
    useLayoutEffect(() => {
        const key = location.pathname + location.search;
        return () => {
            const pos = scrollPositions.current[key];
            if (pos > 0) {
                try {
                    sessionStorage.setItem(`scroll_${key}`, String(pos));
                } catch (e) { /* ignore */ }
            }
        };
    }, [location.pathname, location.search]);

    // 4. Handle Restoration on POP (Back/Forward)
    useEffect(() => {
        const key = location.pathname + location.search;

        if (navType === 'POP') {
            const savedScroll = scrollPositions.current[key] || 
                               Number(sessionStorage.getItem(`scroll_${key}`)) || 0;
            
            if (savedScroll > 0) {
                let attempts = 0;
                const performRestore = () => {
                    const lenis = getLenis();
                    const currentHeight = document.documentElement.scrollHeight;
                    
                    // Restoration logic: Wait for page height to be sufficient
                    if (currentHeight >= savedScroll || attempts > 20) {
                        if (lenis) {
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
