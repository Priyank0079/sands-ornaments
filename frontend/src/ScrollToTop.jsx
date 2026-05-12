import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { scrollToTop, getLenis } from './lib/lenis';

const ScrollToTop = () => {
    const location = useLocation();
    const navType = useNavigationType();
    const currentKey = location.pathname + location.search;
    
    // Ref to store positions across navigations
    const scrollPositions = useRef({});

    // 1. Set scroll restoration to manual globally
    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
    }, []);

    // 2. Continuously save scroll position on every scroll
    // This is more reliable than saving only on unmount
    useEffect(() => {
        const handleScroll = () => {
            const lenis = getLenis();
            const scrollY = lenis ? lenis.scroll : window.scrollY;
            if (scrollY > 0) {
                scrollPositions.current[currentKey] = scrollY;
                // We only persist to sessionStorage occasionally or on navigation to avoid overhead
            }
        };

        const lenis = getLenis();
        if (lenis) {
            lenis.on('scroll', handleScroll);
            return () => lenis.off('scroll', handleScroll);
        } else {
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [currentKey]);

    // 3. Save to sessionStorage on unmount/key change
    useLayoutEffect(() => {
        return () => {
            const lenis = getLenis();
            const scrollY = lenis ? lenis.scroll : window.scrollY;
            if (scrollY > 0) {
                try {
                    sessionStorage.setItem(`scroll_${currentKey}`, String(scrollY));
                } catch (e) { /* ignore */ }
            }
        };
    }, [currentKey]);

    // 4. Handle Restoration
    useEffect(() => {
        if (navType === 'POP') {
            const savedScroll = scrollPositions.current[currentKey] || 
                               Number(sessionStorage.getItem(`scroll_${currentKey}`)) || 0;
            
            if (savedScroll > 0) {
                let attempts = 0;
                const performRestore = () => {
                    const lenis = getLenis();
                    const currentHeight = document.documentElement.scrollHeight;
                    
                    // Allow a 10% margin of error in height or wait for exact height
                    if (currentHeight >= savedScroll || attempts > 50) {
                        if (lenis) {
                            lenis.scrollTo(savedScroll, { immediate: true });
                        } else {
                            window.scrollTo(0, savedScroll);
                        }
                        return true;
                    }
                    return false;
                };

                const interval = setInterval(() => {
                    attempts++;
                    if (performRestore() || attempts > 100) {
                        clearInterval(interval);
                    }
                }, 50);

                return () => clearInterval(interval);
            }
        } else if (navType === 'PUSH') {
            // ONLY scroll to top on explicit PUSH (clicking a new link)
            // Ignore REPLACE as it's often used for state syncing on mount
            const frame = requestAnimationFrame(() => {
                scrollToTop();
            });
            return () => cancelAnimationFrame(frame);
        }
    }, [currentKey, navType]);

    return null;
};

export default ScrollToTop;
