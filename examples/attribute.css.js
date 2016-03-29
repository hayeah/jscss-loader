module.exports = {
  ".a": {
    padding: 1,

    ".b": {
      padding: 1,
    },

    "[name=foo]": {
      padding: 2,

      ".b": {
        padding: 2,
      }
    },
  }
}