import { memo, useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  GraduationCap,
  Users,
  LayoutDashboard,
  MessageSquare,
  Calendar,
} from 'lucide-react';

// Canvas-based particle and grid pulse background animation for premium unified auth background
const AuthParticleNetwork = memo(() => {
  useEffect(() => {
    const canvas = document.getElementById('auth-particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const particleCount = 30;
    const connectionDistance = 110;
    const gridSize = 65;

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.radius = Math.random() * 1.5 + 0.8;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99, 102, 241, 0.12)';
        ctx.fill();
      }
    }

    class GridPulse {
      constructor() {
        this.reset();
      }

      reset() {
        this.isVertical = Math.random() > 0.5;
        this.coord =
          Math.floor(
            Math.random() *
              (this.isVertical ? width / gridSize : height / gridSize)
          ) * gridSize;
        this.pos = 0;
        this.speed = Math.random() * 1.0 + 0.6;
        this.length = Math.random() * 100 + 60;
      }

      update() {
        this.pos += this.speed;
        if (this.pos > (this.isVertical ? height : width)) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        const startX = this.isVertical ? this.coord : this.pos;
        const startY = this.isVertical ? this.pos : this.coord;
        const endX = this.isVertical
          ? this.coord
          : this.pos + (this.isVertical ? 0 : this.length);
        const endY = this.isVertical
          ? this.pos + (this.isVertical ? this.length : 0)
          : this.coord;

        const grad = ctx.createLinearGradient(startX, startY, endX, endY);
        grad.addColorStop(0, 'rgba(99, 102, 241, 0.04)');
        grad.addColorStop(0.5, 'rgba(99, 102, 241, 0.09)');
        grad.addColorStop(1, 'transparent');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const pulses = [new GridPulse(), new GridPulse(), new GridPulse()];

    const resize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw Grid Lines with very low opacity
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.012)';
      ctx.lineWidth = 0.8;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Flowing Grid Pulses
      for (const pulse of pulses) {
        pulse.update();
        pulse.draw();
      }

      // Draw Connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.08;
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      id='auth-particle-canvas'
      className='pointer-events-none fixed inset-0 -z-10 h-full w-full'
    />
  );
});

AuthParticleNetwork.displayName = 'AuthParticleNetwork';

