const { diffArrays } = require("diff");

function equal(a, b) {
  return a.trimEnd() === b.trimEnd();
}

function diff(a, b) {
  return diffArrays(a.split("\n"), b.split("\n"));
}

exports.equal = equal;
exports.diff = diff;
