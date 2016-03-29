export type JSSStyleSheet = { [key: string]: Rule };

type Value = number | string | Rule

type Rule = { [key: string]: Value };

const selfRuleRE = /^&/;
const mediaQueryRE = /^@/;
// pseudo element or attribute matcher
const attachedSelectorRE = /^[:\[]/;
const nonLocalClassNameRE = /^\./;
const multiSelectorRE = /,/;

import { buildCSSRule } from "./utils/buildCSSRule";
import { generateScopeSelectors } from "./generateScopeSelectors";

function foreach<T>(dict: { [key: string]: T }, fn: (value: T, key: string) => void) {
  for(let key of Object.keys(dict)) {
    fn(dict[key], key);
  }
}



export function compileJSS(jss: JSSStyleSheet, prefix: string) {
  let css = [];
  let indent = 0;
  let cssScope: string[][] = [];
  let scopeMediaQuery: string = null;

  let classNames: { [key: string]: string } = {};

  foreach(jss, (rule: Rule, key: string) => {
    compileRule(key, rule);
  });

  function compileRule(key: string, rule: Rule, indent: string = "") {
    let selectors: string[] = [];


    if(multiSelectorRE.test(key)) {
      selectors = key.split(",").map(str => str.trim());
    } else {
      selectors = [key];
    }

    // rename local classes
    selectors = selectors.map(selector => {
      if(selfRuleRE.test(selector)) {
        return selector.slice(1).trim();
      } else if(nonLocalClassNameRE.test(selector)) {
        return selector;
      } else {
        const localName = className(selector);
        classNames[selector] = localName;

        return`.${localName}`;
      }
    });

    const nestRules: JSSStyleSheet = {};
    const attachedSelectors: JSSStyleSheet = {};
    const mediaQueries: JSSStyleSheet = {};


    const properties: Rule = {};

    foreach(rule, (value, key) => {
      if(typeof value === "object") {
        if (attachedSelectorRE.test(key)) {
          attachedSelectors[key] = value as Rule;
          return;
        }

        if (mediaQueryRE.test(key)) {
          mediaQueries[key] = value;
          return;
        }

        nestRules[key] = value;
        return;
      }

      // other
      properties[key] = value;
    });

    // const selector = selectors.join(", ")
    cssScope.push(selectors);
    outputProperties(properties, indent);
    cssScope.pop();

    cssScope.push(selectors);
    foreach(nestRules, (rule, key) => {
      compileRule(key, rule, indent);
    });
    cssScope.pop();

    // pseudo element or attribute that should be attached to the current selector
    foreach(attachedSelectors, (rule, attachment) => {
      cssScope.push(selectors.map(selector => `${selector}${attachment}`));
      let nestedRules = outputProperties(rule, indent);
      foreach(nestedRules, (rule, key) => {
        compileRule(key, rule, indent);
      });
      cssScope.pop();
    });

    foreach(mediaQueries, (rule, mediaQuery) => {
      let _scopeMediaQuery = scopeMediaQuery;
      scopeMediaQuery = mediaQuery;

      // recurse into media query using current selector scope
      compileRule(key, rule, indent + "  ");

      scopeMediaQuery = _scopeMediaQuery;
    });


    // foreach(selfRules, (rule, key) => {
    //   const childSelector = key.slice(2);
    //   outputRule(`${selector} ${childSelector}`, rule);
    // });



    //  css.push(`${selectorFor(key)}`)
  }

  function outputProperties(rule: Rule, indent: string = "") {
    const nestRules: JSSStyleSheet = {};

    let selectors = generateScopeSelectors(cssScope)
      .map(selector => `${indent}${selector}`);

    if(scopeMediaQuery) {
      css.push(`${scopeMediaQuery} {`);
    }

    css.push(`${selectors.join(",\n")} {`)
    foreach(rule, (value: Value, key) => {
      // todo: throw away objects
      if(typeof value === "object") {
        nestRules[key] = value;
        return;
      }
      css.push(indent + "  " + buildCSSRule(key, value))
    });
    css.push(`${indent}}`)

    if(scopeMediaQuery) {
      css.push("}");
    }

    return nestRules;
  }

  function className(name: string): string {
    return `${prefix}_${name}`;
  }


  return {
    output: css.join("\n"),
    classNames,
  }
}


function indent(level) {
  let result = '';

  for (let i = 0; i < level; i++) {
    result += '  ';
  }

  return result;
}
