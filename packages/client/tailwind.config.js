const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./src/**/*.tsx", "./public/**/*.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: colors.trueGray,
        teal: colors.teal,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
