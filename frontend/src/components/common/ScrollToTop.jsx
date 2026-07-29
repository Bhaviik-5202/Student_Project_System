import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 *
 * Automatically resets the scroll position to the top of the viewport
 * whenever the current location change. This ensures that navigating
 * to a new page doesn't inherit the scroll position from the previous one.
 */
const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const main = document.querySelector('main');
    if (main) main.scrollTop = 0;
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
