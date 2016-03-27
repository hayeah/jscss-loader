Webpack loader for [React Inline](https://github.com/martinandert/react-inline). Unlinke the original React Inline, this loader supports arbitrary JavaScript (or TypeScript) code.

Use the `ExtractPlugin` to output all styles to an external CSS file.

We assume that the default export is the stylesheet:

```js
// Foo.css.ts
import { width, height } from "./constants";
import { gray } from "./colors";

export default {
  container: {
    width,
    height,
  },

  title: {
    color: gray,
  },
};
```

The

```js
// Foo.tsx
import jss from "./Foo.css.ts";

function Foo() {
  return (
    <div className={jss.container}>
      <h3 className={jss.title}>Hello JSS</h3>
    </div>
  );
}
```

## CommonJS

JavaScript is not transpiled with Babel because Babel is too large a dependency to include in this library. Avoid writing JavaScript using ES6 features that NodeJS doesn't support yet.

```js
const constants = require("./constants");
const colors = require("./colors");

module.exports = {
  container: {
    width: constants.width,
    height: constants.height,
  },

  title: {
    color: colors/gray,
  },
};
```

# Webpack Configuration

```js
const ExtractPlugin = require("jscss-loader").ExtractPlugin;

module.exports = {
  module: {
    loaders: [
      {
        test: /\.css.(ts|js)$/,
        loader: jssLoader,
      }
    ],
  },

  plugins: [
    new ExtractPlugin(),
  ],
}
```