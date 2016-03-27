const transformSpecificationIntoCSS = require("react-inline/lib/transformSpecificationIntoCSS").default;
const transformStyleSheetObjectIntoSpecification = require("react-inline/lib/transformStyleSheetObjectIntoSpecification").default;

interface StyleSheet {
  [key: string]: any;
}

const styleSheets: { [key: string]: StyleSheet } = {};

let idCounter = 0;

type ClassNames = { [key: string]: string };

type CSSChunks = { [key: string]: string };

export let cssChunks: CSSChunks = {};

export function compileJSS(jss: StyleSheet, prefix?: string): { classes: ClassNames, css: string } {
  if (prefix == null) {
    idCounter++;

    prefix = "z" + idCounter.toString(16);
  }

  styleSheets[prefix] = jss;

  const normalizedPrefix = prefix.replace(/[.\/ ]/, "-");

  const classes: ClassNames = {};
  for (let key of Object.keys(jss)) {
    if (key.charAt(0) === "@") {
      continue;
    }

    classes[key] = `${normalizedPrefix}-${key}`;
  };

  let spec = transformStyleSheetObjectIntoSpecification(jss);
  let css = transformSpecificationIntoCSS(spec, { prefix: normalizedPrefix });

  return {
    classes,
    css,
  };
}
