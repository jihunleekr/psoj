const { existsSync, readdirSync } = require("fs");
const { join } = require("path");

function find(curPath = ".") {
  const subdirs = readdirSync(curPath, { withFileTypes: true })
    .filter((d) => d.isDirectory() && [".git", "node_modules"].indexOf(d.name) === -1)
    .map((d) => d.name);

  let paths = [];
  for (const subdir of subdirs) {
    const path = join(curPath, subdir);
    paths.push(path);
    paths = paths.concat(find(path));
  }
  return paths;
}

function getDir(keyword) {
  if (!keyword) return null;
  const result = find();
  const sorted = result
    .filter((v) => v.indexOf(keyword) !== -1)
    .sort((a, b) => {
      if (a.length === b.length) {
        if (a > b) return 1;
        else if (a < b) return -1;
      }
      return a.length - b.length;
    });
  if (sorted.length > 0) return sorted[0];
  else return null;
}

function getExt(dir, prefers = []) {
  const supports = ["c", "cc", "cpp", "go", "java", "js", "kt", "py", "php", "rb", "rs", "ts"];
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
    const name = input;
    const output = input.replace(/\.in/, ".out").replace("input", "output");
    testcases.push({
      name,
      input,
      output: existsSync(join(dir, output)) ? output : null,
    });
  });
  return testcases;
}

function getSourceFile(dir, ext, runables = []) {
  const result = readdirSync(dir);
  const candidates = result.filter((v) => v.match(new RegExp(`.${ext}$`)));
  for (const prefer of runables) {
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
