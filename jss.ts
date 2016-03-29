export type JSSStyleSheet = { [key: string]: Rule };

type Value = number | string | Rule

type Rule = { [key: string]: Value };

const selfRuleRE = /^& /;
const mediaQueryRE = /^@/;
const pseudoElementRE = /^:/;
const nonLocalClassNameRE = /^\./;
const multiSelectorRE = /,/;

import { buildCSSRule } from "./utils/buildCSSRule";

function foreach<T>(dict: { [key: string]: T }, fn: (value: T, key: string) => void) {
  for(let key of Object.keys(dict)) {
    fn(dict[key], key);
  }
}

export function compileJSS(jss: JSSStyleSheet, prefix: string) {
  let css = [];
  let indent = 0;
  let parents = [];

  let classNames: { [key: string]: string } = {};

  foreach(jss, (rule: Rule, key: string) => {
    compileRule(key, rule);
  });

  function compileRule(key: string, rule: Rule) {
    let selectors: string[] = [];


    if(multiSelectorRE.test(key)) {
      selectors = key.split(",").map(str => str.trim());
    } else {
      selectors = [key];
    }

    // rename local classes
    selectors = selectors.map(selector => {
      if(nonLocalClassNameRE.test(selector)) {
        return selector;
      } else {
        const localName = className(selector);
        classNames[selector] = localName;

        return`.${localName}`;
      }
    });

    const selfRules: JSSStyleSheet = {};
    const pseudoElements: JSSStyleSheet = {};


    const properties: Rule = {};

    foreach(rule, (value, key) => {
      if (selfRuleRE.test(key)) {
        selfRules[key] = value as Rule;
        return;
      }

      if (pseudoElementRE.test(key)) {
        pseudoElements[key] = value as Rule;
        return;
      }

      // other
      properties[key] = value;
    });

    // const selector = selectors.join(", ")

    outputRule(selectors.join(", "), properties);

    foreach(pseudoElements, (rule, pseudo) => {
      let multiSelector = selectors.map(selector => `${selector}${pseudo}`).join("," )
      outputRule(multiSelector, rule);
    });

    // foreach(selfRules, (rule, key) => {
    //   const childSelector = key.slice(2);
    //   outputRule(`${selector} ${childSelector}`, rule);
    // });



    //  css.push(`${selectorFor(key)}`)
  }

  function outputRule(selector: string, rule: Rule, indent: string = "") {
    const mediaQueries: JSSStyleSheet = {};
    css.push(`${indent}${selector} {`)
    foreach(rule, (value: Value, key) => {

      if (mediaQueryRE.test(key)) {
        mediaQueries[key] = value as Rule;
        return;
      }

      // todo: throw away objects
      css.push(indent + "  " + buildCSSRule(key, value))
    });
    css.push(`${indent}}`)

    foreach(mediaQueries, (rule, mediaQuery) => {
      css.push(`${mediaQuery} {`);
      outputRule(selector, rule, indent + "  ");
      css.push("}");
    });
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
