"use strict";

import { compileJSS } from "./compileJSS";

import * as path from "path";

import { cssChunks } from "./index";

// Register require hook to load typescript files.
import "./ts-require";

export function webpackLoader(content: string) {
  const { context, resourcePath, request } = this as LoaderContext;

  const modulePath = path.relative(context, resourcePath)

  // avoid webpack's fancy dynamic require handling
  const mod = require(this.resourcePath);
  // CommonJS & ES6 compat
  const jss = mod.default || mod;

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