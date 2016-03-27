const { RawSource } = require("webpack-sources");
import { cssChunks } from "./index";

export class ExtractPlugin {
  apply(compiler) {
    compiler.plugin("this-compilation", compilation => {
      // compilation.plugin("normal-module-loader", (loaderContext, module) => {
      //   console.log(module.request);
      //   console.log("normal-module-loader", module);
      // });

      compilation.plugin("additional-assets", function(callback) {
        // console.log("additional-assets");
        const css = cssChunks.join("\n");
        this.assets["bundle.css"] = new RawSource(css);
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