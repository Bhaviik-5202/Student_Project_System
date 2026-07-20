import { memo } from 'react';
import { GraduationCap } from 'lucide-react';

/**
 * SplashScreen Component
 * Premium setup loading screen utilizing high-performance CSS animations.
 * Eliminates React state renders to guarantee fluid 60fps transitions.
 */
const SplashScreen = memo(() => {
  return (
    <div
      className='relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030712]'
      role='status'
      aria-label='Loading application'
    >
      <style>{`
        @keyframes rotateRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes rotateRingReverse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        @keyframes floatLogo {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.15); opacity: 0.32; }
        }
        @keyframes loadProgress {
          0% { width: 0%; }
          50% { width: 72%; }
          100% { width: 100%; }
        }
        @keyframes blinkIndicator {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        .animate-ring-slow {
          animation: rotateRing 12s linear infinite;
        }
        .animate-ring-fast {
          animation: rotateRingReverse 8s linear infinite;
        }
        .animate-float {
          animation: floatLogo 4s ease-in-out infinite;
        }
        .animate-glow {
          animation: pulseGlow 5s ease-in-out infinite;
        }
        .animate-progress {
          animation: loadProgress 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .animate-blink {
          animation: blinkIndicator 1.5s ease-in-out infinite;
        }
      `}</style>

      {/* Ambient Radial Background Glows */}
      <div className='pointer-events-none absolute inset-0'>
        <div className='animate-glow absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[120px]' />
        <div
          className='animate-glow absolute left-1/3 top-1/3 h-[300px] w-[300px] rounded-full bg-blue-500/5 blur-[100px]'
          style={{ animationDelay: '-2s' }}
        />
      </div>

      <div className='z-10 w-full max-w-sm px-6 text-center'>
        {/* Animated Circular Portal & Logo */}
        <div className='relative mx-auto mb-10 flex h-36 w-36 animate-float items-center justify-center'>
          {/* Outer Dashed Glowing Ring */}
          <div className='animate-ring-slow absolute inset-0 rounded-full border border-dashed border-indigo-500/25' />

          {/* Inner Segmented Ring */}
          <div className='animate-ring-fast absolute inset-3 rounded-full border-2 border-indigo-400/20 border-b-indigo-500/60 border-t-indigo-500/60' />

          {/* Center Glowing Logo Box */}
          <div className='relative flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl'>
            <div className='to-indigo-650 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 shadow-lg shadow-blue-500/20'>
              <GraduationCap className='h-8 w-8 text-white' />
            </div>
          </div>
        </div>

        {/* Text Headers */}
        <h1 className='font-display text-2xl font-extrabold tracking-tight text-white'>
          Student Project System
        </h1>
        <p className='mt-2 flex items-center justify-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-500'>
          <span className='animate-blink h-1.5 w-1.5 rounded-full bg-indigo-500' />
          Setting up workspace
        </p>

        {/* Hardware-Accelerated Progress Indicator */}
        <div className='mx-auto mt-10 w-44'>
          <div className='relative h-0.5 w-full overflow-hidden rounded-full bg-slate-900'>
            <div className='h-full animate-progress bg-gradient-to-r from-blue-500 to-indigo-500' />
          </div>
        </div>
      </div>
    </div>
  );
});

SplashScreen.displayName = 'SplashScreen';

export default SplashScreen;
