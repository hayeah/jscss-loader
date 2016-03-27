const { RawSource } = require("webpack-sources");
import { cssChunks } from "./webpackLoader";

export class ExtractPlugin {
  apply(compiler) {
    compiler.plugin("this-compilation", compilation => {
      // compilation.plugin("normal-module-loader", (loaderContext, module) => {
      //   console.log(module.request);
      //   console.log("normal-module-loader", module);
      // });

      compilation.plugin("additional-assets", function(callback) {
        // console.log("additional-assets");
        const { chunks } = this as Compilation;

        for(let chunk of chunks) {
          const { name, modules } = chunk;
          const stylesheet = modules.map(mod => cssChunks[mod.request]).join("\n");
          this.assets[`${name}.css`] = new RawSource(stylesheet);
        }

        callback();
      });
    });

    // compiler.plugin("after-compile", compilation => {
    //   console.log("after-compile");
    // });

    compiler.plugin('compilation', function(compilation) {
       compilation.chunkTemplate.plugin('render', function(modules, chunk){
         console.log("chunkTemplate render");
       });
    });
  }
}

interface Compilation {
  fullHash: string,
  hash: string,
  modules: NormalModule[],
  chunks: Chunk[],
}

interface Chunk {
  name: string,
  entry: boolean,
  files: string[],
  modules: NormalModule[],
  hash: string,
  renderedHash: string,
}

interface NormalModule {
  // "/Users/howard/p/jss/test"
  context: string,
  // "./b.css.ts"
  rawRequest: string,
  // "/Users/howard/p/jss/lib/jss-loader.js!/Users/howard/p/jss/test/b.css.ts"
  request: string,
  // meta
  // meta: { [key: string]: any }

  // wtf is this?
  // cacheable

}