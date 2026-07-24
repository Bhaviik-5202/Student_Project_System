import { memo, useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  ChevronRight,
  LayoutDashboard,
  BarChart3,
  ShieldCheck,
  GraduationCap,
  ArrowRight,
  Sparkles,
  Zap,
  ChevronDown,
  Target,
  FileText,
  Clock,
  Layers,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  Upload,
  FolderOpen,
  Search,
  CheckCircle2,
  Github,
  Linkedin,
  Twitter,
  Send,
  MessageSquare,
  Lock,
  UserCheck,
  Award,
  Check,
} from 'lucide-react';
import { CONTACT_INFO } from '../../../utils/constants';

// Canvas-based particle and grid pulse background animation for premium technology aesthetic
const ParticleNetwork = memo(() => {
  useEffect(() => {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const particleCount = 35;
    const connectionDistance = 110;
    const gridSize = 65;

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
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

    // Grid Pulses traveling along vertical and horizontal lines
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
        this.speed = Math.random() * 1.2 + 0.8;
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

    const pulses = [
      new GridPulse(),
      new GridPulse(),
      new GridPulse(),
      new GridPulse(),
    ];

    const resize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Grid Lines with very low opacity
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

      // 2. Draw Flowing Grid Pulses
      for (const pulse of pulses) {
        pulse.update();
        pulse.draw();
      }

      // 3. Draw Connecting Particles Network
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.1;
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
      id='particle-canvas'
      className='pointer-events-none fixed inset-0 -z-10 h-full w-full'
    />
  );
});

ParticleNetwork.displayName = 'ParticleNetwork';

const Landing = memo(() => {
  const [activeSection, setActiveSection] = useState('hero');
  const [openFaq, setOpenFaq] = useState(null);
  const [faqSearch, setFaqSearch] = useState('');
  const [faqCategory, setFaqCategory] = useState('all');
  const [isScrolled, setIsScrolled] = useState(false);

  // Force Dark Theme on mount and restore on unmount
  useEffect(() => {
    const root = document.documentElement;

    // Force dark mode on html root
    root.classList.add('dark');
    root.classList.remove('light');
    root.setAttribute('data-theme', 'dark');

    return () => {
      // Re-apply the user's actual selected theme class on cleanup
      const savedThemeMode = localStorage.getItem('app_theme_mode') || 'auto';

      let systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      let targetTheme = savedThemeMode;
      if (savedThemeMode === 'auto') {
        targetTheme = systemPrefersDark ? 'dark' : 'light';
      }

      if (targetTheme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      }
    };
  }, []);

  // Scroll handler for navbar glass effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Active Section Tracking
      const sections = [
        'hero',
        'about',
        'features',
        'operational',
        'modules',
        'faq',
      ];
      const scrollPos = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        const el = document.getElementById(`section-${section}`);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = useMemo(
    () => [
      {
        icon: <Upload className='h-6 w-6' />,
        title: 'Project Upload Hub',
        description:
          'Submit project proposals, system architecture, abstracts, and archives in one interface.',
        accent: 'blue',
        points: [
          'Multi-format File support',
          'Size limits up to 50MB',
          'Repository links connection',
        ],
      },
      {
        icon: <LayoutDashboard className='h-6 w-6' />,
        title: 'Interactive Board',
        description:
          'Visual status boards showing proposal evaluations, guide assignments, and task phases.',
        accent: 'emerald',
        points: [
          'Sprint Task coordination',
          'Real-time status tracking',
          'Audit activity logs',
        ],
      },
      {
        icon: <FolderOpen className='h-6 w-6' />,
        title: 'Document Repository',
        description:
          'Shared file vaults for project files, slides, code versions, and review logs.',
        accent: 'cyan',
        points: [
          'Secure files directory',
          'Version control history',
          'Guides download directory',
        ],
      },
      {
        icon: <Users className='h-6 w-6' />,
        title: 'Team Assembly Room',
        description:
          'Form project groups, assign lead responsibilities, and invite group mates.',
        accent: 'purple',
        points: [
          'Group invitation system',
          'Lead permissions control',
          'In-app member list',
        ],
      },
      {
        icon: <ShieldCheck className='h-6 w-6' />,
        title: 'Guide Reviews',
        description:
          'Receive real-time evaluations, feedback logs, and meeting audits from faculty mentors.',
        accent: 'teal',
        points: [
          'Online feedback threads',
          'Audit meetings logs',
          'Approval status controls',
        ],
      },
      {
        icon: <Zap className='h-6 w-6' />,
        title: 'Instant Bulletins',
        description:
          'Dashboard warnings, system email alerts, and deadline reminders for submissions.',
        accent: 'sky',
        points: [
          'Automated timeline alerts',
          'System email bulletins',
          'Deadline countdown notifications',
        ],
      },
      {
        icon: <BarChart3 className='h-6 w-6' />,
        title: 'Analytics Dashboard',
        description:
          'Visual progress logs, work distribution charts, and project phase statistics.',
        accent: 'indigo',
        points: [
          'Ratio status graphs',
          'Activity metric monitors',
          'Global system audit logs',
        ],
      },
      {
        icon: <Clock className='h-6 w-6' />,
        title: 'Timeline Tracker',
        description:
          'Integrates Gantt views, milestone countdowns, and sprint logs to keep cycles on target.',
        accent: 'slate',
        points: [
          'Gantt phase viewer',
          'Milestone countdown check',
          'Timeline revision controller',
        ],
      },
    ],
    []
  );

  const workflowSteps = useMemo(
    () => [
      {
        number: '1',
        title: 'Create Account',
        desc: 'Sign up and configure your academic credentials.',
        icon: <Users className='h-5 w-5' />,
      },
      {
        number: '2',
        title: 'Choose Role',
        desc: 'Select Student, Faculty Guide, or Administrator access.',
        icon: <UserCheck className='h-5 w-5' />,
      },
      {
        number: '3',
        title: 'Login',
        desc: 'Securely authenticate using your password and OTP check.',
        icon: <Lock className='h-5 w-5' />,
      },
      {
        number: '4',
        title: 'Create / Join Project',
        desc: 'Form your team and propose your UDP/IDP project idea.',
        icon: <Target className='h-5 w-5' />,
      },
      {
        number: '5',
        title: 'Upload Files',
        desc: 'Attach project synopsis, diagrams, reports, or slides.',
        icon: <Upload className='h-5 w-5' />,
      },
      {
        number: '6',
        title: 'Faculty Review',
        desc: 'Your assigned guide checks uploaded deliverables online.',
        icon: <ShieldCheck className='h-5 w-5' />,
      },
      {
        number: '7',
        title: 'Feedback',
        desc: 'Review comments, edit documentation, and log changes.',
        icon: <MessageSquare className='h-5 w-5' />,
      },
      {
        number: '8',
        title: 'Approval',
        desc: 'Mentor updates status log flags to approved/planning.',
        icon: <CheckCircle2 className='h-5 w-5' />,
      },
      {
        number: '9',
        title: 'Project Completion',
        desc: 'Project moves to completed phase, ready for department grades.',
        icon: <Award className='h-5 w-5' />,
      },
    ],
    []
  );

  const faqs = useMemo(
    () => [
      {
        q: 'What is the Student Project System?',
        a: 'The Student Project System is a state-of-the-art SaaS workspace developed specifically for academic institutions to manage, collaborate, track, and evaluate student projects (UDP/IDP) from inception to final grade submission.',
        category: 'general',
      },
      {
        q: 'How do I register?',
        a: 'Click "Sign Up", select your correct role (Student, Faculty/Guide, or Admin), enter your academic details, and complete the authentication process with the verification code sent to your registered email address.',
        category: 'general',
      },
      {
        q: 'How do I submit a project?',
        a: 'As a student, navigate to the Projects tab, click "Project Proposal", choose project parameters (title, description, UDP/IDP type), select your group mates and preferred guide, upload your synopsis file, and hit submit.',
        category: 'students',
      },
      {
        q: 'How do I join a project team?',
        a: 'The student who creates the project proposal can invite other team members by entering their registered student profile IDs in the members field. You will receive an invitation to join the team on your dashboard.',
        category: 'students',
      },
      {
        q: 'How can faculty review projects?',
        a: 'Faculty guides can log in to view their assigned project lists. They can access student files, log review feedback, write meeting reports, score milestone submissions, and update overall project statuses.',
        category: 'faculty',
      },
      {
        q: 'How do I download project files?',
        a: 'Access the specific Project details page, go to the Attachments or Resource section, and click on any uploaded report, synopsis, or presentation document to download it directly.',
        category: 'general',
      },
      {
        q: 'Who can access my projects?',
        a: 'Your project is visible to you, your invited group members, your allocated faculty guide, and the department administrators. General project gallery views can be enabled for peer reviews if authorized.',
        category: 'general',
      },
      {
        q: 'How do I reset my password?',
        a: 'Click the "Sign In" link, then select "Forgot password?". Enter your email address to receive a secure password reset link, which will allow you to define a new credential.',
        category: 'general',
      },
      {
        q: 'Can I edit my submitted project?',
        a: 'Yes. Students can request revisions or edit project details as long as the proposal is in "Pending" or "Draft" state. Once approved by the guide, edits require guide authorization.',
        category: 'students',
      },
      {
        q: 'What file formats are supported?',
        a: 'The portal supports PDF, DOCX, PPTX, ZIP, and tar.gz formats. Size configurations default up to 50MB per upload, with direct URLs supported for git code repositories.',
        category: 'general',
      },
    ],
    []
  );

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory =
        faqCategory === 'all' || faq.category === faqCategory;
      const matchesSearch =
        faq.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
        faq.a.toLowerCase().includes(faqSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [faqs, faqCategory, faqSearch]);

  const toggleFaq = (question) => {
    setOpenFaq(openFaq === question ? null : question);
  };

  return (
    <div className='font-sans-custom relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 transition-colors duration-300'>
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
            linear-gradient(to right, rgba(99, 102, 241, 0.025) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.025) 1px, transparent 1px);
          animation: flowGrid 20s infinite linear;
        }

        .blueprint-dots {
          background-size: 25px 25px;
          background-image: radial-gradient(rgba(99, 102, 241, 0.025) 1px, transparent 1px);
        }

        /* Continuous grid light scan */
        @keyframes gridScan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .grid-scan-beam::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent, rgba(99, 102, 241, 0.012) 50%, transparent);
          animation: gridScan 12s infinite linear;
          pointer-events: none;
        }

        /* Glowing Orbs */
        .glow-orb-cyan {
          background: radial-gradient(circle, rgba(6, 182, 212, 0.05) 0%, transparent 70%);
        }
        .glow-orb-indigo {
          background: radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%);
        }
      `}</style>

      {/* Global Background Grid, Dots, and Canvas animation that continues across all sections */}
      <div className='blueprint-grid-overlay pointer-events-none absolute inset-0 -z-20' />
      <div className='blueprint-dots pointer-events-none absolute inset-0 -z-20' />
      <div className='grid-scan-beam pointer-events-none absolute inset-0 -z-20' />
      <ParticleNetwork />

      {/* Glow Orbs in Background */}
      <div className='glow-orb-cyan pointer-events-none absolute left-1/4 top-20 -z-10 h-[600px] w-[600px] rounded-full blur-[100px]' />
      <div className='glow-orb-indigo pointer-events-none absolute right-1/4 top-80 -z-10 h-[700px] w-[700px] rounded-full blur-[120px]' />

      {/* Sticky Premium Navbar */}
      <nav
        className={`fixed left-4 right-4 top-4 z-50 mx-auto max-w-7xl rounded-2xl border transition-all duration-300 ${
          isScrolled
            ? 'border-slate-800/80 bg-slate-950/85 px-6 py-3.5 shadow-lg shadow-black/20 backdrop-blur-md'
            : 'py-4.5 border-transparent bg-slate-950/15 px-6 backdrop-blur-[2px]'
        }`}
      >
        <div className='flex items-center justify-between'>
          {/* Logo */}
          <Link to='/' className='group flex items-center space-x-3'>
            <div className='to-indigo-650 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 shadow-md shadow-blue-500/20 transition-all duration-300 group-hover:scale-105'>
              <GraduationCap className='h-5.5 w-5.5 text-white' />
            </div>
            <span className='font-display text-lg font-extrabold tracking-tight text-white sm:text-xl'>
              Student Project
            </span>
          </Link>

          {/* Links Section with Active Underlines */}
          <div className='hidden items-center space-x-8 md:flex'>
            {[
              { id: 'about', label: 'About' },
              { id: 'features', label: 'Features' },
              { id: 'operational', label: 'Operational' },
              { id: 'modules', label: 'Modules' },
              { id: 'faq', label: 'FAQ' },
            ].map((sect) => (
              <a
                key={sect.id}
                href={`#section-${sect.id}`}
                className={`relative text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${
                  activeSection === sect.id
                    ? 'text-blue-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sect.label}
                {activeSection === sect.id && (
                  <motion.div
                    layoutId='navIndicator'
                    className='absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-blue-500'
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className='flex items-center space-x-5'>
            <Link
              to='/login'
              className='text-slate-350 text-xs font-bold uppercase tracking-wider transition-colors hover:text-blue-400'
            >
              Sign In
            </Link>
            <Link
              to='/register'
              className='relative flex items-center space-x-1.5 overflow-hidden rounded-xl border border-slate-800 bg-transparent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-300 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-900/40 hover:text-white active:scale-95'
            >
              <span>Register</span>
              <ChevronRight className='h-4 w-4' />
            </Link>
          </div>
        </div>
      </nav>

      {/* Section 1: Hero Section */}
      <section
        id='section-hero'
        className='relative mx-auto mt-20 flex min-h-[calc(100vh-80px)] w-full max-w-5xl items-center justify-center bg-transparent px-6 pb-20 pt-12 text-center'
      >
        <div className='z-10 w-full space-y-8'>
          <div className='bg-blue-955/35 mx-auto inline-flex items-center space-x-2.5 rounded-full border border-blue-900/30 px-4 py-1.5'>
            <Sparkles className='text-blue-450 h-4 w-4 animate-pulse' />
            <span className='text-blue-450 text-[10px] font-extrabold uppercase tracking-widest'>
              Academic Student Project Portal
            </span>
          </div>

          {/* High-Contrast Hero Title (Fixed non-existent from-blue-450 class to standard from-blue-400) */}
          <h1 className='font-display text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl'>
            Manage Student Projects <br />
            <span className='bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent'>
              Without Operational Friction
            </span>
          </h1>

          <p className='mx-auto max-w-2xl text-base font-medium leading-relaxed text-slate-400 sm:text-lg md:text-xl'>
            A high-end SaaS-style workspace engineered for academic departments.
            Manage team collaborations, allocate guides, submit abstracts, and
            track progress on a unified grid interface.
          </p>

          {/* Premium Clean CTA Buttons (Start Free Account and Sign In Portal styled identically as requested) */}
          <div className='flex flex-col items-center justify-center space-y-4 pt-3 sm:flex-row sm:space-x-4 sm:space-y-0'>
            <Link
              to='/register'
              className='hover:bg-slate-850 flex w-full items-center justify-center rounded-xl border border-slate-800 bg-slate-900/50 px-8 py-4 text-center text-sm font-extrabold uppercase tracking-wider text-slate-300 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:border-slate-700 hover:text-white active:scale-95 sm:w-auto'
            >
              Start Free Account
            </Link>
            <Link
              to='/login'
              className='hover:bg-slate-850 flex w-full items-center justify-center rounded-xl border border-slate-800 bg-slate-900/50 px-8 py-4 text-center text-sm font-extrabold uppercase tracking-wider text-slate-300 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:border-slate-700 hover:text-white active:scale-95 sm:w-auto'
            >
              Sign In Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: Platform Specifications & Overview */}
      <section
        id='section-about'
        className='relative flex w-full items-center justify-center border-t border-slate-900 bg-transparent px-6 py-28'
      >
        <div className='flex w-full max-w-7xl flex-col justify-center bg-transparent'>
          <div className='mx-auto mb-16 max-w-2xl text-center'>
            <span className='rounded-full border border-blue-900/30 bg-blue-950/40 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-blue-400'>
              Overview
            </span>
            <h2 className='font-display mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl'>
              Platform Specifications & Architecture
            </h2>
            <p className='mt-3 text-sm font-medium text-slate-400 sm:text-base'>
              A robust environment tailored to coordinate documents, timelines,
              and guides with complete academic structure.
            </p>
          </div>

          <div className='grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {/* Card 1: Central Repository */}
            <div className='group flex flex-col justify-between space-y-6 rounded-3xl border border-slate-800 bg-slate-900/30 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-500/20 hover:bg-slate-900/70'>
              <div className='space-y-4'>
                <div className='bg-cyan-955/50 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-900/30 text-cyan-400'>
                  <FileText className='h-6 w-6' />
                </div>
                <h3 className='font-display text-lg font-bold text-white transition-colors group-hover:text-cyan-400'>
                  Document Library
                </h3>
                <p className='text-xs font-semibold leading-relaxed text-slate-400'>
                  Consolidate project abstracts, presentations, and repository
                  archives in shared file vaults accessible to faculty.
                </p>
              </div>
              <ul className='text-slate-450 space-y-1.5 border-t border-slate-800/80 pt-3 text-[11px] font-bold'>
                <li className='flex items-center gap-2'>
                  <Check className='text-cyan-450 h-3.5 w-3.5' /> PDF, ZIP, PPTX
                  format
                </li>
                <li className='flex items-center gap-2'>
                  <Check className='text-cyan-450 h-3.5 w-3.5' /> Max file
                  limit: 50MB
                </li>
                <li className='flex items-center gap-2'>
                  <Check className='text-cyan-450 h-3.5 w-3.5' /> Git URL
                  linking
                </li>
              </ul>
            </div>

            {/* Card 2: Team Collaboration */}
            <div className='group flex flex-col justify-between space-y-6 rounded-3xl border border-slate-800 bg-slate-900/30 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-500/20 hover:bg-slate-900/70'>
              <div className='space-y-4'>
                <div className='bg-blue-955/50 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-900/30 text-blue-400'>
                  <Users className='h-6 w-6' />
                </div>
                <h3 className='font-display text-lg font-bold text-white transition-colors group-hover:text-blue-400'>
                  Team Assembly
                </h3>
                <p className='text-xs font-semibold leading-relaxed text-slate-400'>
                  Form collaborative student groups, define leaders, and search
                  candidate records directly inside the directory.
                </p>
              </div>
              <ul className='text-slate-450 space-y-1.5 border-t border-slate-800/80 pt-3 text-[11px] font-bold'>
                <li className='flex items-center gap-2'>
                  <Check className='text-blue-455 h-3.5 w-3.5' /> Dynamic
                  project invites
                </li>
                <li className='flex items-center gap-2'>
                  <Check className='text-blue-455 h-3.5 w-3.5' /> Team
                  leadership flags
                </li>
                <li className='flex items-center gap-2'>
                  <Check className='text-blue-455 h-3.5 w-3.5' /> Group limits
                  controls
                </li>
              </ul>
            </div>

            {/* Card 3: Academic Workflow */}
            <div className='group flex flex-col justify-between space-y-6 rounded-3xl border border-slate-800 bg-slate-900/30 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-purple-500/20 hover:bg-slate-900/70'>
              <div className='space-y-4'>
                <div className='bg-purple-955/50 flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-900/30 text-purple-400'>
                  <Target className='h-6 w-6' />
                </div>
                <h3 className='font-display text-lg font-bold text-white transition-colors group-hover:text-purple-400'>
                  Goal Alignment
                </h3>
                <p className='text-xs font-semibold leading-relaxed text-slate-400'>
                  Align with course standards by submitting proposals that map
                  to institutional targets and evaluation criteria.
                </p>
              </div>
              <ul className='text-slate-450 space-y-1.5 border-t border-slate-800/80 pt-3 text-[11px] font-bold'>
                <li className='flex items-center gap-2'>
                  <Check className='text-purple-455 h-3.5 w-3.5' /> UDP/IDP
                  matching templates
                </li>
                <li className='flex items-center gap-2'>
                  <Check className='text-purple-455 h-3.5 w-3.5' /> Status step
                  alerts
                </li>
                <li className='flex items-center gap-2'>
                  <Check className='text-purple-455 h-3.5 w-3.5' /> Project
                  milestone timelines
                </li>
              </ul>
            </div>

            {/* Card 4: Faculty Evaluation */}
            <div className='group flex flex-col justify-between space-y-6 rounded-3xl border border-slate-800 bg-slate-900/30 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/20 hover:bg-slate-900/70'>
              <div className='space-y-4'>
                <div className='bg-emerald-955/50 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-900/30 text-emerald-400'>
                  <ShieldCheck className='h-6 w-6' />
                </div>
                <h3 className='font-display text-lg font-bold text-white transition-colors group-hover:text-emerald-400'>
                  Mentor Reviews
                </h3>
                <p className='text-xs font-semibold leading-relaxed text-slate-400'>
                  Allocated faculty mentors write feedback notes, grade
                  milestones, and verify meeting audits.
                </p>
              </div>
              <ul className='text-slate-450 space-y-1.5 border-t border-slate-800/80 pt-3 text-[11px] font-bold'>
                <li className='flex items-center gap-2'>
                  <Check className='text-emerald-450 h-3.5 w-3.5' /> Feedback
                  audit logs
                </li>
                <li className='flex items-center gap-2'>
                  <Check className='text-emerald-450 h-3.5 w-3.5' /> Secure
                  milestone marks
                </li>
                <li className='flex items-center gap-2'>
                  <Check className='text-emerald-450 h-3.5 w-3.5' /> Guide
                  matching criteria
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Platform Features (Redesigned with soft neutral background tones, accent border hover, and matching icons) */}
      <section
        id='section-features'
        className='relative flex w-full items-center justify-center border-t border-slate-900 bg-transparent px-6 py-28'
      >
        <div className='flex w-full max-w-7xl flex-col justify-center bg-transparent'>
          <div className='mx-auto mb-16 max-w-2xl text-center'>
            <span className='rounded-full border border-emerald-900/30 bg-emerald-950/40 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-emerald-400'>
              Features
            </span>
            <h2 className='font-display mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl'>
              Core Platform Capabilities
            </h2>
            <p className='mt-3 text-sm font-medium text-slate-400 sm:text-base'>
              High-fidelity project coordination features custom-built for
              academic project courses.
            </p>
          </div>

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {features.map((feat, idx) => {
              // Softer accent border configuration and matching details (No bright saturated card backgrounds)
              const hoverGlowClass =
                feat.accent === 'blue'
                  ? 'hover:border-blue-500/25 dark:hover:shadow-[0_0_20px_rgba(59,130,246,0.03)]'
                  : feat.accent === 'emerald'
                    ? 'hover:border-emerald-500/25 dark:hover:shadow-[0_0_20px_rgba(16,185,129,0.03)]'
                    : feat.accent === 'cyan'
                      ? 'hover:border-cyan-500/25 dark:hover:shadow-[0_0_20px_rgba(6,182,212,0.03)]'
                      : feat.accent === 'purple'
                        ? 'hover:border-purple-500/25 dark:hover:shadow-[0_0_20px_rgba(139,92,246,0.03)]'
                        : feat.accent === 'teal'
                          ? 'hover:border-teal-500/25 dark:hover:shadow-[0_0_20px_rgba(20,184,166,0.03)]'
                          : feat.accent === 'sky'
                            ? 'hover:border-sky-500/25 dark:hover:shadow-[0_0_20px_rgba(56,189,248,0.03)]'
                            : feat.accent === 'indigo'
                              ? 'hover:border-indigo-500/25 dark:hover:shadow-[0_0_20px_rgba(99,102,241,0.03)]'
                              : 'hover:border-slate-500/25 dark:hover:shadow-[0_0_20px_rgba(148,163,184,0.03)]';

              const iconBgClass =
                feat.accent === 'blue'
                  ? 'bg-blue-955/40 text-blue-400 border border-blue-900/30'
                  : feat.accent === 'emerald'
                    ? 'bg-emerald-955/40 text-emerald-400 border border-emerald-900/30'
                    : feat.accent === 'cyan'
                      ? 'bg-cyan-955/40 text-cyan-400 border border-cyan-900/30'
                      : feat.accent === 'purple'
                        ? 'bg-purple-955/40 text-purple-400 border border-purple-900/30'
                        : feat.accent === 'teal'
                          ? 'bg-teal-955/40 text-teal-400 border border-teal-900/30'
                          : feat.accent === 'sky'
                            ? 'bg-sky-955/40 text-sky-400 border border-sky-900/30'
                            : feat.accent === 'indigo'
                              ? 'bg-indigo-955/40 text-indigo-400 border border-indigo-900/30'
                              : 'bg-slate-900/40 text-slate-400 border border-slate-800';

              const checkColorClass =
                feat.accent === 'blue'
                  ? 'text-blue-400'
                  : feat.accent === 'emerald'
                    ? 'text-emerald-400'
                    : feat.accent === 'cyan'
                      ? 'text-cyan-400'
                      : feat.accent === 'purple'
                        ? 'text-purple-400'
                        : feat.accent === 'teal'
                          ? 'text-teal-400'
                          : feat.accent === 'sky'
                            ? 'text-sky-400'
                            : feat.accent === 'indigo'
                              ? 'text-indigo-400'
                              : 'text-slate-400';

              return (
                <div
                  key={idx}
                  className={`group flex flex-col justify-between space-y-6 rounded-3xl border border-slate-800 bg-slate-900/25 p-8 transition-all duration-300 hover:-translate-y-1.5 ${hoverGlowClass}`}
                >
                  <div className='space-y-4'>
                    {/* Consistent icon wrap dimensions and rounded borders */}
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${iconBgClass}`}
                    >
                      {feat.icon}
                    </div>
                    <h3 className='font-display group-hover:text-slate-205 text-lg font-bold text-white transition-colors'>
                      {feat.title}
                    </h3>
                    <p className='text-xs font-semibold leading-relaxed text-slate-400'>
                      {feat.description}
                    </p>
                  </div>

                  {/* Bottom Checklist mapping exactly to modules card structure */}
                  <div className='text-slate-450 space-y-2 border-t border-slate-800/80 pt-4 text-xs font-bold'>
                    {feat.points.map((pt, pIdx) => (
                      <div key={pIdx} className='flex items-center gap-2'>
                        <Check className={`h-4 w-4 ${checkColorClass}`} />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 4: Operational Workflow & Lifecycle */}
      <section
        id='section-operational'
        className='relative flex w-full items-center justify-center border-t border-slate-900 bg-transparent px-6 py-28'
      >
        <div className='w-full max-w-6xl text-left'>
          <div className='mx-auto mb-20 max-w-2xl text-center'>
            <span className='rounded-full border border-indigo-900/30 bg-indigo-950/40 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-indigo-400'>
              Operational
            </span>
            <h2 className='font-display mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl'>
              Operational Workflow & Lifecycle
            </h2>
            <p className='text-slate-455 mt-3 text-sm font-medium sm:text-base'>
              Follow the process steps to deploy and audit projects correctly.
            </p>
          </div>

          {/* Stepper connector list */}
          <div className='relative mx-auto w-full max-w-4xl'>
            <div className='absolute bottom-4 left-8 top-4 hidden w-0.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-emerald-500 opacity-20 md:block' />

            <div className='w-full space-y-10'>
              {workflowSteps.map((step, idx) => (
                <div
                  key={idx}
                  className='group relative flex w-full flex-col items-start md:flex-row md:space-x-8'
                >
                  {/* Step visual indicator */}
                  <div className='relative z-10 flex items-center space-x-4 md:space-x-0'>
                    <div className='flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-slate-800 bg-slate-900 text-blue-400 shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:border-blue-500/50 group-hover:text-blue-300'>
                      {step.icon}
                    </div>
                    <span className='text-xs font-black uppercase text-slate-500 dark:text-slate-400 md:hidden'>
                      Step {step.number}
                    </span>
                  </div>

                  {/* Step Card details */}
                  <div className='mt-4 w-full flex-1 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 transition-all duration-300 group-hover:border-slate-700/80 group-hover:bg-slate-900/70 md:mt-0'>
                    <div className='flex items-center justify-between'>
                      <h4 className='font-display text-base font-bold text-white sm:text-lg'>
                        {step.title}
                      </h4>
                      <span className='hidden rounded-md bg-slate-950 px-2 py-0.5 font-mono text-xs font-black text-slate-500 dark:text-slate-400 md:inline-block'>
                        0{step.number} / 09
                      </span>
                    </div>
                    <p className='mt-2 text-xs font-medium leading-relaxed text-slate-400 sm:text-sm'>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Modules breakdown */}
      <section
        id='section-modules'
        className='relative flex w-full items-center justify-center border-t border-slate-900 bg-transparent px-6 py-28'
      >
        <div className='w-full max-w-7xl'>
          <div className='mx-auto mb-16 max-w-2xl text-center'>
            <span className='rounded-full border border-violet-900/30 bg-violet-950/40 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-violet-400'>
              Modules
            </span>
            <h2 className='font-display mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl'>
              Distinct Portal Modules
            </h2>
            <p className='mt-3 text-sm font-medium text-slate-400 sm:text-base'>
              Tailored workspaces engineered with distinct features matching
              user roles.
            </p>
          </div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            {/* Student portal card - Cyan Accent */}
            <div className='group flex flex-col justify-between space-y-6 rounded-3xl border border-slate-800 bg-slate-900/30 p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-500/30 dark:hover:shadow-[0_0_20px_rgba(6,182,212,0.06)]'>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='bg-cyan-955/50 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-900/30 text-cyan-400 transition-colors group-hover:border-cyan-500/40'>
                    <Users className='h-6 w-6' />
                  </div>
                  <span className='bg-cyan-955/50 rounded-full border border-cyan-900/30 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-cyan-400'>
                    Student Portal
                  </span>
                </div>
                <h4 className='font-display text-xl font-bold text-white'>
                  Propose & Collaborate
                </h4>
                <p className='text-xs font-semibold leading-relaxed text-slate-400'>
                  Propose UDP or IDP project titles, invite other students to
                  your team directory, upload slide decks, and coordinate
                  deliverables.
                </p>
              </div>
              <div className='text-slate-450 space-y-2.5 border-t border-slate-800/80 pt-4 text-xs font-bold'>
                <div className='flex items-center gap-2'>
                  <Check className='h-4.5 w-4.5 text-cyan-400' /> Propose
                  UDP/IDP Projects
                </div>
                <div className='flex items-center gap-2'>
                  <Check className='h-4.5 w-4.5 text-cyan-400' /> Upload Reports
                  & Archives
                </div>
                <div className='flex items-center gap-2'>
                  <Check className='h-4.5 w-4.5 text-cyan-400' /> Monitor Guide
                  Feedback
                </div>
              </div>
            </div>

            {/* Faculty portal card - Emerald Accent */}
            <div className='group flex flex-col justify-between space-y-6 rounded-3xl border border-slate-800 bg-slate-900/30 p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/30 dark:hover:shadow-[0_0_20px_rgba(16,185,129,0.06)]'>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='bg-emerald-955/50 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-900/30 text-emerald-400 transition-colors group-hover:border-emerald-500/40'>
                    <ShieldCheck className='h-6 w-6' />
                  </div>
                  <span className='bg-emerald-955/50 rounded-full border border-emerald-900/30 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-400'>
                    Mentor Portal
                  </span>
                </div>
                <h4 className='font-display text-xl font-bold text-white'>
                  Evaluate & Review
                </h4>
                <p className='text-xs font-semibold leading-relaxed text-slate-400'>
                  Evaluate deliverables uploaded by assigned groups, write
                  feedback notes, schedule milestone reviews, and authorize
                  status logs.
                </p>
              </div>
              <div className='text-slate-450 space-y-2.5 border-t border-slate-800/80 pt-4 text-xs font-bold'>
                <div className='flex items-center gap-2'>
                  <Check className='h-4.5 w-4.5 text-emerald-400' /> Evaluate
                  Live Submissions
                </div>
                <div className='flex items-center gap-2'>
                  <Check className='h-4.5 w-4.5 text-emerald-400' /> Log Meeting
                  Minutes
                </div>
                <div className='flex items-center gap-2'>
                  <Check className='h-4.5 w-4.5 text-emerald-400' /> Approve
                  Project Milestone
                </div>
              </div>
            </div>

            {/* Admin portal card - Violet Accent */}
            <div className='group flex flex-col justify-between space-y-6 rounded-3xl border border-slate-800 bg-slate-900/30 p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-500/30 dark:hover:shadow-[0_0_20px_rgba(139,92,246,0.06)]'>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='bg-violet-955/50 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-900/30 text-violet-400 transition-colors group-hover:border-violet-500/40'>
                    <Layers className='h-6 w-6' />
                  </div>
                  <span className='bg-violet-955/50 rounded-full border border-violet-900/30 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-violet-400'>
                    Admin Portal
                  </span>
                </div>
                <h4 className='font-display text-xl font-bold text-white'>
                  Govern & Allocate
                </h4>
                <p className='text-xs font-semibold leading-relaxed text-slate-400'>
                  Coordinate system timelines, manage student and staff
                  accounts, auto-allocate guides to proposals, and verify global
                  audit logs.
                </p>
              </div>
              <div className='text-slate-450 space-y-2.5 border-t border-slate-800/80 pt-4 text-xs font-bold'>
                <div className='flex items-center gap-2'>
                  <Check className='h-4.5 w-4.5 text-violet-400' /> Allocate
                  Faculty Mentors
                </div>
                <div className='flex items-center gap-2'>
                  <Check className='h-4.5 w-4.5 text-violet-400' /> Govern User
                  Permissions
                </div>
                <div className='flex items-center gap-2'>
                  <Check className='h-4.5 w-4.5 text-violet-400' /> Monitor
                  System Audit Logs
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Frequently Asked Questions (Redesigned Category Tabs to segmented-control) */}
      <section
        id='section-faq'
        className='relative flex w-full items-center justify-center border-t border-slate-900 bg-transparent px-6 py-28'
      >
        <div className='w-full max-w-4xl space-y-10 text-left'>
          {/* Header */}
          <div className='mx-auto max-w-2xl text-center'>
            <span className='bg-blue-955/40 rounded-full border border-blue-900/30 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-blue-400'>
              FAQ
            </span>
            <h2 className='font-display mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl'>
              Frequently Asked Questions
            </h2>
            <p className='mt-3 text-sm font-medium text-slate-400 sm:text-base'>
              Got questions? Search our database or browse by category tabs.
            </p>
          </div>

          {/* Interactive Search Bar */}
          <div className='relative mx-auto max-w-lg'>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 dark:text-slate-400'>
              <Search className='h-5 w-5' />
            </div>
            <input
              type='text'
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              placeholder='Search questions or topics...'
              className='theme-input w-full rounded-xl border border-slate-800 bg-slate-900/40 py-3.5 pl-12 pr-4 text-white placeholder-slate-500 shadow-sm outline-none transition-colors focus:border-blue-500'
            />
          </div>

          {/* Segmented-control style category tabs (No bright/saturated blue highlights) */}
          <div className='mx-auto flex max-w-lg flex-wrap justify-center gap-2.5 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-1.5'>
            {[
              { id: 'all', label: 'Show All' },
              { id: 'general', label: 'General Info' },
              { id: 'students', label: 'For Students' },
              { id: 'faculty', label: 'For Faculty & Guide' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFaqCategory(cat.id)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 ${
                  faqCategory === cat.id
                    ? 'border border-indigo-500/35 bg-indigo-500/20 text-indigo-300 shadow-sm'
                    : 'border border-transparent bg-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Polished FAQ Accordions (using a lighter card background shade for contrast, space-y-5, rounded-3xl) */}
          <div className='space-y-5'>
            <AnimatePresence>
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => {
                  const isOpen = openFaq === faq.q;
                  return (
                    <div
                      key={faq.q}
                      className={`overflow-hidden rounded-3xl border shadow-md transition-all duration-300 ${
                        isOpen
                          ? 'border-indigo-500/25 bg-slate-900/80'
                          : 'border-slate-800/70 bg-slate-900/50 hover:border-slate-700/60'
                      }`}
                    >
                      <button
                        onClick={() => toggleFaq(faq.q)}
                        className='py-5.5 hover:bg-slate-855/10 font-display flex w-full items-center justify-between px-6 text-left text-sm font-bold text-slate-200 transition-colors sm:text-base'
                      >
                        <span className='pr-4'>{faq.q}</span>
                        {/* Enclosed Chevron Indicator with clean circular wrapper */}
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-300 ${
                            isOpen
                              ? 'border-indigo-550/30 bg-indigo-950/20 text-indigo-400'
                              : 'border-slate-800 bg-slate-950/50 text-slate-400'
                          }`}
                        >
                          {isOpen ? (
                            <ChevronUp className='h-4 w-4' />
                          ) : (
                            <ChevronDown className='h-4 w-4' />
                          )}
                        </div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.25 }}
                            className='overflow-hidden'
                          >
                            <div className='border-t border-slate-800/50 px-6 pb-6 pt-2.5 text-xs font-medium leading-relaxed text-slate-400 sm:text-sm'>
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              ) : (
                <div className='py-10 text-center text-sm font-semibold text-slate-500 dark:text-slate-400'>
                  No FAQ topics matching your query were found.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='relative z-10 border-t border-slate-900/60 bg-slate-950/40 px-6 py-20 text-white backdrop-blur-sm'>
        <div className='mx-auto grid max-w-7xl grid-cols-1 gap-12 border-b border-slate-900/60 pb-16 md:grid-cols-12'>
          {/* Column 1 - Brand & Stats */}
          <div className='space-y-6 md:col-span-6'>
            <div className='flex items-center space-x-3'>
              <div className='from-blue-650 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr to-indigo-600 shadow-md shadow-indigo-500/20'>
                <GraduationCap className='h-5.5 w-5.5 text-white' />
              </div>
              <span className='font-display bg-gradient-to-r from-white to-slate-300 bg-clip-text text-xl font-extrabold tracking-tight text-transparent'>
                Student Project
              </span>
            </div>

            <p className='max-w-sm text-xs font-medium leading-relaxed text-slate-400'>
              A state-of-the-art academic workspace engineered to manage team
              collaborations, upload project documentations, track guides, and
              evaluate deliverables cleanly.
            </p>

            {/* Platform Stats */}
            <div className='grid max-w-sm grid-cols-3 gap-4 pt-2'>
              <div className='border-l-2 border-cyan-500/80 pl-3'>
                <div className='font-mono text-base font-black text-white'>
                  10k+
                </div>
                <div className='text-[10px] font-extrabold uppercase tracking-wide text-slate-400'>
                  Students
                </div>
              </div>
              <div className='border-l-2 border-indigo-500/80 pl-3'>
                <div className='font-mono text-base font-black text-white'>
                  500+
                </div>
                <div className='text-[10px] font-extrabold uppercase tracking-wide text-slate-400'>
                  Faculty
                </div>
              </div>
              <div className='border-l-2 border-purple-500/80 pl-3'>
                <div className='font-mono text-base font-black text-white'>
                  1,200+
                </div>
                <div className='text-[10px] font-extrabold uppercase tracking-wide text-slate-400'>
                  Projects
                </div>
              </div>
            </div>
          </div>

          {/* Column 2 - Links */}
          <div className='space-y-4 md:col-span-3'>
            <h4 className='text-xs font-black uppercase tracking-widest text-indigo-400'>
              Platform
            </h4>
            <div className='text-slate-350 flex flex-col space-y-3 text-xs font-bold'>
              <a
                href='#section-about'
                className='flex items-center gap-1.5 transition-all duration-200 hover:translate-x-1 hover:text-indigo-400'
              >
                <ChevronRight className='h-3 w-3 text-slate-700 dark:text-slate-200' />
                About System
              </a>
              <a
                href='#section-features'
                className='flex items-center gap-1.5 transition-all duration-200 hover:translate-x-1 hover:text-indigo-400'
              >
                <ChevronRight className='h-3 w-3 text-slate-700 dark:text-slate-200' />
                System Features
              </a>
              <a
                href='#section-operational'
                className='flex items-center gap-1.5 transition-all duration-200 hover:translate-x-1 hover:text-indigo-400'
              >
                <ChevronRight className='h-3 w-3 text-slate-700 dark:text-slate-200' />
                Operational Process
              </a>
              <Link
                to='/login'
                className='flex items-center gap-1.5 transition-all duration-200 hover:translate-x-1 hover:text-indigo-400'
              >
                <ChevronRight className='h-3 w-3 text-slate-700 dark:text-slate-200' />
                Sign In Portal
              </Link>
            </div>
          </div>

          {/* Column 3 - Contact & Support */}
          <div className='space-y-4 md:col-span-3'>
            <h4 className='text-xs font-black uppercase tracking-widest text-purple-400'>
              Support
            </h4>
            <div className='text-slate-350 space-y-3.5 text-xs font-bold'>
              <div className='group/email flex items-center space-x-2.5'>
                <Mail className='text-slate-450 h-4 w-4 flex-shrink-0 transition-colors group-hover/email:text-indigo-400' />
                <a
                  href={`mailto:${CONTACT_INFO.EMAIL}`}
                  className='decoration-indigo-400/30 transition-colors duration-200 hover:text-indigo-400 hover:underline'
                >
                  {CONTACT_INFO.EMAIL}
                </a>
              </div>
              <div className='flex items-center space-x-2.5'>
                <Phone className='text-slate-450 h-4 w-4 flex-shrink-0' />
                <span>{CONTACT_INFO.PHONE}</span>
              </div>
              <div className='flex items-center space-x-2.5'>
                <MapPin className='text-slate-450 h-4 w-4 flex-shrink-0' />
                <span>{CONTACT_INFO.ADDRESS}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom bar */}
        <div className='mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-6 border-t border-slate-900 pt-8 text-xs font-semibold text-slate-400 sm:flex-row'>
          <div>
            © {new Date().getFullYear()} Student Project System. All rights
            reserved.
          </div>

          {/* Social Links */}
          <div className='flex items-center space-x-4'>
            <a
              href={CONTACT_INFO.SOCIALS.TWITTER}
              target='_blank'
              rel='noopener noreferrer'
              className='rounded-xl bg-slate-900 p-2.5 shadow-md transition-all hover:bg-indigo-600 hover:text-white active:scale-95'
              aria-label='Twitter Profile'
            >
              <Twitter className='h-4 w-4' />
            </a>
            <a
              href={CONTACT_INFO.SOCIALS.LINKEDIN}
              target='_blank'
              rel='noopener noreferrer'
              className='rounded-xl bg-slate-900 p-2.5 shadow-md transition-all hover:bg-indigo-600 hover:text-white active:scale-95'
              aria-label='LinkedIn Profile'
            >
              <Linkedin className='h-4 w-4' />
            </a>
            <a
              href={CONTACT_INFO.SOCIALS.GITHUB}
              target='_blank'
              rel='noopener noreferrer'
              className='hover:bg-indigo-650 rounded-xl bg-slate-900 p-2.5 shadow-md transition-all hover:text-white active:scale-95'
              aria-label='GitHub Profile'
            >
              <Github className='h-4 w-4' />
            </a>
          </div>

          <div className='text-slate-450 flex space-x-4'>
            <Link to='#' className='transition-colors hover:text-white'>
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to='#' className='transition-colors hover:text-white'>
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
});

Landing.displayName = 'Landing';

export default Landing;
