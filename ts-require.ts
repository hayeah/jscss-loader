import { transpileModule, ScriptTarget } from "typescript";

import * as fs from "fs";

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
// require.extensions['.tsx'] = requireTypescript;