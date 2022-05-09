#!/usr/bin/env node
const { getDir, getExt, getSourceFile, getTestcases } = require("./lib/file");
const { compile, run, restore } = require("./lib/run");
const { existsSync, readFileSync } = require("fs");
const colors = require("colors/safe");

const config = {
  extensions: [],
  sourceNames: ["main", "index", "problem"],
};
if (existsSync("./psoj.json")) {
  Object.assign(config, JSON.parse(readFileSync("./psoj.json").toString()));
}

const exts = config.extensions;
const runables = config.sourceNames;
const args = process.argv.slice(2);
const keyword = args[0];

const dir = getDir(keyword);
const ext = getExt(dir, exts);
if (ext === null) exit("There is no source file.");
const sourceFile = getSourceFile(dir, ext, runables);
const testcases = getTestcases(dir);
const compileErrMsg = compile(sourceFile, ext, dir);
if (compileErrMsg) {
  exit(compileErrMsg);
}

if (testcases.length > 0) {
  console.log("Source: " + colors.white(dir + "/" + sourceFile));
  console.log("");
  let testable = testcases.length;
  let corrects = 0;
  for (testcase of testcases) {
    const input = readFileSync(dir + "/" + testcase.input).toString();
    const start = performance.now();
    const result = run(sourceFile, ext, input, dir);
    const end = performance.now();
    const spent = (end - start).toFixed(2) + "ms";
    if (testcase.output === null) {
      console.log(colors.yellow("☐"), "#" + testcase.name, colors.blue(spent));
      console.log("");
      console.log("result:");
      console.log(result);
      console.log("");
      testable -= 1;
    } else {
      const output = readFileSync(dir + "/" + testcase.output).toString();
      if (result === output) {
        console.log(colors.green("✔"), "#" + testcase.name, colors.blue(spent));
        corrects += 1;
      } else {
        console.log(colors.red("✘"), "#" + testcase.name, colors.blue(spent));
        console.log("");
        console.log("expected:");
        console.log(output);
        console.log("result:");
        console.log(result);
        console.log("");
      }
    }
  }
  console.log("");
  if (testable > 0) {
    console.log(
      testable === corrects ? colors.green(corrects + "/" + testable) : colors.red(corrects + "/" + testable),
      "case" + (corrects > 1 ? "s" : "") + " passed."
    );
  }
  const unknowns = testcases.length - testable;
  if (unknowns) {
    console.log(colors.yellow(unknowns), "unknown case" + (unknowns > 1 ? "s" : "") + ".");
  }
}
restore(sourceFile, ext, dir);

function exit(message) {
  console.log(message);
  process.exit();
}
