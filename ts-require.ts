import { transpileModule, ScriptTarget } from "typescript";

import * as fs from "fs";

export function compileTypescriptFile(filename) {
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

export function requireTypescript(module, filename) {
  return module._compile(compileTypescriptFile(filename), filename);
};

(require as any).extensions['.ts'] = requireTypescript;