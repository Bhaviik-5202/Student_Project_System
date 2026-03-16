import { memo, useCallback } from "react";

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
      behavior: "smooth",
    });
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white p-3 rounded-full shadow-lg hover:shadow-xl dark:hover:shadow-blue-500/30 transition-all duration-300 hover:scale-110 dark:hover:scale-110 z-40 group focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      aria-label="Back to top"
      title="Scroll to top"
    >
      <svg
        className="w-5 h-5 transform group-hover:-translate-y-0.5 transition-transform"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
});

BackToTop.displayName = "BackToTop";

export default BackToTop;
