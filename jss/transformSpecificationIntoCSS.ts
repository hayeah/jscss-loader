import foreach = require('foreach');
import buildCSSRule from './buildCSSRule';


const invalidChars = /[^_a-z0-9-]/ig;

interface ClassNameOptions {
  prefix?: string;
  prefixes?: string[];
}

export function generateClassName(id: string, options: ClassNameOptions) {
  var result = '';

  if (options.prefix) {
    result += options.prefix.replace(invalidChars, '_') + '-';
  } else if (options.prefixes) {
    result += options.prefixes.map(p => p.replace(invalidChars, '_')).join('-') + '-';
  }

  result += id;

  // if (options.compressClassNames) {
  //   const [className, selector] = splitSelector(result);
  //   return compressClassName(className, options) + selector;
  // }

  return result;
}


export default function transformSpecificationIntoCSS(spec, options = {}) {
  let css = [];

  foreach(spec, (value, key) => {
    processStyle(css, key, value, 0, options);
  });

  return css.join('\n');
}

function processStyle(css, name, spec, level, options) {
  processRules(css, name, spec.rules, level, options);
  processSelectors(css, name, spec.selectors, level, options);
  processMediaQueries(css, name, spec.mediaQueries, level, options);
}

function processRules(css, name, rules, level, options) {
  if (isEmpty(rules)) { return; }

  let nestingRules = {};
  let className = generateClassName(name, options);

  css.push(indent(level) + '.' + className + ' {');

  foreach(rules, (value, key) => {
    if (key.match(/^& /)) {
      nestingRules[key] = value;
    } else {
      css.push(indent(level + 1) + buildCSSRule(key, value, options));
    }

  });

  css.push(indent(level) + '}');

  foreach(nestingRules, (rules, key) => {
    let nestingSelector = key.slice(2);
    css.push(indent(level) + '.' + className + ' ' + nestingSelector + ' {');
      foreach(rules, (value, key) => {
        css.push(indent(level + 1) + buildCSSRule(key, value, options));
      });
    css.push(indent(level) + '}');
  });
}

function processSelectors(css, name, selectors, level, options) {
  if (isEmpty(selectors)) { return; }

  foreach(selectors, (value, key) => {
    processRules(css, name + key, value.rules, level, options);
  });
}

function processMediaQueries(css, name, mediaQueries, level, options) {
  if (isEmpty(mediaQueries)) { return; }

  foreach(mediaQueries, (value, key) => {
    processMediaQuery(css, name, key, value, level, options);
  });
}

function processMediaQuery(css, name, query, content, level, options) {
  var mediaQueryCSS = [];

  processRules(mediaQueryCSS, name, content.rules, level + 1, options);
  processSelectors(mediaQueryCSS, name, content.selectors, level + 1, options);

  if (mediaQueryCSS.length) {
    css.push(indent(level) + '@' + generateMediaQueryName(query, options) + ' {');
    Array.prototype.push.apply(css, mediaQueryCSS);
    css.push(indent(level) + '}');
  }
}

function generateMediaQueryName(name, options) {
  if (options.mediaMap) {
    return options.mediaMap[name] || name;
  }

  return name;
}

function indent(level) {
  let result = '';

  for (let i = 0; i < level; i++) {
    result += '  ';
  }

  return result;
}

function isEmpty(obj) {
  return typeof obj !== 'object' || Object.keys(obj).length === 0;
}
