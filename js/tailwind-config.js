// tailwind-config.js
// It's Wesus – Portal do Investidor
// Extend Tailwind with brand tokens BEFORE the CDN script runs

window.tailwind = window.tailwind || {};
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        wesus: "#0B1F3A",
        "wesus-90": "rgba(11,31,58,0.90)",
        gold: "#C5A059",
        "gold-light": "#E8D08D",
        "gold-dim": "rgba(197,160,89,0.15)",
      },
      fontFamily: {
        playfair: ['"Playfair Display"', "Georgia", "serif"],
        inter: ["Inter", "system-ui", "sans-serif"],
      },
      backdropBlur: {
        xs: "4px",
      },
    },
  },
};
