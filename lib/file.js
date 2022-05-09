const { execSync } = require("child_process");
const { existsSync, readdirSync } = require("fs");

function getDir(keyword) {
  if (!keyword) return null;
  const result = execSync(`find . -name "*${keyword}*" -type d`);
  const sorted = result
    .toString()
    .trim()
    .split("\n")
    .sort((a, b) => {
      if (a.length === b.length) {
        if (a > b) return 1;
        else if (a < b) return -1;
      }
      return a.length - b.length;
    });
  return sorted[0] ? sorted[0] : null;
}

function getExt(dir, prefers = []) {
  const supports = ["cc", "cpp", "java", "js", "py", "php", "rb"];
  const exts = [];
  for (const ext of prefers) {
    if (supports.includes(ext)) exts.push(ext);
  }
  for (const ext of supports) {
    if (!exts.includes(ext)) exts.push(ext);
  }
  const result = readdirSync(dir);
  for (const ext of exts) {
    for (filename of result) {
      if (filename.search(new RegExp(`.${ext}$`)) !== -1) {
        return ext;
      }
    }
  }
  return null;
}

function getTestcases(dir) {
  const result = readdirSync(dir);
  const inputs = result.filter((v) => v.match(/input|\.in/));
  const testcases = [];
  inputs.forEach((input) => {
    const name = input.replace(/\.in/, "").replace("input", "");
    const output = input.replace(/\.in/, ".out").replace("input", "output");
    testcases.push({
      name,
      input,
      output: existsSync(dir + "/" + output) ? output : null,
    });
  });
  return testcases;
}

function getSourceFile(dir, ext, possibles = ["main", "index", "problem"]) {
  const result = readdirSync(dir);
  const candidates = result.filter((v) => v.match(new RegExp(`.${ext}$`)));
  for (const prefer of possibles) {
    const filename = prefer.toLowerCase() + "." + ext;
    for (candidate of candidates) {
      if (candidate.toLowerCase() === filename) {
        return candidate;
      }
    }
  }
  return candidates.length > 0 ? candidates[0] : null;
}

exports.getDir = getDir;
exports.getExt = getExt;
exports.getTestcases = getTestcases;
exports.getSourceFile = getSourceFile;
