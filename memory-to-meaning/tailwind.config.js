export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        sans: ["DM Sans", "sans-serif"],
      },
      colors: {
        ink: {
          50:  "#F5F3EE",
          100: "#E8E4D9",
          200: "#C9C3B0",
          300: "#ABA898",
          400: "#8A8272",
          500: "#6A6355",
          600: "#4A4438",
          700: "#342F26",
          800: "#1E1A14",
          900: "#100E0A",
        },
        amber: {
          300: "#F4C775",
          400: "#EF9F27",
          500: "#BA7517",
          600: "#854F0B",
        },
        teal: {
          300: "#5DCAA5",
          400: "#1D9E75",
          500: "#0F6E56",
        },
        coral: {
          300: "#F0997B",
          400: "#D85A30",
          500: "#993C1D",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        pulse: "pulse 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
