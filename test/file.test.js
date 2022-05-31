const { extname, determineDir, determineExt, getTestcases, getSrcFilename } = require("../lib/file");
const test = require("tape");
const { join } = require("path");

test("키워드를 포함한 디렉토리 중에 가장 짧은 디렉토리를 선택한다.", (t) => {
  t.plan(5);
  t.equal(determineDir("1000"), join("test", "1000"));
  t.equal(determineDir("10001"), join("test", "10001"));
  t.equal(determineDir("2000"), join("test", "2000"));
  t.equal(determineDir("20001"), join("test", "20001"));
  t.equal(determineDir("abcdefg"), null);
});

test("같은 길이라면 오름차순으로 선택한다.", (t) => {
  t.plan(2);
  t.equal(determineDir("000"), join("test", "1000"));
  t.equal(determineDir("0001"), join("test", "10001"));
});

test("확장자는 길이와 상관없이 오름차순으로 선택한다.", (t) => {
  t.plan(1);
  t.equal(determineExt(join("test", "1000")), "c");
});

test("선호하는 확장자를 넘겨줄 수 있다.", (t) => {
  t.plan(3);
  t.equal(determineExt(join("test", "1000"), ["py"]), "py");
  t.equal(determineExt(join("test", "1000"), ["js", "php"]), "js");
  t.equal(determineExt(join("test", "1000"), ["zk", "php"]), "php");
});

test("테스트케이스는 파일명에 '.in' 이나 'input' 를 포함한다.", (t) => {
  t.plan(1);
  t.deepEqual(getTestcases(join("test", "1000")), [
    {
      name: "1.in",
      input: "1.in",
      output: "1.out",
    },
  ]);
});

test("테스트케이스에 특정 키워드를 포함하도록 한다.", (t) => {
  t.plan(2);
  t.deepEqual(getTestcases(join("test", "3000"), "2"), [
    {
      name: "2.in",
      input: "2.in",
      output: "2.out",
    },
  ]);
  t.deepEqual(getTestcases(join("test", "3000"), "5"), []);
});

test("'main', 'index', 'problem' 순으로 불러온다.", (t) => {
  t.plan(3);
  t.equal(getSrcFilename(join("test", "1000"), "js"), "main.js");
  t.equal(getSrcFilename(join("test", "1000"), "cpp"), "main.cpp");
  t.equal(getSrcFilename(join("test", "2000"), "js"), null);
});

test("대소문자는 구분없이 검색하되 원래 파일명을 가져온다.", (t) => {
  t.plan(1);
  t.equal(getSrcFilename(join("test", "1000"), "java"), "Main.java");
});

test("확장자를 가져온다.", (t) => {
  t.plan(4);

  t.equal(extname(""), "");
  t.equal(extname(".js"), "js");
  t.equal(extname(".exe"), "exe");
  t.equal(extname("."), "");
});
