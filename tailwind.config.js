/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5', // Indigo-600
          hover: '#4338CA'  // Indigo-700
        },
        secondary: {
          DEFAULT: '#6366F1', // Indigo-500
          hover: '#4F46E5'  // Indigo-600
        },
        background: {
          DEFAULT: 'var(--background)',
          secondary: 'var(--background-secondary)',
        },
        foreground: {
          DEFAULT: 'var(--foreground)',
          secondary: 'var(--foreground-secondary)',
        }
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        }
      },
      animation: {
        float: "float 3s ease-in-out infinite"
      },
      zIndex: {
        header: '50',
        'mobile-nav': '100',
        modal: '200',
        toast: '300',
        tooltip: '400',
        dropdown: '50',
        overlay: '150'
      }
    },
  },
  plugins: [],
};