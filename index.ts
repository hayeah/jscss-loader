import { ExtractPlugin } from "./ExtractPlugin";
import { webpackLoader } from "./webpackLoader";

Object.assign(webpackLoader, {
  ExtractPlugin,
});

module.exports = webpackLoader;