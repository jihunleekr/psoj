const { spawnSync } = require("child_process");
const { unlinkSync, existsSync } = require("fs");

function getObjectFile(sourceFile, ext) {
  const objectFile = sourceFile.replace(/\.[a-z]+$/, "");
  return objectFile + (ext === "java" ? ".class" : "");
}

function compile(sourceFile, ext, dir) {
  const options = {
    cwd: dir,
  };
  const objectFile = getObjectFile(sourceFile, ext);
  let result = null;
  let stderr = "";

  switch (ext) {
    case "cpp":
    case "cc":
      result = spawnSync("bash", ["-c", `tee /dev/null | g++ ${sourceFile} -o ${objectFile}`], options);
      stderr = result.stderr.toString();
      break;
    case "java":
      result = spawnSync("bash", ["-c", `tee /dev/null | javac ${sourceFile}`], options);
      stderr = result.stderr.toString();
      break;
  }
  return stderr;
}

function restore(sourceFile, ext, dir) {
  const objectFile = getObjectFile(sourceFile, ext);
  const filepath = dir + "/" + objectFile;
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

    case "cpp":
    case "cc":
      result = spawnSync(`./${objectFile}`, options);
      break;
    case "java":
      result = spawnSync("bash", ["-c", `tee /dev/null | java ${objectFile.replace(".class", "")}`], options);
      break;
    default:
      exit("지원되지 않는 확장자입니다.");
  }

  return result.stdout.toString().trim();
}

exports.compile = compile;
exports.run = run;
exports.getObjectFile = getObjectFile;
exports.restore = restore;
