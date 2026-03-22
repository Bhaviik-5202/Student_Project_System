/**
 * SplashScreen Component
 *
 * A high-fidelity, animated loading screen shown during application
 * initialization. Features complex SVG animations, themed glassmorphism,
 * and multi-stage initialization progress tracking.
 */
const SplashScreen = () => (
  <div
    className='relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900'
    role='status'
    aria-label='Loading application'
  >
    {/* Animated background elements */}
    <div className='absolute inset-0 overflow-hidden'>
      <div className='absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/20 blur-3xl' />
      <div
        className='absolute bottom-1/4 right-1/4 h-80 w-80 animate-pulse rounded-full bg-indigo-500/20 blur-3xl'
        style={{ animationDelay: '1s' }}
      />
      <div
        className='absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-purple-500/10 blur-3xl'
        style={{ animationDelay: '0.5s' }}
      />
    </div>

    {/* Main content */}
    <div className='z-10 animate-[fadeIn_0.6s_ease-out] text-center'>
      {/* Logo container with glassmorphism */}
      <div className='relative mb-8'>
        {/* Outer rotating ring */}
        <div
          className='absolute inset-0 mx-auto h-32 w-32 animate-spin rounded-full border-2 border-transparent border-r-indigo-400 border-t-blue-400'
          style={{ animationDuration: '3s' }}
        />

        {/* Inner rotating ring (opposite direction) */}
        <div
          className='absolute inset-2 mx-auto h-28 w-28 animate-spin rounded-full border-2 border-transparent border-b-purple-400 border-l-pink-400'
          style={{ animationDuration: '2s', animationDirection: 'reverse' }}
        />

        {/* Logo background with glass effect */}
        <div className='relative mx-auto flex h-32 w-32 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl'>
          {/* Pulsing glow */}
          <div className='absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-50 to-indigo-600 opacity-50 blur-md' />

          {/* Icon container */}
          <div className='relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 shadow-lg'>
            <svg
              className='h-10 w-10 text-white drop-shadow-lg'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
              aria-hidden='true'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5'
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Title with gradient text */}
      <h1 className='mb-3 bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-3xl font-bold text-transparent md:text-4xl'>
        Student Project System
      </h1>

      {/* Subtitle */}
      <p className='mb-8 text-sm font-medium tracking-wide text-blue-200/80 md:text-base'>
        Empowering Academic Excellence
      </p>

      {/* Professional Loading Section */}
      <div className='mx-auto w-80'>
        {/* Loading spinner with orbiting dots */}
        <div className='mb-6 flex justify-center'>
          <div className='relative h-12 w-12'>
            {/* Orbiting dots */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className='absolute h-2.5 w-2.5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400'
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${i * 60}deg) translateY(-20px)`,
                  animation: `orbitFade 1.2s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                  opacity: 0.3,
                }}
              />
            ))}
            {/* Center pulse */}
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='h-3 w-3 animate-ping rounded-full bg-white/80' />
              <div className='absolute h-2 w-2 rounded-full bg-white' />
            </div>
          </div>
        </div>

        {/* Progress bar container */}
        <div className='relative mb-4'>
          {/* Background track */}
          <div className='h-1 overflow-hidden rounded-full bg-white/10 backdrop-blur-sm'>
            {/* Animated progress fill */}
            <div
              className='h-full animate-[loadingProgress_1.2s_ease-in-out_infinite] rounded-full'
              style={{
                background:
                  'linear-gradient(90deg, transparent, #60a5fa, #818cf8, #a78bfa, transparent)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>

          {/* Glowing dot on progress */}
          <div
            className='absolute top-1/2 h-3 w-3 -translate-y-1/2 animate-[progressDot_1.2s_ease-in-out_infinite] rounded-full bg-white shadow-lg shadow-blue-500/50'
            style={{ left: '0%' }}
          />
        </div>

        {/* Loading status */}
        <div className='flex items-center justify-center gap-3'>
          <div className='flex gap-1'>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className='h-1.5 w-1.5 animate-[bounce_0.6s_ease-in-out_infinite] rounded-full bg-blue-400'
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <p className='animate-pulse text-sm font-medium text-blue-200/70'>
            Loading Workspace
          </p>
        </div>

        {/* Loading steps indicator */}
        <div className='mt-6 flex justify-center gap-2'>
          {['Initialize', 'Auth', 'Data', 'UI'].map((step, i) => (
            <div
              key={step}
              className='flex animate-[stepPulse_2s_ease-in-out_infinite] items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium'
              style={{
                animationDelay: `${i * 0.5}s`,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div
                className='h-1.5 w-1.5 animate-[dotGlow_2s_ease-in-out_infinite] rounded-full'
                style={{
                  animationDelay: `${i * 0.5}s`,
                  backgroundColor: '#60a5fa',
                }}
              />
              <span className='text-blue-200/60'>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default SplashScreen;
