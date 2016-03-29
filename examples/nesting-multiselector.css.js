module.exports = {
  ".a, .b": {
    padding: 1,

    ".a2, .b2": {
      padding: 2,

      "& h1, & h2": {
        padding: 3,
      }
    }
  }
}