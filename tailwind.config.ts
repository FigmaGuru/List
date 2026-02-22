import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50:  '#f0fbfa',
          100: '#ccf2ef',
          200: '#9de5df',
          300: '#6dd1c9',
          400: '#45bab1',
          500: '#30a49b',
          600: '#27857e',
          700: '#226b66',
          800: '#1f5652',
          900: '#1e4845',
        },
        primary: {
          DEFAULT: '#0f766e',
          foreground: '#ffffff',
        },
        background: '#f9fafb',
        surface: '#ffffff',
        muted: '#f3f4f6',
        'muted-foreground': '#9ca3af',
        border: '#e5e7eb',
        ring: '#0f766e',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'SF Pro Text',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 12px 0 rgba(0,0,0,0.06)',
        'card': '0 1px 4px 0 rgba(0,0,0,0.05), 0 4px 16px 0 rgba(0,0,0,0.06)',
        'fab': '0 4px 20px 0 rgba(15,118,110,0.35)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },
    },
  },
  plugins: [animate],
}

export default config
