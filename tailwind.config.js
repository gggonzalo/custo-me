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
          from: { transform: "translateX(-100%);" },
          to: { transform: "translateX(0);" },
        },
        waitFadeIn: {
          from: { opacity: 0 },
          to: { opacity: 0 },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      animation: {
        "slide-from-left": "1s ease-out 0s 1 slideFromLeft",
        "fade-in": "fadeIn 1s ease-out 0s",
        "wait-then-fade-in": "waitFadeIn 1s ease-out 0s, fadeIn 1s ease-out 1s",
      },
    },
  },
  plugins: [],
};
