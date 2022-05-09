const { getObjectFile, compile, restore, run } = require("../lib/run");
const test = require("tape");
const { existsSync } = require("fs");

test("실행파일은 확장자를 제거하여 만든다. (자바는 예외)", (t) => {
  t.plan(2);
  t.equal(getObjectFile("Main.cpp", "cpp"), "Main");
  t.equal(getObjectFile("Main.java", "java"), "Main.class");
});

test("실행 테스트: php", (t) => {
  t.plan(1);
  t.equal(run("main.php", "php", "1 2", "./test/1000"), "3", "실행");
});

test("실행 테스트: js", (t) => {
  t.plan(1);
  t.equal(run("main.js", "js", "1 2", "./test/1000"), "3", "실행");
});

test("실행 테스트: py", (t) => {
  t.plan(1);
  t.equal(run("main.py", "py", "1 2", "./test/1000"), "3", "실행");
});

test("실행 테스트: rb", (t) => {
  t.plan(1);
  t.equal(run("main.rb", "rb", "1 2", "./test/1000"), "3", "실행");
});

test("실행 테스트: java", (t) => {
  t.plan(3);

  compile("Main.java", "java", "./test/1000");
  t.equal(existsSync("./test/1000/Main.class"), true, "컴파일");

  t.equal(run("Main.java", "java", "1 2", "./test/1000"), "3", "실행");

  restore("Main.java", "java", "./test/1000");
  t.equal(existsSync("./test/1000/Main.class"), false, "제거");
});

test("실행 테스트: cpp", (t) => {
  t.plan(3);

  compile("main.cpp", "cpp", "./test/1000");
  t.equal(existsSync("./test/1000/main"), true, "컴파일");

  t.equal(run("main.cpp", "cpp", "1 2", "./test/1000"), "3", "실행");

  restore("main.cpp", "cpp", "./test/1000");
  t.equal(existsSync("./test/1000/main"), false, "제거");
});
