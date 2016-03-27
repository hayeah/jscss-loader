"use strict";

import { compileJSS } from "./compileJSS";

import * as path from "path";

type CSSChunks = { [key: string]: string };

const Module = require("module");

export let cssChunks: CSSChunks = {};

// Register require hook to load typescript files.
import "./ts-require";

export function webpackLoader(content: string) {
  this.cacheable();

  const { context, resourcePath, request } = this as LoaderContext;

  const modulePath = path.relative(context, resourcePath)

  // Reset require cache to empty to reload everything.
  const oldCache = Module._cache;
  Module._cache = {};

  const mod = require(resourcePath);
  const allLoadedModules = Object.keys(Module._cache);

  // Add all loaded modules as dependencies of this file.
  for (let file of allLoadedModules) {
    if (file === resourcePath) {
      continue;
    }

    this.addDependency(file);
  }

  // console.log(mod);
  // console.log("deps", this._module.fileDependencies);
  // console.log("cache", Module._cache);

  Module._cache = oldCache;

  // CommonJS & ES6 compat
  const jss = mod.default || mod;

  const { css, classes } = compileJSS(jss, modulePath);

  cssChunks[request] = css;

  return "module.exports = " + JSON.stringify(classes);
};

interface LoaderContext {
  context: string;
  resource: string;
  resourcePath: string;
  request: string;
  // addDependency(file: string);
}