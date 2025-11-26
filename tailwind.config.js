/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // این یعنی هرجا کلاس font-sans بدی، از وزیر استفاده میکنه
        sans: ['Vazirmatn', 'Inter', 'system-ui', 'sans-serif'], 
      },
    },
  },
  plugins: [],
}