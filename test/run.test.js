const { getObjFilename, compile, restore, run } = require("../lib/run");
const { extname } = require("../lib/file");
const test = require("tape");
const { existsSync } = require("fs");
const { join } = require("path");

test("실행파일은 확장자를 제거하여 만든다. (자바는 예외)", (t) => {
  t.plan(2);
  t.equal(getObjFilename("Main.cpp"), "Main");
  t.equal(getObjFilename("Main.java"), "Main.class");
});

test("인터프리터 언어 실행", (t) => {
  const filenames = ["main.php", "main.js", "main.py", "main.rb"];
  t.plan(filenames.length * 1);
  for (filename of filenames) {
    const ext = extname(filename);
    const dir = join("test", "1000");
    t.equal(run(filename, "1 2", dir).stdout, "3", `${ext} 실행`);
  }
});

test("컴파일 언어 실행", (t) => {
  const filenames = ["main.c", "main.cpp", "main.cs", "main.go", "Main.java", "Main.kt", "main.rs", "problem.ts"];
  t.plan(filenames.length * 3);
  for (filename of filenames) {
    const ext = extname(filename);
    const objFilename = getObjFilename(filename);
    const dir = join("test", "1000");
    compile(filename, dir);
    t.equal(existsSync(join(dir, objFilename)), true, `${ext} 컴파일`);

    t.equal(run(filename, "1 2", dir).stdout, "3", `${ext} 실행`);

    restore(filename, dir);
    t.equal(existsSync(join(dir, objFilename)), false, `${ext} 제거`);
  }
});
