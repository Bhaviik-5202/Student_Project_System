import { useState, useEffect, memo } from "react";

/**
 * PageTransition Component
 *
 * Orchestrates fluid entering and exiting animations during SPA
 * navigation. Utilizes requestAnimationFrame and CSS transforms
 * to ensure smooth user experience during route changes.
 */
const PageTransition = memo(({ children, pathname, shouldAnimate }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentPath, setCurrentPath] = useState(pathname);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (pathname !== currentPath) {
      setIsAnimating(true);
      setIsVisible(false);

      const exitTimer = setTimeout(() => {
        setCurrentPath(pathname);
        requestAnimationFrame(() => {
          setIsVisible(true);
          setTimeout(() => setIsAnimating(false), 200);
        });
      }, 100);

      return () => clearTimeout(exitTimer);
    } else {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    }
  }, [pathname, currentPath]);

  if (!shouldAnimate) {
    return <div key={pathname}>{children}</div>;
  }

  return (
    <div
      key={currentPath}
      className={`page-transition ${
        isVisible ? "page-enter-active" : "page-exit-active"
      }`}
      style={{
        transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "translateY(0) scale(1)"
          : "translateY(10px) scale(0.99)",
        willChange: isAnimating ? "opacity, transform" : "auto",
      }}
    >
      {children}
    </div>
  );
});

PageTransition.displayName = "PageTransition";

export default PageTransition;
