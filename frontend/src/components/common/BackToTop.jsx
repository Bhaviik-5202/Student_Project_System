import { memo, useCallback } from 'react';

/**
 * BackToTop Component
 *
 * A sticky accessibility button that provides a smooth-scrolling
 * return to the top of the viewport. Features gradient styling
 * and hover-driven scale animations for subtle user engagement.
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
      className='group fixed bottom-6 right-6 z-40 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 p-3 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:from-blue-700 dark:to-blue-800 dark:hover:scale-110 dark:hover:shadow-blue-500/30 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-900'
      aria-label='Back to top'
      title='Scroll to top'
    >
      <svg
        className='h-5 w-5 transform transition-transform group-hover:-translate-y-0.5'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
        xmlns='http://www.w3.org/2000/svg'
        aria-hidden='true'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M5 10l7-7m0 0l7 7m-7-7v18'
        />
      </svg>
    </button>
  );
});

BackToTop.displayName = 'BackToTop';

export default BackToTop;
