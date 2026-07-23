/**
 * LoadingSpinner Component
 *
 * Premium animated loading indicator with:
 *  - Dual contra-rotating arcs with gradient glow
 *  - Pulsing inner orb
 *  - Size variants: small | medium | large | lg
 *  - Optional status message with fade-in
 *  - Full-page overlay mode with frosted-glass backdrop
 */
import { memo } from 'react';
import PropTypes from 'prop-types';

/* ─── Inline keyframe styles (pure CSS, no Tailwind JIT dependency) ───────── */
const STYLE = `
  @keyframes sps-spin-cw  { to { transform: rotate(360deg);  } }
  @keyframes sps-spin-ccw { to { transform: rotate(-360deg); } }
  @keyframes sps-pulse-orb {
    0%, 100% { transform: scale(1);    opacity: 0.7; }
    50%       { transform: scale(1.18); opacity: 1;   }
  }
  @keyframes sps-fade-up {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0);   }
  }
  @keyframes sps-glow-pulse {
    0%, 100% { opacity: 0.25; }
    50%       { opacity: 0.55; }
  }

  .sps-cw  { animation: sps-spin-cw  1.1s linear infinite; }
  .sps-ccw { animation: sps-spin-ccw 1.7s linear infinite; }
  .sps-orb { animation: sps-pulse-orb 1.8s ease-in-out infinite; }
  .sps-msg { animation: sps-fade-up  0.4s ease forwards; }
  .sps-glow{ animation: sps-glow-pulse 2s ease-in-out infinite; }
`;

/* ─── Size tokens ──────────────────────────────────────────────────────────── */
const SIZE = {
  small: { box: 32, strokeOuter: 2.5, strokeInner: 2, orb: 7 },
  medium: { box: 52, strokeOuter: 3, strokeInner: 2.5, orb: 11 },
  large: { box: 72, strokeOuter: 3.5, strokeInner: 3, orb: 15 },
  lg: { box: 72, strokeOuter: 3.5, strokeInner: 3, orb: 15 },
};

/* ─── Core spinner SVG ─────────────────────────────────────────────────────── */
function SpinnerSVG({ config }) {
  const { box, strokeOuter, strokeInner, orb } = config;
  const half = box / 2;
  const rOuter = half - strokeOuter * 1.5;
  const rInner = half - strokeOuter * 1.5 - strokeInner * 3;
  const circOuter = 2 * Math.PI * rOuter;
  const circInner = 2 * Math.PI * rInner;

  return (
    <svg
      width={box}
      height={box}
      viewBox={`0 0 ${box} ${box}`}
      fill='none'
      aria-hidden='true'
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Blue → Indigo gradient for outer arc */}
        <linearGradient id='sps-grad-outer' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stopColor='#3b82f6' />
          <stop offset='100%' stopColor='#6366f1' />
        </linearGradient>
        {/* Violet → Purple gradient for inner arc */}
        <linearGradient id='sps-grad-inner' x1='100%' y1='0%' x2='0%' y2='100%'>
          <stop offset='0%' stopColor='#8b5cf6' />
          <stop offset='100%' stopColor='#06b6d4' />
        </linearGradient>
        {/* Radial glow for orb */}
        <radialGradient id='sps-grad-orb' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#93c5fd' stopOpacity='0.9' />
          <stop offset='100%' stopColor='#3b82f6' stopOpacity='0.3' />
        </radialGradient>
      </defs>

      {/* ── Track ring (outer) ── */}
      <circle
        cx={half} cy={half} r={rOuter}
        stroke='currentColor'
        strokeWidth={strokeOuter}
        className='text-slate-200 dark:text-slate-800'
        opacity={0.5}
      />

      {/* ── Outer spinning arc (clockwise) ── */}
      <g style={{ transformOrigin: `${half}px ${half}px` }} className='sps-cw'>
        <circle
          cx={half} cy={half} r={rOuter}
          stroke='url(#sps-grad-outer)'
          strokeWidth={strokeOuter}
          strokeLinecap='round'
          strokeDasharray={circOuter}
          strokeDashoffset={circOuter * 0.72}
          style={{
            filter: 'drop-shadow(0 0 4px #3b82f680)',
          }}
        />
      </g>

      {/* ── Track ring (inner) ── */}
      <circle
        cx={half} cy={half} r={rInner}
        stroke='currentColor'
        strokeWidth={strokeInner}
        className='text-slate-200 dark:text-slate-800'
        opacity={0.35}
      />

      {/* ── Inner spinning arc (counter-clockwise) ── */}
      <g style={{ transformOrigin: `${half}px ${half}px` }} className='sps-ccw'>
        <circle
          cx={half} cy={half} r={rInner}
          stroke='url(#sps-grad-inner)'
          strokeWidth={strokeInner}
          strokeLinecap='round'
          strokeDasharray={circInner}
          strokeDashoffset={circInner * 0.55}
          style={{
            filter: 'drop-shadow(0 0 3px #8b5cf680)',
          }}
        />
      </g>

      {/* ── Pulsing centre orb ── */}
      <circle
        cx={half} cy={half} r={orb}
        fill='url(#sps-grad-orb)'
        className='sps-orb'
        style={{ transformOrigin: `${half}px ${half}px` }}
      />
    </svg>
  );
}

SpinnerSVG.propTypes = {
  config: PropTypes.object.isRequired,
};

/* ─── Main component ───────────────────────────────────────────────────────── */
const LoadingSpinner = ({
  fullPage = false,
  size = 'medium',
  message,
  className = '',
}) => {
  const config = SIZE[size] ?? SIZE.medium;

  const spinner = (
    <>
      {/* Inject keyframes once (idempotent — browsers de-dup identical <style> text) */}
      <style>{STYLE}</style>

      <div
        className={`flex flex-col items-center justify-center gap-4 ${className}`}
        role='status'
        aria-live='polite'
        aria-label={message ?? 'Loading'}
      >
        {/* Ambient glow behind spinner */}
        <div className='relative flex items-center justify-center'>
          <div
            className='sps-glow absolute rounded-full bg-blue-500/20 blur-xl dark:bg-blue-400/15'
            style={{
              width: config.box * 1.5,
              height: config.box * 1.5,
            }}
          />
          <SpinnerSVG config={config} />
        </div>

        {/* Optional message */}
        {message && (
          <p
            className='sps-msg max-w-[180px] text-center text-sm font-semibold leading-snug text-slate-500 dark:text-slate-400'
          >
            {message}
          </p>
        )}

        <span className='sr-only'>{message ?? 'Loading…'}</span>
      </div>
    </>
  );

  /* ── Full-page overlay ── */
  if (fullPage) {
    return (
      <div
        className='fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-md dark:bg-slate-950/75'
        role='dialog'
        aria-modal='true'
        aria-label='Loading'
      >
        <div className='flex flex-col items-center gap-5 rounded-2xl border border-slate-200/60 bg-white/90 px-10 py-8 shadow-2xl shadow-slate-300/30 dark:border-slate-700/60 dark:bg-slate-900/90 dark:shadow-black/40'>
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
};

LoadingSpinner.propTypes = {
  fullPage: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'lg']),
  message: PropTypes.string,
  className: PropTypes.string,
};

LoadingSpinner.displayName = 'LoadingSpinner';

export default memo(LoadingSpinner);
