import { memo } from 'react';
import { GraduationCap, Sparkles } from 'lucide-react';

/**
 * SplashScreen Component
 * Premium loading screen utilizing hardware-accelerated CSS animations.
 * Keeps zero React state re-renders to guarantee fluid 60fps transitions.
 */
const SplashScreen = memo(() => {
  return (
    <div
      className='relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030712] text-slate-100 select-none'
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
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-6px) scale(1.02); }
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.2); opacity: 0.38; }
        }
        @keyframes loadProgress {
          0% { width: 0%; }
          45% { width: 68%; }
          85% { width: 92%; }
          100% { width: 100%; }
        }
        @keyframes blinkIndicator {
          0%, 100% { opacity: 0.35; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes shimmerLine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-ring-slow {
          animation: rotateRing 14s linear infinite;
        }
        .animate-ring-fast {
          animation: rotateRingReverse 9s linear infinite;
        }
        .animate-float {
          animation: floatLogo 4s ease-in-out infinite;
        }
        .animate-glow {
          animation: pulseGlow 6s ease-in-out infinite;
        }
        .animate-progress {
          animation: loadProgress 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-blink {
          animation: blinkIndicator 1.5s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmerLine 2s infinite;
        }
      `}</style>

      {/* Ambient Background Radial Mesh & Glows */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='animate-glow absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/15 blur-[140px]' />
        <div
          className='animate-glow absolute left-1/3 top-1/3 h-[320px] w-[320px] rounded-full bg-blue-600/10 blur-[110px]'
          style={{ animationDelay: '-3s' }}
        />
        <div
          className='animate-glow absolute bottom-1/3 right-1/3 h-[280px] w-[280px] rounded-full bg-indigo-500/10 blur-[100px]'
          style={{ animationDelay: '-1.5s' }}
        />

        {/* Subtle SVG Grid Overlay */}
        <svg
          className='absolute inset-0 h-full w-full opacity-[0.03]'
          xmlns='http://www.w3.org/2000/svg'
        >
          <defs>
            <pattern
              id='splash-grid'
              width='32'
              height='32'
              patternUnits='userSpaceOnUse'
            >
              <path
                d='M 32 0 L 0 0 0 32'
                fill='none'
                stroke='currentColor'
                strokeWidth='1'
              />
            </pattern>
          </defs>
          <rect width='100%' height='100%' fill='url(#splash-grid)' />
        </svg>
      </div>

      <div className='relative z-10 w-full max-w-sm px-6 text-center'>
        {/* Animated Portal Badge & Logo Icon */}
        <div className='relative mx-auto mb-8 flex h-36 w-36 animate-float items-center justify-center'>
          {/* Outer Dashed Glowing Ring */}
          <div className='animate-ring-slow absolute inset-0 rounded-full border border-dashed border-indigo-500/30' />

          {/* Inner Gradient Segmented Ring */}
          <div className='animate-ring-fast absolute inset-2.5 rounded-full border-2 border-transparent border-b-indigo-500/70 border-t-blue-500/70' />

          {/* Center Glowing Glass Icon Box */}
          <div className='relative flex h-20 w-20 items-center justify-center rounded-2xl border border-indigo-500/30 bg-slate-900/90 shadow-2xl shadow-indigo-950/60 backdrop-blur-md'>
            <div className='flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-indigo-500 shadow-lg shadow-indigo-500/25'>
              <GraduationCap className='h-8 w-8 text-white' />
            </div>
          </div>
        </div>

        {/* Branding & Platform Title */}
        <div className='space-y-1.5'>
          <h1 className='font-display text-2xl font-black tracking-tight text-white'>
            Student<span className='text-indigo-400'>.</span>Project
            <span className='text-blue-400'>.</span>System
          </h1>
          <p className='text-xs font-semibold text-slate-400 tracking-wide'>
            Academic Excellence Portal
          </p>
        </div>

        {/* Active Status Badge */}
        <div className='mt-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-950/40 px-3.5 py-1.5 text-[11px] font-bold text-indigo-300 shadow-inner backdrop-blur-sm'>
          <span className='animate-blink h-2 w-2 rounded-full bg-indigo-400' />
          <span>Setting up workspace...</span>
          <Sparkles size={12} className='text-indigo-400' />
        </div>

        {/* Hardware Progress Bar */}
        <div className='mx-auto mt-8 w-48'>
          <div className='relative h-1 w-full overflow-hidden rounded-full bg-slate-800/80 border border-slate-700/40'>
            <div className='h-full animate-progress bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-400 rounded-full relative overflow-hidden'>
              <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer' />
            </div>
          </div>
          <p className='mt-2 text-[10px] text-slate-500 dark:text-slate-400 font-mono font-medium'>
            Synchronizing modules & permissions
          </p>
        </div>
      </div>
    </div>
  );
});

SplashScreen.displayName = 'SplashScreen';

export default SplashScreen;
