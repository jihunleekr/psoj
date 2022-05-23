const colors = require("colors");
const { diff } = require("./diff");

function printTestCaseUnknown(name, spent, actual) {
  console.log(colors.yellow("☐"), "", name, colors.blue(spent));
  console.log("");
  console.log("actual:");
  console.log(actual);
  console.log("");
}

function printTestCaseCorrect(name, spent) {
  console.log(colors.green("✔"), "", name, colors.blue(spent));
}

function printTestCaseWrong(name, spent, actual, expected, showDiff = false) {
  if (showDiff) {
    printTestCaseWrongDiff(name, spent, actual, expected);
  } else {
    printTestCaseWrongAll(name, spent, actual, expected);
  }
}

function lines(arr, lineStr = "") {
  if (typeof arr === "string") arr = [arr];
  const lineLen = 80;
  const indentLen = 4;
  return arr.map((v) => lineStr.padEnd(indentLen, " ") + v.padEnd(lineLen - indentLen, " ")).join("\n");
}

function printTestCaseWrongDiff(name, spent, actual, expected) {
  console.log(colors.red("✘"), "", name, colors.blue(spent), "\n");
  console.log(colors.bgBrightGreen(colors.grey(lines("expected", "---"))));
  console.log(colors.bgBrightRed(colors.grey(lines("actual", "+++ "))));
  for (diffArr of diff(expected, actual)) {
    if (diffArr.removed) {
      console.log(colors.bgBrightGreen(colors.grey(lines(diffArr.value, "-"))));
    } else if (diffArr.added) {
      console.log(colors.bgBrightRed(colors.grey(lines(diffArr.value, "+"))));
    } else {
      console.log(colors.bgWhite(lines(diffArr.value)));
    }
  }
}

function printTestCaseWrongAll(name, spent, actual, expected) {
  console.log(colors.red("✘"), "", name, colors.blue(spent), "\n");
  console.log("expected:");
  console.log(expected);
  console.log("actual:");
  console.log(actual, "\n");
}

function printTestCaseError(name, stderr) {
  console.log(colors.red("⚠"), " #" + name);
  console.log("");
  console.log(stderr);
  console.log("");
}

exports.printTestCaseUnknown = printTestCaseUnknown;
exports.printTestCaseCorrect = printTestCaseCorrect;
exports.printTestCaseWrong = printTestCaseWrong;
exports.printTestCaseError = printTestCaseError;
exports.lines = lines;
