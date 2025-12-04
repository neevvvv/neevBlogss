/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-orange':'#F97316',
        'bright-yellow':'#FACC15',
        'soft-cream':'#FFF7E8',
        'Dark-Brown' :'#6D4534',
        'Dark-Brown2' : '#8C6A56',

      },
    },
  },
  plugins: [],
}

