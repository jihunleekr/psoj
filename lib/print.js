const colors = require("colors");

function printTestCaseUnknown(testcase, spent, stdout) {
  console.log(colors.yellow("☐"), "", testcase.name, colors.blue(spent));
  console.log("");
  console.log("result:");
  console.log(stdout);
  console.log("");
}

function printTestCaseCorrect(testcase, spent) {
  console.log(colors.green("✔"), "", testcase.name, colors.blue(spent));
}

function printTestCaseWrong(testcase, spent, stdout, answer) {
  console.log(colors.red("✘"), "", testcase.name, colors.blue(spent), "\n");
  console.log("expected:");
  console.log(answer);
  console.log("result:");
  console.log(stdout, "\n");
}

function printTestCaseError(testcase, stderr) {
  console.log(colors.red("⚠"), " #" + testcase.name);
  console.log("");
  console.log(stderr);
  console.log("");
}

exports.printTestCaseUnknown = printTestCaseUnknown;
exports.printTestCaseCorrect = printTestCaseCorrect;
exports.printTestCaseWrong = printTestCaseWrong;
exports.printTestCaseError = printTestCaseError;
