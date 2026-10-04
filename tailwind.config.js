/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './app/**/*.{js,vue,ts}',
    './error.vue'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        ibm: ['"IBM Plex Sans Arabic"', 'sans-serif'],
        readex: ['"Readex Pro"', 'sans-serif'],
        almarai: ['"Almarai"', 'sans-serif'],
        cairo: ['"Cairo"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
