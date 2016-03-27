"use strict";

import { compileJSS } from "./index";

import * as path from "path";

import { cssChunks } from "./index";

// regiser require hook to load typescript files.
import "./register-require";

module.exports = function(content) {
  console.log("jss loader");

  const modulePath = path.relative(this.context, this.resourcePath)

  // avoid webpack's fancy dynamic require handling
  const jss = require(this.resourcePath).default;

  const { css, classes } = compileJSS(jss, modulePath);

  cssChunks.push(css);

  return "module.exports = " + JSON.stringify(classes);
};