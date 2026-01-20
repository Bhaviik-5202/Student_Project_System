/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",

  theme: {
    extend: {
      // Color palette optimized for dashboard UI
      colors: {
        // Primary brand colors
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          DEFAULT: "#3b82f6",
        },

        // Secondary/neutral colors
        secondary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          DEFAULT: "#64748b",
        },

        // Semantic colors for dashboard
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          DEFAULT: "#22c55e",
        },

        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          DEFAULT: "#f59e0b",
        },

        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          DEFAULT: "#ef4444",
        },

        info: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          DEFAULT: "#0ea5e9",
        },

        // Dashboard specific colors
        dashboard: {
          background: "#f8fafc",
          card: "#ffffff",
          sidebar: "#1e293b",
          sidebarHover: "#334155",
          header: "#ffffff",
          border: "#e2e8f0",
          text: "#0f172a",
          textLight: "#64748b",
        },
      },

      // Typography
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        heading: ["Inter", "system-ui", "sans-serif"],
      },

      fontSize: {
        xxs: "0.625rem", // 10px
        xs: "0.75rem", // 12px
        sm: "0.875rem", // 14px
        base: "1rem", // 16px
        lg: "1.125rem", // 18px
        xl: "1.25rem", // 20px
        "2xl": "1.5rem", // 24px
        "3xl": "1.875rem", // 30px
        "4xl": "2.25rem", // 36px
        "5xl": "3rem", // 48px
      },

      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
      },

      // Layout & Spacing
      spacing: {
        18: "4.5rem",
        72: "18rem",
        84: "21rem",
        96: "24rem",
        128: "32rem",
        144: "36rem",
        160: "40rem",
      },

      // Border Radius
      borderRadius: {
        none: "0",
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
        full: "9999px",
      },

      // Shadows for depth
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
        soft: "0 10px 40px -10px rgba(0, 0, 0, 0.1)",
        medium: "0 20px 60px -15px rgba(0, 0, 0, 0.15)",
        hard: "0 25px 80px -20px rgba(0, 0, 0, 0.25)",
        "glow-primary": "0 0 20px rgba(59, 130, 246, 0.3)",
        "glow-success": "0 0 20px rgba(34, 197, 94, 0.3)",
        "glow-warning": "0 0 20px rgba(245, 158, 11, 0.3)",
        "glow-error": "0 0 20px rgba(239, 68, 68, 0.3)",
        card: "0 2px 8px rgba(0, 0, 0, 0.08)",
        "card-hover": "0 8px 24px rgba(0, 0, 0, 0.12)",
        sidebar: "2px 0 8px rgba(0, 0, 0, 0.08)",
      },

      // Animations for dashboard interactions
      animation: {
        // Basic
        "fade-in": "fadeIn 0.3s ease-in-out",
        "fade-out": "fadeOut 0.3s ease-in-out",
        "fade-in-up": "fadeInUp 0.4s ease-out",
        "fade-in-down": "fadeInDown 0.4s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "slide-in-left": "slideInLeft 0.4s ease-out",
        "slide-in-right": "slideInRight 0.4s ease-out",

        // Interactive
        "scale-up": "scaleUp 0.2s ease-out",
        "scale-down": "scaleDown 0.2s ease-out",
        "bounce-once": "bounce 0.5s ease-out",
        "spin-slow": "spin 3s linear infinite",

        // Dashboard specific
        "pulse-slow": "pulseSlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        progress: "progress 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        "subtle-float": "subtleFloat 3s ease-in-out infinite",

        // Status
        "success-pulse": "successPulse 2s ease-in-out infinite",
        "warning-pulse": "warningPulse 2s ease-in-out infinite",
        "error-shake": "errorShake 0.5s ease-in-out",

        // Loading
        "spin-slow": "spin 3s linear infinite",
        "ping-slow": "pingSlow 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
      },

      keyframes: {
        // Basic
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },

        // Interactive
        scaleUp: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.05)" },
        },
        scaleDown: {
          "0%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-25%)" },
        },

        // Dashboard specific
        pulseSlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        progress: {
          "0%": { width: "0%" },
          "50%": { width: "100%" },
          "100%": { width: "0%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        subtleFloat: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },

        // Status
        successPulse: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(34, 197, 94, 0.5)" },
          "50%": { boxShadow: "0 0 0 8px rgba(34, 197, 94, 0)" },
        },
        warningPulse: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(245, 158, 11, 0.5)" },
          "50%": { boxShadow: "0 0 0 8px rgba(245, 158, 11, 0)" },
        },
        errorShake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
        },

        // Loading
        spin: {
          to: { transform: "rotate(360deg)" },
        },
        pingSlow: {
          "75%, 100%": { transform: "scale(1.5)", opacity: "0" },
        },
      },

      // Custom grid templates for dashboard layouts
      gridTemplateColumns: {
        dashboard: "280px 1fr",
        "dashboard-sm": "240px 1fr",
        "dashboard-lg": "320px 1fr",
        stats: "repeat(auto-fit, minmax(250px, 1fr))",
        "quick-actions": "repeat(auto-fit, minmax(200px, 1fr))",
        cards: "repeat(auto-fill, minmax(300px, 1fr))",
      },

      gridTemplateRows: {
        dashboard: "auto 1fr auto",
        "sidebar-content": "auto 1fr auto",
      },

      // Custom transitions
      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        snappy: "cubic-bezier(0.16, 1, 0.3, 1)",
      },

      transitionDuration: {
        250: "250ms",
        350: "350ms",
        450: "450ms",
        600: "600ms",
        750: "750ms",
        1000: "1000ms",
      },

      // Custom aspect ratios for dashboard components
      aspectRatio: {
        card: "4/3",
        stat: "3/2",
        wide: "16/9",
        square: "1/1",
      },

      // Custom container settings
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1536px",
        },
      },

      // Custom z-index for layering
      zIndex: {
        dropdown: 1000,
        sticky: 1020,
        fixed: 1030,
        "modal-backdrop": 1040,
        modal: 1050,
        popover: 1060,
        tooltip: 1070,
        toast: 1080,
        sidebar: 1100,
        header: 1200,
        overlay: 1300,
      },

      // Custom backdrop blur
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },

      // Custom gradient backgrounds
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
        "gradient-success": "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
        "gradient-warning": "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
        "gradient-error": "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
        "gradient-sidebar": "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
        "gradient-card": "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
      },
    },
  },

  // Plugins
  plugins: [
    require("@tailwindcss/forms"), // Better form styling
    require("@tailwindcss/typography"), // Typography utilities
    require("@tailwindcss/aspect-ratio"), // Aspect ratio utilities

    // Custom plugin for animation utilities
    function ({ addUtilities, theme }) {
      const delays = {
        100: "100ms",
        200: "200ms",
        300: "300ms",
        400: "400ms",
        500: "500ms",
        600: "600ms",
        700: "700ms",
        800: "800ms",
        900: "900ms",
        1000: "1000ms",
      };

      const durations = {
        fast: "150ms",
        normal: "300ms",
        slow: "500ms",
        slower: "1000ms",
        slowest: "2000ms",
      };

      const newUtilities = {};

      // Add animation-delay utilities
      Object.entries(delays).forEach(([key, value]) => {
        newUtilities[`.animation-delay-${key}`] = {
          "animation-delay": value,
        };
      });

      // Add animation-duration utilities
      Object.entries(durations).forEach(([key, value]) => {
        newUtilities[`.animation-duration-${key}`] = {
          "animation-duration": value,
        };
      });

      // Add custom transition utilities
      newUtilities[".transition-all-smooth"] = {
        "transition-property": "all",
        "transition-timing-function": "cubic-bezier(0.4, 0, 0.2, 1)",
        "transition-duration": "300ms",
      };

      newUtilities[".transition-transform-smooth"] = {
        "transition-property": "transform",
        "transition-timing-function": "cubic-bezier(0.4, 0, 0.2, 1)",
        "transition-duration": "300ms",
      };

      addUtilities(newUtilities);
    },
  ],

  // Safelist for dynamic classes
  safelist: [
    {
      pattern:
        /bg-(primary|secondary|success|warning|error|info)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern:
        /text-(primary|secondary|success|warning|error|info)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern:
        /border-(primary|secondary|success|warning|error|info)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /grid-cols-(dashboard|stats|quick-actions|cards)/,
    },
    {
      pattern: /animate-(fade-in|fade-out|slide-up|slide-down)/,
    },
  ],
};
