// src/App.jsx
import { useState, useEffect, Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import SplashScreen from "./components/common/SplashScreen";
import ScrollToTop from "./components/common/ScrollToTop";
import RouteProgressBar from "./components/common/RouteProgressBar";

const SPLASH_SCREEN_DELAY = 1200; // ms

/**
 * App - Main application entry point
 * @returns {React.ReactNode} Application component
 */
function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, SPLASH_SCREEN_DELAY);
    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <ScrollToTop />
      <RouteProgressBar />
      <Suspense fallback={null}>
        <AppRoutes />
      </Suspense>
    </Router>
  );
}

export default App;
