import { memo, useCallback, useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * BackToTop Component
 *
 * A sticky accessibility button that provides a smooth-scrolling
 * return to the top of the viewport. Features gradient styling
 * and active-press scale animations for touch feedback.
 *
 * It dynamically offsets itself when the footer is visible to prevent overlap.
 */
const BackToTop = memo(() => {
  const [footerOverlap, setFooterOverlap] = useState(0);

  useEffect(() => {
    const checkFooter = () => {
      const footer = document.querySelector('footer');
      if (!footer) {
        setFooterOverlap(0);
        return;
      }
      
      const rect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      
      if (rect.top < windowHeight) {
        setFooterOverlap(windowHeight - rect.top);
      } else {
        setFooterOverlap(0);
      }
    };
    
    // Use animation frame for smoother scroll syncing
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkFooter();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', checkFooter, { passive: true });
    checkFooter();
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', checkFooter);
    };
  }, []);

  const scrollToTop = useCallback(() => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      // Fallback for browsers that don't support smooth scrolling objects
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, []);

  return (
    <div 
      className='fixed right-4 md:right-6 z-[100] pointer-events-none bottom-[calc(var(--mobile-nav-height,5rem)+1rem)] md:bottom-6'
      style={{ 
        transform: `translateY(-${footerOverlap}px)`,
        willChange: 'transform'
      }}
    >
      <button
        onClick={scrollToTop}
        className='pointer-events-auto group flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:from-blue-700 dark:to-blue-800 dark:hover:shadow-blue-500/30 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-900'
        aria-label='Back to top'
        title='Scroll to top'
      >
        <ArrowUp className='h-5 w-5 transform transition-transform group-hover:-translate-y-0.5' />
      </button>
    </div>
  );
});

BackToTop.displayName = 'BackToTop';

export default BackToTop;
