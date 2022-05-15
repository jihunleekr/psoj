const { spawnSync } = require("child_process");
const { unlinkSync, existsSync } = require("fs");
const { join } = require("path");
const { extname } = require("./file");

function getObjFilename(srcFilename) {
  const ext = extname(srcFilename);
  const objFilename = srcFilename.replace(/\.[a-z]+$/i, "");
  let extra = "";
  if (ext === "java") extra = ".class";
  if (ext === "kt") extra = ".jar";
  if (ext === "ts") extra = ".js";
  return objFilename + extra;
}

function compile(srcFilename, dir) {
  const ext = extname(srcFilename);
  const options = {
    cwd: dir,
  };
  const objFilename = getObjFilename(srcFilename);
  let result = null;
  let stderr = "";

  switch (ext) {
    case "c":
      result = spawnSync("bash", ["-c", `tee /dev/null | gcc ${srcFilename} -o ${objFilename}`], options);
      break;
    case "cc":
    case "cpp":
      result = spawnSync("bash", ["-c", `tee /dev/null | g++ ${srcFilename} -o ${objFilename}`], options);
      break;
    case "go":
      result = spawnSync("bash", ["-c", `tee /dev/null | go build ${srcFilename}`], options);
      break;
    case "java":
      result = spawnSync("bash", ["-c", `tee /dev/null | javac ${srcFilename}`], options);
      break;
    case "kt":
      result = spawnSync(
        "bash",
        ["-c", `tee /dev/null | kotlinc-jvm -include-runtime -d ${objFilename} ${srcFilename}`],
        options
      );
      break;
    case "rs":
      result = spawnSync(
        "bash",
        ["-c", `tee /dev/null | rustc --edition 2018 -O -o ${objFilename} ${srcFilename}`],
        options
      );
      break;
    case "ts":
      result = spawnSync("bash", ["-c", `tee /dev/null | tsc ${srcFilename}`], options);
      break;
    default:
      return "";
  }

  stderr = result.stderr.toString();
  return stderr;
}

function restore(srcFilename, dir) {
  const ext = extname(srcFilename);
  const objFilename = getObjFilename(srcFilename);
  const filepath = join(dir, objFilename);
  if (existsSync(filepath)) {
    unlinkSync(filepath);
  }
}

function run(srcFilename, input, dir) {
  const ext = extname(srcFilename);
  let result;
  const options = {
    input: input + "\n",
    cwd: dir,
  };
  const objFilename = getObjFilename(srcFilename);
  switch (ext) {
    case "js":
      result = spawnSync("bash", ["-c", `tee /dev/null | node ${srcFilename}`], options);
      break;
    case "py":
      result = spawnSync("python3", [`${srcFilename}`], options);
      break;
    case "php":
      result = spawnSync("php", [`${srcFilename}`], options);
      break;
    case "rb":
      result = spawnSync("ruby", [`${srcFilename}`], options);
      break;

    case "c":
      result = spawnSync(`./${objFilename}`, options);
      break;
    case "cpp":
    case "cc":
      result = spawnSync(`./${objFilename}`, options);
      break;
    case "go":
      result = spawnSync(`./${objFilename}`, options);
      break;
    case "java":
      result = spawnSync("java", [`${objFilename.replace(".class", "")}`], options);
      break;
    case "kt":
      result = spawnSync("java", [`-jar`, `${objFilename}`], options);
      break;
    case "rs":
      result = spawnSync(`./${objFilename}`, options);
      break;
    case "ts":
      result = spawnSync("bash", ["-c", `tee /dev/null | node ${objFilename}`], options);
      break;
    default:
    // nothing
  }

  const returns = {};
  if (result.stdout) {
    returns.stdout = result.stdout.toString().trim();
  }
  if (result.stderr) {
    returns.stderr = result.stderr.toString();
  }
  return returns;
}

exports.compile = compile;
exports.run = run;
exports.getObjFilename = getObjFilename;
exports.restore = restore;
