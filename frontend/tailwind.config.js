/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7C3AED", // purple accent used across SkillSync UI
          dark: "#5B21B6",
        },
        dark: "#0F1120",
      },
    },
  },
  plugins: [],
};
