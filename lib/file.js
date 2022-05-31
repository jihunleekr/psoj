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

function extname(filename) {
  const found = filename.match(/\.[a-z]+$/);
  if (found !== null) {
    return found[0].slice(1);
  }
  return "";
}

function determineDir(keyword) {
  if (!keyword) return null;
  const dirs = find();
  const dirsKeyword = dirs
    .filter((v) => v.indexOf(keyword) !== -1)
    .sort((a, b) => {
      if (a.length === b.length) {
        if (a > b) return 1;
        else if (a < b) return -1;
      }
      return a.length - b.length;
    });
  if (dirsKeyword.length > 0) return dirsKeyword[0];
  else return null;
}

function determinetExt(dir, prefers = []) {
  const supports = ["c", "cc", "cpp", "cs", "go", "java", "js", "kt", "py", "php", "rb", "rs", "ts"];
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

function getTestcases(dir, keyword = "") {
  const result = readdirSync(dir);
  const inputs = result.filter((v) => v.match(/input|\.in/));
  const testcases = [];
  inputs.forEach((input) => {
    if (keyword && !new RegExp(keyword).test(input)) return;
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

function getSrcFilename(dir, ext, runables = []) {
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

exports.determineDir = determineDir;
exports.determineExt = determinetExt;
exports.getTestcases = getTestcases;
exports.getSrcFilename = getSrcFilename;
exports.extname = extname;
