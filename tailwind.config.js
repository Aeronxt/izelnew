/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
    content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'green': 'rgba(0, 255, 102, 1)',
        'strand': {
          'red': '#E91E63',
          'black': '#000000',
          'white': '#FFFFFF',
          'gray': {
            100: '#F5F5F5',
            200: '#E0E0E0',
            300: '#BDBDBD',
            400: '#9E9E9E',
            500: '#757575',
            600: '#616161',
            700: '#424242',
            800: '#212121',
            900: '#121212'
          }
        }
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'amiri': ['Amiri', 'serif'],
        'noto': ['Noto Sans Arabic', 'sans-serif'],
        'sans': ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      screens: {
        'xs': '475px',
      },
      boxShadow: {
        'strand': '0 2px 4px rgba(0,0,0,0.1)',
        'strand-lg': '0 4px 8px rgba(0,0,0,0.15)',
      }
    }
  },
  plugins: [],
}

