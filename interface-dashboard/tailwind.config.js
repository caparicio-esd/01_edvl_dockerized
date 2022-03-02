module.exports = {
  content: ["./*.{html,js}", "./src/**/*.{html,js}"],
  theme: {
    fontFamily: {
      sans: ['"Roboto"'],
    },
    extend: {
      fontSize: {
        "xs": ".75rem", 
        "xxs": ".65rem",
        "sm": ".8rem"
      }
    },
  },
  plugins: [],
}
