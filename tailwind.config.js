/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        obsidian: {
          950: '#07070b',
          900: '#0d0d14',
          850: '#13131f',
          800: '#191928',
          700: '#25253b',
        },
        cyber: {
          purple: '#8b5cf6',
          violet: '#a855f7',
          fuchsia: '#d946ef',
          indigo: '#6366f1',
        }
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(139, 92, 246, 0.35)',
        'glow-lg': '0 10px 40px -10px rgba(168, 85, 247, 0.5)',
        'card-drag': '0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 25px 2px rgba(139, 92, 246, 0.4)',
      }
    },
  },
  plugins: [],
}
