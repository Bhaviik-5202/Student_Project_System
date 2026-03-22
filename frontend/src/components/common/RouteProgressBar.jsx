import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

// Configure NProgress
nProgress.configure({ 
  showSpinner: false, 
  speed: 400, 
  minimum: 0.1 
});

/**
 * RouteProgressBar Component
 * Handles the top-level loading progress bar during route transitions.
 */
const RouteProgressBar = () => {
  const location = useLocation();

  useEffect(() => {
    nProgress.start();
    
    // Slight delay to handle fast transitions gracefully
    const timer = setTimeout(() => {
      nProgress.done();
    }, 100);

    return () => {
      clearTimeout(timer);
      nProgress.done();
    };
  }, [location.pathname]);

  return null;
};

export default RouteProgressBar;
