const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./*.{html,js}", "./src/**/*.{html,js}"],
  theme: {
    fontFamily: {
      sans: ['"Roboto"'],
    },
    extend: {
      fontSize: {
        xs: ".75rem",
        xxs: [".65rem", "0.7rem"],
        sm: ".8rem",
      },
      colors: {
        gray: {
          ...colors.gray,
          350: "#c9cbcd",
        },
      },
    },
  },
  plugins: [],
};
