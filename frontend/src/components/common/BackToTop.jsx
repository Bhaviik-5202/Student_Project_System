import { memo, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * BackToTop Component
 *
 * A sticky accessibility button that provides a smooth-scrolling
 * return to the top of the viewport. Features gradient styling
 * and active-press scale animations for touch feedback.
 *
 * On mobile, it is positioned above the BottomNav via mobile.css.
 */
const BackToTop = memo(() => {
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className='back-to-top group fixed bottom-6 right-6 z-[100] rounded-full bg-gradient-to-r from-blue-600 to-blue-700 p-3 text-white shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:from-blue-700 dark:to-blue-800 dark:hover:shadow-blue-500/30 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-900'
      aria-label='Back to top'
      title='Scroll to top'
    >
      <ArrowUp className='h-5 w-5 transform transition-transform group-hover:-translate-y-0.5' />
    </button>
  );
});

BackToTop.displayName = 'BackToTop';

export default BackToTop;
