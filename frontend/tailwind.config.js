
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in-right': {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(249,115,22,0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(249,115,22,0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(60px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'wave': {
          '0%': { transform: 'scaleX(1)' },
          '50%': { transform: 'scaleX(1.05)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 1s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'fade-in-up-1': 'fade-in-up 0.8s ease-out 0.15s forwards',
        'fade-in-up-2': 'fade-in-up 0.8s ease-out 0.3s forwards',
        'fade-in-up-3': 'fade-in-up 0.8s ease-out 0.45s forwards',
        'fade-in-up-4': 'fade-in-up 0.8s ease-out 0.6s forwards',
        'fade-in-left': 'fade-in-left 0.9s ease-out forwards',
        'fade-in-right': 'fade-in-right 0.9s ease-out forwards',
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-fast': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'scale-in': 'scale-in 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'spin-slow': 'spin-slow 12s linear infinite',
        'wave': 'wave 3s ease-in-out infinite',
      },
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        accent: {
          50: '#fff5f0',
          100: '#ffecd9',
          200: '#ffd3b3',
          300: '#ffb380',
          400: '#ff8c40',
          500: '#f97316',
          600: '#e65100',
          700: '#b34000',
          800: '#8c3300',
          900: '#662600',
          950: '#3d1700',
        },
        sand: {
          50: '#fdfbf7',
          100: '#fdf6e3',
          200: '#f5e6ce',
          300: '#e6cda3',
          400: '#d4b480',
          500: '#b8945a',
          600: '#9c7743',
          700: '#7a5b33',
          800: '#5c4426',
          900: '#402e1b',
          950: '#21180e',
        },
        dark: {
          bg: '#0f172a',
          card: '#1e293b',
          border: '#334155',
        }
      },
    },
  },
  plugins: [],
}
