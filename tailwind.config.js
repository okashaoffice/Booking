/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryColor: "#2bcca0",
      },
      screens: {
        mob: { max: "500px" },
      },
    },
  },
  plugins: [],
};
