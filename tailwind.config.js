/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}", "./src/api/characters/characters.json"],
  theme: {
    fontFamily: {
      sans: ["Helvetica Neue"],
    },
    extend: {
      keyframes: {
        slideFromLeft: {
          "0%": { transform: "translateX(-100%);" },
          "100%": { transform: "translateX(0);" },
        },
      },
      animation: {
        "slide-from-left": "1s ease-out 0s 1 slideFromLeft",
      },
    },
  },
  plugins: [],
};
