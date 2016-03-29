import test = require("tape");

import { compileJSS, JSSStyleSheet } from "./jss";

function jss2css(jss) {
  const { output } = compileJSS(jss, "test");
  return output;
}

const glob = require("glob");

import path = require("path");
import fs = require("fs");

const exampleFiles = glob.sync(path.join(__dirname, "../examples/*.css.js"));

// console.log(exampleFiles);


function generateExamples() {
  exampleFiles.map(exampleFile => {
    const jss = require(exampleFile);
    fs.writeFileSync(exampleFile + ".css", jss2css(jss));
  });
}

function runTests() {
  exampleFiles.map(exampleFile => {
    const jss = require(exampleFile);

    test(path.basename(exampleFile), (t) => {
      const css = fs.readFileSync(exampleFile + ".css", "utf8");
      t.equal(jss2css(jss), css);
      t.end();
    });
  });
}

let cmd = process.argv[2];

if(cmd === "gen") {
  generateExamples();
} else {
  runTests();
}
