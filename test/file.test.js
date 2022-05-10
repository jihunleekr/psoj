const { getDir, getExt, getTestcases, getSourceFile } = require("../lib/file");
const test = require("tape");

test("키워드를 포함한 디렉토리 중에 가장 짧은 디렉토리를 선택한다.", (t) => {
  t.plan(5);
  t.equal(getDir("1000"), "./test/1000");
  t.equal(getDir("10001"), "./test/10001");
  t.equal(getDir("2000"), "./test/2000");
  t.equal(getDir("20001"), "./test/20001");
  t.equal(getDir("abcdefg"), null);
});

test("같은 길이라면 오름차순으로 선택한다.", (t) => {
  t.plan(2);
  t.equal(getDir("000"), "./test/1000");
  t.equal(getDir("0001"), "./test/10001");
});

test("확장자는 길이와 상관없이 오름차순으로 선택한다.", (t) => {
  t.plan(1);
  t.equal(getExt("./test/1000"), "cpp");
});

test("선호하는 확장자를 넘겨줄 수 있다.", (t) => {
  t.plan(3);
  t.equal(getExt("./test/1000", ["py"]), "py");
  t.equal(getExt("./test/1000", ["js", "php"]), "js");
  t.equal(getExt("./test/1000", ["zk", "php"]), "php");
});

test("테스트케이스는 파일명에 '.in' 이나 'input' 를 포함한다.", (t) => {
  t.plan(1);
  t.deepEqual(getTestcases("./test/1000"), [
    {
      name: "1.in",
      input: "1.in",
      output: "1.out",
    },
  ]);
});

test("'main', 'index', 'problem' 순으로 불러온다.", (t) => {
  t.plan(3);
  t.equal(getSourceFile("./test/1000", "js"), "main.js");
  t.equal(getSourceFile("./test/1000", "cpp"), "main.cpp");
  t.equal(getSourceFile("./test/2000", "js"), null);
});

test("대소문자는 구분없이 검색하되 원래 파일명을 가져온다.", (t) => {
  t.plan(1);
  t.equal(getSourceFile("./test/1000", "java"), "Main.java");
});
