// Use this to import untyped JavaScript modules.

// /Users/howard/p/jss/typings/lib.core.es6.d.ts
/// <reference path="typings/lib.es6.d.ts" />
/// <reference path="typings/node/node.d.ts" />

declare const __moduledir: string;
declare const __outputdir: string;

declare module "foreach" {
  function foreach(dict: any, fn: (value: any, key: string) => void);
  export = foreach;
}
