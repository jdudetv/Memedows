module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      tahoma: ["Tahoma", "sans-serif"],
      trebuchet: ["Trebuchet MS", "sans-serif"],
    },
    extend: {
      width: {
        "1/10": "10%",
        "1/20": "5%",
      },
      height: {
        "1/10": "10%",
        "1/20": "5%",
      },
    },
  },
  variants: {
    extend: {
      textColor: ["group-focus"],
      backgroundColor: ["group-focus"],
      margin: ["last"],
    },
  },
  plugins: [],
};
