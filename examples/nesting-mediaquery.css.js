module.exports = {
  ".a, .a2": {
    padding: 1,

    ".b": {
      padding: 1,
    },

    "@media (max-width: 1)": {
      padding: 2,

      ".b": {
        padding: 2,
      }
    }
  }
}