#!/usr/bin/env node
const { getDir, getExt, getSourceFile, getTestcases } = require("./lib/file");
const { compile, run, restore } = require("./lib/run");
const { existsSync, readFileSync } = require("fs");
const colors = require("colors/safe");
const { printTestCaseUnknown, printTestCaseCorrect, printTestCaseWrong, printTestCaseError } = require("./lib/print");

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
if (dir === null) exit(`No such directory: ${colors.cyan(keyword)}`);
const ext = getExt(dir, exts);
if (ext === null) exit("No source file.");
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
    const stdout = result.stdout;
    const stderr = result.stderr;
    if (!stderr) {
      const spent = (end - start).toFixed(2) + "ms";
      if (testcase.output === null) {
        printTestCaseUnknown(testcase, spent, stdout);
        testable -= 1;
      } else {
        const answer = readFileSync(dir + "/" + testcase.output).toString();
        if (answer === stdout) {
          printTestCaseCorrect(testcase, spent);
          corrects += 1;
        } else {
          printTestCaseWrong(testcase, spent, stdout, answer);
        }
      }
    } else {
      printTestCaseError(testcase, stderr);
      break;
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
