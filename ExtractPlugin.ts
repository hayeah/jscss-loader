const { RawSource, ConcatSource } = require("webpack-sources");
import { cssChunks } from "./webpackLoader";

export class ExtractPlugin {
  apply(compiler) {
    compiler.plugin("emit", function (compilation: Compilation, next) {
      const { chunks, assets } = compilation;

      for(let chunk of chunks) {
        const { name, modules } = chunk;

        const cssParts = [];
        for(let mod of modules) {
          const css = cssChunks[mod.request];
          if (css) {
            cssParts.push(css);
          }
        }
        const stylesheet = cssParts.join("\n");
        let source = new RawSource(stylesheet);

        // Avoid other extracted css asset (e.g. from ExtractTextPlugin)
        let previousSource = assets[`${name}.css`];
        if (previousSource) {
          source = new ConcatSource(previousSource, "\n", source);
          // previousSource should be a ConcatSource
          // previousSource.add("\n");
          // previousSource.add(source);
          // source = previousSource;
        }

        assets[`${name}.css`] = source;
        next();
      }
    });

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
  assets: { [key: string]: any }
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