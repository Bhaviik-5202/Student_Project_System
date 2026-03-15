/**
 * SplashScreen Component
 * 
 * A high-fidelity, animated loading screen shown during application 
 * initialization. Features complex SVG animations, themed glassmorphism, 
 * and multi-stage initialization progress tracking.
 */
const SplashScreen = () => (
  <div
    className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center overflow-hidden relative"
    role="status"
    aria-label="Loading application"
  >
    {/* Animated background elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "0.5s" }}
      />
    </div>

    {/* Main content */}
    <div className="text-center z-10 animate-[fadeIn_0.6s_ease-out]">
      {/* Logo container with glassmorphism */}
      <div className="relative mb-8">
        {/* Outer rotating ring */}
        <div
          className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-2 border-transparent border-t-blue-400 border-r-indigo-400 animate-spin"
          style={{ animationDuration: "3s" }}
        />

        {/* Inner rotating ring (opposite direction) */}
        <div
          className="absolute inset-2 w-28 h-28 mx-auto rounded-full border-2 border-transparent border-b-purple-400 border-l-pink-400 animate-spin"
          style={{ animationDuration: "2s", animationDirection: "reverse" }}
        />

        {/* Logo background with glass effect */}
        <div className="w-32 h-32 mx-auto rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center justify-center relative">
          {/* Pulsing glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-50 to-indigo-600 opacity-50 animate-pulse blur-md" />

          {/* Icon container */}
          <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <svg
              className="w-10 h-10 text-white drop-shadow-lg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Title with gradient text */}
      <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
        Student Project System
      </h1>

      {/* Subtitle */}
      <p className="text-blue-200/80 text-sm md:text-base mb-8 font-medium tracking-wide">
        Empowering Academic Excellence
      </p>

      {/* Professional Loading Section */}
      <div className="w-80 mx-auto">
        {/* Loading spinner with orbiting dots */}
        <div className="flex justify-center mb-6">
          <div className="relative w-12 h-12">
            {/* Orbiting dots */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="absolute w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${i * 60}deg) translateY(-20px)`,
                  animation: `orbitFade 1.2s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                  opacity: 0.3,
                }}
              />
            ))}
            {/* Center pulse */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-white/80 animate-ping" />
              <div className="absolute w-2 h-2 rounded-full bg-white" />
            </div>
          </div>
        </div>

        {/* Progress bar container */}
        <div className="relative mb-4">
          {/* Background track */}
          <div className="h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            {/* Animated progress fill */}
            <div
              className="h-full rounded-full animate-[loadingProgress_1.2s_ease-in-out_infinite]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #60a5fa, #818cf8, #a78bfa, transparent)",
                backgroundSize: "200% 100%",
              }}
            />
          </div>

          {/* Glowing dot on progress */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg shadow-blue-500/50 animate-[progressDot_1.2s_ease-in-out_infinite]"
            style={{ left: "0%" }}
          />
        </div>

        {/* Loading status */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-[bounce_0.6s_ease-in-out_infinite]"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <p className="text-blue-200/70 text-sm font-medium animate-pulse">
            Loading Workspace
          </p>
        </div>

        {/* Loading steps indicator */}
        <div className="mt-6 flex justify-center gap-2">
          {["Initialize", "Auth", "Data", "UI"].map((step, i) => (
            <div
              key={step}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium animate-[stepPulse_2s_ease-in-out_infinite]"
              style={{
                animationDelay: `${i * 0.5}s`,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full animate-[dotGlow_2s_ease-in-out_infinite]"
                style={{
                  animationDelay: `${i * 0.5}s`,
                  backgroundColor: "#60a5fa",
                }}
              />
              <span className="text-blue-200/60">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default SplashScreen;
