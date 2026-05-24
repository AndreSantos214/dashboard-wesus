/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        wesus: "#0b1f3a",
        "wesus-dark": "#071326",
        gold: "#c5a059",
        "gold-light": "#e8d08d",
      },
    },
  },
  plugins: [],
};
