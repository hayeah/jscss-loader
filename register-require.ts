// require("ts-node/register");

// require("./foo");
// import { foo } from "./foo";

// console.log(require("./test/b.css.ts"));

// import { transpileModule } from "typescript";

"use strict";

// const ts = require("typescript");
import { transpileModule, ScriptTarget } from "typescript";
// const transpileModule = ts.transpileModule;

// const content = `
// import {a, b} from "./jss-loader";

// interface Foo {
//   a: number;
// }

// const ab = {a,b};

// const foo = { a: 1 };
// `;

import * as fs from "fs";
// const fs = require("fs");

function compileTypescriptFile(filename) {
  const content = fs.readFileSync(filename, "utf8");
  const result = transpileModule(content, {
    compilerOptions: {
      target: ScriptTarget.ES3,
    },
    fileName: filename,
  });

  // console.log("ts", filename, result);

  return result.outputText;
}


function requireTypescript(module, filename) {
  return module._compile(compileTypescriptFile(filename), filename);
};

(require as any).extensions['.ts'] = requireTypescript;

// console.log(require("./test/b.css.ts"));
// require.extensions['.ts'] = requireTypescript;
// require.extensions['.tsx'] = requireTypescript;