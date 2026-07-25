/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glass: {
          bg: 'rgba(22, 26, 36, 0.65)',
          border: 'rgba(255, 255, 255, 0.12)',
          card: 'rgba(30, 36, 50, 0.55)',
          hover: 'rgba(255, 255, 255, 0.08)',
          active: 'rgba(59, 130, 246, 0.2)',
        },
        pulse: {
          blue: '#3b82f6',
          cyan: '#06b6d4',
          green: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      backdropBlur: {
        '2xl': '28px',
        '3xl': '40px',
      },
      boxShadow: {
        'glass-glow': '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
        'cyan-glow': '0 0 20px rgba(6, 182, 212, 0.4)',
        'blue-glow': '0 0 25px rgba(59, 130, 246, 0.5)',
      }
    },
  },
  plugins: [],
}
