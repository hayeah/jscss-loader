module.exports = {
  ".a": {
    padding: 1,

    ".b, .c": {
      padding: 1,
    },

    ":hover": {
      padding: 2,

      ".b, .c": {
        padding: 2,
      }
    }
  }
}