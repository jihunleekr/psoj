#!/usr/bin/env node

const { program, Option } = require("commander");
const { version } = require("./package.json");
const { determineDir, determineExt, getSrcFilename, getTestcases, extname } = require("./lib/file");
const { compile, run, restore } = require("./lib/run");
const { existsSync, readFileSync } = require("fs");
const { join } = require("path");
const colors = require("colors/safe");
const { printTestCaseUnknown, printTestCaseCorrect, printTestCaseWrong, printTestCaseError } = require("./lib/print");

program
  .version(version)
  .argument("<keyword>", "problem directory")
  .addOption(new Option("-f, --file <file>", "filename to excute"))
  .parse();

const config = {
  extensions: [],
  sourceNames: ["main", "index", "problem"],
};

if (existsSync("./psoj.json")) {
  Object.assign(config, JSON.parse(readFileSync("./psoj.json").toString()));
}

if (program.opts().file) {
  const ext = extname(program.opts().file);
  const basename = program.opts().file.replace(`.${ext}`, "");
  if (basename && ext) {
    config.extensions = [ext];
    config.sourceNames = [basename];
  }
}

const exts = config.extensions;
const runables = config.sourceNames;
const keyword = program.processedArgs[0];

const dir = determineDir(keyword);
if (dir === null) exit(`No such directory: ${colors.cyan(keyword)}`);
const ext = determineExt(dir, exts);
if (ext === null) exit(`No source file in ${colors.cyan(dir)}`);
const srcFilename = getSrcFilename(dir, ext, runables);

const testcases = getTestcases(dir);
const compileErrMsg = compile(srcFilename, dir);
if (compileErrMsg) {
  exit(compileErrMsg);
}

if (testcases.length > 0) {
  console.log("Source: " + colors.white(join(dir, srcFilename)));
  console.log("");
  let testable = testcases.length;
  let corrects = 0;
  for (testcase of testcases) {
    const input = readFileSync(join(dir, testcase.input)).toString();
    const start = performance.now();
    const result = run(srcFilename, input, dir);
    const end = performance.now();
    const stdout = result.stdout;
    const stderr = result.stderr;
    if (!stderr) {
      const spent = (end - start).toFixed(2) + "ms";
      if (testcase.output === null) {
        printTestCaseUnknown(testcase, spent, stdout);
        testable -= 1;
      } else {
        const answer = readFileSync(join(dir, testcase.output)).toString();
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
restore(srcFilename, dir);

function exit(message) {
  console.log(message);
  process.exit();
}
