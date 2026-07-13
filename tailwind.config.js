/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#2C1B38',
        plum: '#4B2E63',
        coral: {
          DEFAULT: '#FF6A5D',
          pressed: '#F0533F',
        },
        amber: '#FFB23E',
        green: '#25BE86',
        paper: '#FBF4EF',
        surface: '#FFFBF7',
        hairline: '#EFE3DB',
        muted: '#8C7E8B',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Hanken Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        soft: '0 6px 20px -6px rgba(44, 27, 56, 0.14)',
        card: '0 2px 12px -4px rgba(44, 27, 56, 0.10)',
        lift: '0 12px 32px -10px rgba(44, 27, 56, 0.22)',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.015)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'translateY(6px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        breathe: 'breathe 4.5s ease-in-out infinite',
        'pop-in': 'pop-in 0.28s ease-out both',
        'slide-up': 'slide-up 0.32s ease-out both',
        'toast-in': 'toast-in 0.24s ease-out both',
      },
    },
  },
  plugins: [],
}
