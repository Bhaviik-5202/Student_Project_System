import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * PageTransition Component
 * Orchestrates fluid entering and exiting animations during SPA navigation.
 * Now powered by framer-motion for superior performance and smoothness.
 */
const PageTransition = memo(({ children, pathname, shouldAnimate = true }) => {
  if (!shouldAnimate) {
    return <div key={pathname}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ 
          duration: 0.2, 
          ease: "easeOut" 
        }}
        className="w-full flex-1 flex flex-col"
        style={{ willChange: "opacity, transform" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
});

PageTransition.displayName = "PageTransition";

export default PageTransition;
