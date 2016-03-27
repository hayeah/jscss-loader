export { ExtractPlugin } from "./ExtractPlugin";
import { webpackLoader } from "./webpackLoader";
export default webpackLoader;

type CSSChunks = { [key: string]: string };

export let cssChunks: CSSChunks = {};

