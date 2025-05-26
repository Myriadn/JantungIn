/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // Warna biru Tailwind
        secondary: '#60A5FA',
      },
    },
  },
  plugins: [],
  safelist: [
    'group-hover:opacity-10',
    'group-hover:opacity-100',
    'group-hover:scale-x-100',
    'bg-blue-700',
  ],
}