const AuthLayout = ({ children }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
  }, []);

  const features = [
    {
      icon: <Users className='h-5 w-5' />,
      title: 'Role-based Access Control',
      desc: 'Secure customized logins for Students, Faculty Mentors, and Administrators.',
    },
    {
      icon: <LayoutDashboard className='h-5 w-5' />,
      title: 'Project Tracking Dashboard',
      desc: 'Visual timeline logs, proposal status flows, and document reviews.',
    },
    {
      icon: <MessageSquare className='h-5 w-5' />,
      title: 'Faculty Collaboration',
      desc: 'Direct review commentary, meeting reports logs, and mentor evaluations.',
    },
    {
      icon: <Calendar className='h-5 w-5' />,
      title: 'Submission Management',
      desc: 'Upload milestone files, connect repository archives, and track evaluations.',
    },
  ];

  return (
    <div className='font-sans-custom relative flex min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white transition-colors duration-350 dark:bg-slate-900 dark:text-slate-100 lg:flex-row'>
      {/* Import Pairing Fonts dynamically via style block */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        
        .font-display {
          font-family: 'Space Grotesk', sans-serif;
        }
        .font-sans-custom {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* Flowing Premium Grid Background Lines */
        @keyframes flowGrid {
          0% { background-position: 0 0; }
          100% { background-position: 50px 50px; }
        }

        .blueprint-grid-overlay {
          background-size: 50px 50px;
          background-image: 
          linear-gradient(to right, rgba(99, 102, 241, 0.02) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(99, 102, 241, 0.02) 1px, transparent 1px);
          animation: flowGrid 20s infinite linear;
        }

        .blueprint-dots {
          background-size: 25px 25px;
          background-image: radial-gradient(rgba(99, 102, 241, 0.02) 1px, transparent 1px);
        }
      `}</style>

      {/* Global Background Grid and Canvas Animations seamless across the entire screen */}
      <div className='blueprint-grid-overlay pointer-events-none absolute inset-0 -z-20' />
      <div className='blueprint-dots pointer-events-none absolute inset-0 -z-20' />
      <AuthParticleNetwork />

      {/* Glow Orbs in Background */}
      <div className='pointer-events-none absolute -bottom-20 -left-20 -z-10 h-80 w-80 rounded-full bg-indigo-500/5 blur-[90px]' />
      <div className='pointer-events-none absolute -right-20 -top-20 -z-10 h-80 w-80 rounded-full bg-cyan-500/5 blur-[90px]' />

      {/* Left Side - Showcase Panel (Hidden on mobile) */}
      <div className='relative hidden w-1/2 flex-col justify-center overflow-hidden border-r border-slate-200 bg-transparent p-12 text-slate-900 dark:text-white dark:border-slate-900  lg:flex xl:p-20'>
        <div className='z-10 mx-auto flex h-full w-full max-w-lg flex-col justify-center space-y-12'>
          <Link to='/' className='group inline-flex items-center space-x-3'>
            <div className='from-blue-650 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr to-indigo-600 shadow-md shadow-blue-500/20 transition-all duration-300 group-hover:scale-105'>
              <GraduationCap className='h-5.5 w-5.5 text-white' />
            </div>
            <span className='font-display text-lg font-extrabold tracking-tight text-slate-900 dark:text-white'>
              Student Project System
            </span>
          </Link>

          <div className='space-y-4'>
            <h1 className='font-display text-4xl font-extrabold leading-tight text-slate-900 dark:text-white xl:text-5xl'>
              Manage Academic Projects <br />
              <span className='bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400'>
                With Complete Control.
              </span>
            </h1>

            <p className='text-sm font-semibold leading-relaxed text-slate-600 dark:text-slate-400'>
              A comprehensive platform designed for students, faculty, and
              administrators to streamline the entire project lifecycle from
              proposal to final submission.
            </p>
          </div>

          <div className='grid w-full gap-4'>
            {features.map((feature, index) => (
              <div
                key={index}
                className='dark:hover:border-indigo-550/20 group flex items-start space-x-4 rounded-2xl border border-slate-200 bg-white dark:bg-slate-900/60 p-5 shadow-sm transition-all duration-300 hover:border-indigo-500/20 hover:bg-white dark:bg-slate-900 dark:border-slate-800/80 /15 dark:shadow-none dark:hover:bg-slate-900/40'
              >
                <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600 transition-colors group-hover:border-indigo-500/40 dark:border-indigo-900/30 dark:bg-indigo-950/45 dark:text-indigo-400'>
                  {feature.icon}
                </div>
                <div>
                  <h4 className='font-display text-sm font-bold text-slate-800 dark:text-slate-100 transition-colors group-hover:text-indigo-600 dark:text-slate-200 dark:group-hover:text-indigo-400'>
                    {feature.title}
                  </h4>
                  <p className='mt-1.5 text-[11px] font-semibold leading-relaxed text-slate-500 dark:text-slate-400'>
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form Container */}
      <div className='relative flex flex-1 items-center justify-center bg-transparent p-4 sm:p-6 md:p-12'>
        <div
          className={`z-10 w-full max-w-lg transition-all duration-500 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        >
          <Suspense
            fallback={
              <div className='flex h-64 items-center justify-center'>
                <div className='border-indigo-650 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent'></div>
              </div>
            }
          >
            {children}
          </Suspense>

          <p className='mt-8 text-center text-xs font-semibold text-slate-500 dark:text-slate-400'>
            &copy; {new Date().getFullYear()} Student Project System. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default memo(AuthLayout);
