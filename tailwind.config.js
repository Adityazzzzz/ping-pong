/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#05070d',
          900: '#090d16',
          850: '#0e1422',
          800: '#141c2e',
          700: '#1e293b',
        },
        neon: {
          emerald: '#10b981',
          cyan: '#06b6d4',
          violet: '#8b5cf6',
          rose: '#f43f5e',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.25)',
        'glow-emerald': '0 0 25px rgba(16, 185, 129, 0.25)',
        'glow-violet': '0 0 25px rgba(139, 92, 246, 0.25)',
        'card-obsidian': '0 20px 40px -15px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}
