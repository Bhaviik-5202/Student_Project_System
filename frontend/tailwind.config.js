/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
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
        },
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
        },
        // Additional colors for better UI
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
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        // Basic animations
        "fade-in": "fadeIn 0.5s ease-in-out",
        "fade-out": "fadeOut 0.5s ease-in-out",
        "fade-in-up": "fadeInUp 0.5s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "slide-in-left": "slideInLeft 0.6s ease-out",
        "slide-in-right": "slideInRight 0.6s ease-out",

        // Login page specific
        "subtle-float": "subtleFloat 3s ease-in-out infinite",
        "bounce-slow": "bounceSlow 2s ease-in-out infinite",
        "soft-rotate": "softRotate 20s linear infinite",
        orbit: "orbit 3s linear infinite",
        progress: "progress 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",

        // Loading animations
        "spin-slow": "spin 3s linear infinite",
        "ping-slow": "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",

        // Interactive animations
        "bounce-once": "bounce 0.5s ease-out",
        "scale-up": "scaleUp 0.2s ease-out",
        "scale-down": "scaleDown 0.2s ease-out",
        shake: "shake 0.5s ease-in-out",

        // Success/error states
        "success-pulse": "successPulse 2s ease-in-out infinite",
        "error-shake": "errorShake 0.5s ease-in-out",
      },
      keyframes: {
        // Basic animations
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
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

        // Login page specific
        subtleFloat: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        bounceSlow: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        softRotate: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg) translateX(40px) rotate(0deg)" },
          "100%": {
            transform: "rotate(360deg) translateX(40px) rotate(-360deg)",
          },
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

        // Interactive animations
        scaleUp: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.05)" },
        },
        scaleDown: {
          "0%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
        },

        // Success/error states
        successPulse: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(34, 197, 94, 0.5)" },
          "50%": { boxShadow: "0 0 0 10px rgba(34, 197, 94, 0)" },
        },
        errorShake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
        },

        // Loading animations (Tailwind defaults extended)
        spin: {
          to: { transform: "rotate(360deg)" },
        },
        ping: {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-25%)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".5" },
        },
      },
      // Animation delays
      animationDelay: {
        100: "100ms",
        150: "150ms",
        200: "200ms",
        300: "300ms",
        400: "400ms",
        500: "500ms",
        600: "600ms",
        700: "700ms",
        800: "800ms",
        900: "900ms",
        1000: "1000ms",
      },
      // Animation durations
      animationDuration: {
        fast: "150ms",
        normal: "300ms",
        slow: "500ms",
        slower: "1000ms",
        slowest: "2000s",
      },
      // Custom box shadows
      boxShadow: {
        soft: "0 10px 40px -10px rgba(0, 0, 0, 0.1)",
        medium: "0 20px 60px -15px rgba(0, 0, 0, 0.15)",
        hard: "0 25px 80px -20px rgba(0, 0, 0, 0.25)",
        "inner-soft": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
        "glow-primary": "0 0 20px rgba(59, 130, 246, 0.3)",
        "glow-success": "0 0 20px rgba(34, 197, 94, 0.3)",
      },
      // Custom border radius
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      // Custom spacing
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
        144: "36rem",
      },
      // Backdrop blur
      backdropBlur: {
        xs: "2px",
      },
      // Gradient configurations
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      // Custom transitions
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
        transform: "transform",
      },
      // Custom z-index
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },
    },
  },
  plugins: [
    // Plugin for animation delays and durations
    function ({ addUtilities, theme }) {
      const delays = theme("animationDelay");
      const durations = theme("animationDuration");
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

      addUtilities(newUtilities);
    },
  ],
  // Variants
  variants: {
    extend: {
      animation: ["responsive", "motion-safe", "motion-reduce", "hover"],
      transform: ["responsive", "hover", "focus"],
      scale: ["responsive", "hover", "focus", "active"],
      opacity: ["responsive", "hover", "focus", "disabled"],
      backgroundColor: ["responsive", "hover", "focus", "active", "disabled"],
      borderColor: ["responsive", "hover", "focus", "active"],
      textColor: ["responsive", "hover", "focus", "disabled"],
    },
  },
  // Dark mode
  darkMode: "class", // or 'media'
};

// // Add to your tailwind.config.js
// module.exports = {
//   theme: {
//     extend: {
//       animation: {
//         "fade-in": "fadeIn 0.5s ease-in-out",
//         "bounce-slow": "bounce 2s infinite",
//       },
//       keyframes: {
//         fadeIn: {
//           "0%": { opacity: "0", transform: "translateY(10px)" },
//           "100%": { opacity: "1", transform: "translateY(0)" },
//         },
//       },
//     },
//   },
// };
