/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./src/api/characters/characters.json",
  ],
  theme: {
    fontFamily: {
      'sans': ['Verdana']
    },
    extend: {}
  },
  plugins: [],
}
