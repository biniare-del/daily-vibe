/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        vibe: {
          50: '#f5f3ff',
          100: '#ede9fe',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          900: '#2e1065'
        },
        gold: {
          300: '#fde68a',
          400: '#fbbf24',
          500: '#f59e0b'
        },
        ink: {
          950: '#0a0a12',
          900: '#101018'
        }
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(139, 92, 246, 0.45)',
        goldGlow: '0 0 32px -6px rgba(245, 158, 11, 0.4)',
        card: '0 12px 40px -16px rgba(0, 0, 0, 0.65)'
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(3%, -4%) scale(1.08)' }
        },
        driftSlow: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-4%, 3%) scale(1.05)' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        shimmer: {
          '0%': { transform: 'translateX(-150%)' },
          '100%': { transform: 'translateX(150%)' }
        },
        countPulse: {
          '0%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' }
        }
      },
      animation: {
        drift: 'drift 14s ease-in-out infinite',
        driftSlow: 'driftSlow 18s ease-in-out infinite',
        fadeInUp: 'fadeInUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both',
        shimmer: 'shimmer 2.8s ease-in-out infinite',
        countPulse: 'countPulse 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both'
      }
    }
  },
  plugins: []
}
