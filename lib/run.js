const { spawnSync } = require("child_process");
const { unlinkSync, existsSync } = require("fs");
const { join } = require("path");

function getObjectFile(sourceFile, ext) {
  const objectFile = sourceFile.replace(/\.[a-z]+$/, "");
  let extra = "";
  if (ext === "java") extra = ".class";
  if (ext === "kt") extra = ".jar";
  if (ext === "ts") extra = ".js";
  return objectFile + extra;
}

function compile(sourceFile, ext, dir) {
  const options = {
    cwd: dir,
  };
  const objectFile = getObjectFile(sourceFile, ext);
  let result = null;
  let stderr = "";

  switch (ext) {
    case "c":
      result = spawnSync("bash", ["-c", `tee /dev/null | gcc ${sourceFile} -o ${objectFile}`], options);
      break;
    case "cc":
    case "cpp":
      result = spawnSync("bash", ["-c", `tee /dev/null | g++ ${sourceFile} -o ${objectFile}`], options);
      break;
    case "go":
      result = spawnSync("bash", ["-c", `tee /dev/null | go build ${sourceFile}`], options);
      break;
    case "java":
      result = spawnSync("bash", ["-c", `tee /dev/null | javac ${sourceFile}`], options);
      break;
    case "kt":
      result = spawnSync("bash", ["-c", `tee /dev/null | kotlinc-jvm -d ${objectFile} ${sourceFile}`], options);
      break;
    case "rs":
      result = spawnSync(
        "bash",
        ["-c", `tee /dev/null | rustc --edition 2018 -O -o ${objectFile} ${sourceFile}`],
        options
      );
      break;
    case "ts":
      result = spawnSync("bash", ["-c", `tee /dev/null | tsc ${sourceFile}`], options);
      break;
    default:
      return "";
  }

  stderr = result.stderr.toString();
  return stderr;
}

function restore(sourceFile, ext, dir) {
  const objectFile = getObjectFile(sourceFile, ext);
  const filepath = join(dir, objectFile);
  if (existsSync(filepath)) {
    unlinkSync(filepath);
  }
}

function run(sourceFile, ext, input, dir) {
  let result;
  const options = {
    input: input + "\n",
    cwd: dir,
  };
  const objectFile = getObjectFile(sourceFile, ext);
  switch (ext) {
    case "js":
      result = spawnSync("bash", ["-c", `tee /dev/null | node ${sourceFile}`], options);
      break;
    case "py":
      result = spawnSync("bash", ["-c", `tee /dev/null | python3 ${sourceFile}`], options);
      break;
    case "php":
      result = spawnSync("bash", ["-c", `tee /dev/null | php ${sourceFile}`], options);
      break;
    case "rb":
      result = spawnSync("bash", ["-c", `tee /dev/null | ruby ${sourceFile}`], options);
      break;

    case "c":
      result = spawnSync(`./${objectFile}`, options);
      break;
    case "cpp":
    case "cc":
      result = spawnSync(`./${objectFile}`, options);
      break;
    case "go":
      result = spawnSync(`./${objectFile}`, options);
      break;
    case "java":
      result = spawnSync("bash", ["-c", `tee /dev/null | java ${objectFile.replace(".class", "")}`], options);
      break;
    case "kt":
      result = spawnSync("bash", ["-c", `tee /dev/null | java -jar ${objectFile}`], options);
      break;
    case "rs":
      result = spawnSync(`./${objectFile}`, options);
      break;
    case "ts":
      result = spawnSync("bash", ["-c", `tee /dev/null | node ${objectFile}`], options);
      break;
    default:
      exit("지원되지 않는 확장자입니다.");
  }

  const returns = {
    stdout: result.stdout.toString().trim(),
  };
  if (result.stderr) {
    returns.stderr = result.stderr.toString();
  }
  return returns;
}

exports.compile = compile;
exports.run = run;
exports.getObjectFile = getObjectFile;
exports.restore = restore;
