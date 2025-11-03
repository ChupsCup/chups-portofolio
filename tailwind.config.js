/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cream-50': '#F9F6F0',
        'cream-100': '#F4EFE6',
        'cream-200': '#EDE5D9',
        'cream-300': '#E6DDCC',
        'cream-400': '#DFD5BF',
        'brown-light': '#9D8B7E',
        'brown-mid': '#7A6B5F',
        'brown-dark': '#523d2d',
        'brown-darker': '#3D2E23',
        // Align accent to site cobalt
        'accent': '#5C6CFF',
        'accent-dark': '#4656E6',
        'accent-light': '#7D8BFF',
      },
      animation: {
        blob: 'blob 7s infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}

