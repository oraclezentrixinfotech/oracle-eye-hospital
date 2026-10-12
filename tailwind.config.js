/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A2A33",
        iris: { DEFAULT: "#137C8B", dark: "#0E5F6B", light: "#CFE7EA" },
        mist: "#EAF4F5",
        cornea: "#FBFDFD",
        sun: { DEFAULT: "#E8A33D", dark: "#C98618" },
      },
      fontFamily: {
        display: ["'Fraunces Variable'", "Georgia", "serif"],
        sans: ["'Plus Jakarta Sans Variable'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
