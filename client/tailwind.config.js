/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Warm antique-gold scale used for text, borders & accents
        gold: {
          50: "#fdf8ec",
          100: "#f8ecc9",
          200: "#f0d896",
          300: "#e5bf5e",
          400: "#d9a83c",
          500: "#c8912a",
          600: "#a97220",
          700: "#8a591e",
          800: "#6f471e",
          900: "#5c3b1d",
        },
        // Deep royal browns replacing plain black for a warmer luxury feel
        brown: {
          50: "#f7f1ea",
          100: "#e9dbc9",
          200: "#cdb08a",
          300: "#a9825b",
          400: "#7d5c3d",
          500: "#5c4229",
          600: "#432f1d",
          700: "#332415",
          800: "#241a0f",
          900: "#170f09",
          950: "#0d0805",
        },
      },
      fontFamily: {
        // Single royal serif used everywhere for text (headings, labels)
        display: ["'Cinzel'", "'Playfair Display'", "serif"],
        body: ["'Cormorant Garamond'", "serif"],
        // Bold modern sans-serif used ONLY for price numbers —
        // cleaner, more legible digits than the serif everywhere else
        price: ["'Poppins'", "sans-serif"],
      },
      boxShadow: {
        premium: "0 25px 60px -15px rgba(0,0,0,0.7), 0 0 0 1px rgba(200,145,42,0.2)",
        "inner-gold": "inset 0 0 0 1px rgba(217,168,60,0.35)",
      },
      keyframes: {
        "flash-green": {
          "0%": { backgroundColor: "rgba(34,197,94,0.35)" },
          "100%": { backgroundColor: "transparent" },
        },
        "flash-red": {
          "0%": { backgroundColor: "rgba(239,68,68,0.35)" },
          "100%": { backgroundColor: "transparent" },
        },
        shine: {
          "0%": { transform: "translateX(-150%) skewX(-20deg)" },
          "100%": { transform: "translateX(150%) skewX(-20deg)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "flash-green": "flash-green 600ms ease-out",
        "flash-red": "flash-red 600ms ease-out",
        shine: "shine 3.5s ease-in-out infinite",
        "spin-slow": "spin-slow 60s linear infinite",
      },
    },
  },
  plugins: [],
};