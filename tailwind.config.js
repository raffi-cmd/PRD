/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#040508',
        surface: {
          50: '#1a1d26',
          100: '#14161f',
          200: '#0e1017',
          300: '#090a0f',
          400: '#06070a',
          500: '#020408'
        },
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(16, 185, 129, 0.15)',
        'glow-md': '0 0 20px rgba(16, 185, 129, 0.20)',
        'glow-lg': '0 0 30px rgba(16, 185, 129, 0.25)',
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.4), 0 1px 3px 1px rgba(0, 0, 0, 0.2)'
      }
    },
  },
  plugins: [],
}
