/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        "btn-blue": "#5076db",
        "btn-gray": "#626262",
      },
      borderWidth: {
        3: "3px",
      },
    },
  },
  plugins: [],
};
