import transformSpecificationIntoCSS from "./jss/transformSpecificationIntoCSS";
import transformStyleSheetObjectIntoSpecification from "./jss/transformStyleSheetObjectIntoSpecification";

interface StyleSheet {
  [key: string]: any;
}

const styleSheets: { [key: string]: StyleSheet } = {};

let idCounter = 0;

type ClassNames = { [key: string]: string };


export function compileJSS(jss: StyleSheet, prefix?: string): { classes: ClassNames, css: string } {
  if (prefix == null) {
    idCounter++;

    prefix = "z" + idCounter.toString(16);
  }

  styleSheets[prefix] = jss;

  const normalizedPrefix = prefix.replace(/[.\/ ]/g, "-");

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
