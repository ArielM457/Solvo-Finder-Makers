/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#119DA4',
        secondary: '#0C7489',
        dark: '#13505B',
        bg: '#040404',
        surface: '#111111',
        border: '#1a1a1a',
        muted: '#D7D9CE',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(17,157,164,0.24), 0 20px 45px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
}
