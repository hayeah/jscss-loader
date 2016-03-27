"use strict";

import { compileJSS } from "./index";

import * as path from "path";

import { cssChunks } from "./index";

// regiser require hook to load typescript files.
import "./register-require";

module.exports = function(content) {
  const { context, resourcePath, request } = this as LoaderContext;
  console.log("jss loader");

  const modulePath = path.relative(context, resourcePath)

  // avoid webpack's fancy dynamic require handling
  const jss = require(this.resourcePath).default;

  const { css, classes } = compileJSS(jss, modulePath);

  cssChunks[request] = css;

  return "module.exports = " + JSON.stringify(classes);
};

interface LoaderContext {
  context: string,
  resource: string,
  resourcePath: string,
  request: string,
}