/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#3275e7',
          dark: '#2a62c7',
          light: '#4286f5',
          bg: '#4178f6'
        }
      },
    },
  },
  plugins: [],
}
