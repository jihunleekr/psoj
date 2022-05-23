const { equal, diff } = require("../lib/diff");
const test = require("tape");

test("실행 결과와 답안과 비교.", (t) => {
  t.plan(3);

  t.equal(equal("a", "b"), false, "틀려야함");
  t.equal(equal("a", "a"), true, "맞아야함");
  t.equal(equal("a", "a "), true, "뒷 공백과 관계없이 맞아야함");
});

test("비교 함수", (t) => {
  t.plan(2);
  t.deepEqual(diff("foo\nbar", "foo\nbaz"), [
    { count: 1, value: ["foo"] },
    { count: 1, added: undefined, removed: true, value: ["bar"] },
    { count: 1, added: true, removed: undefined, value: ["baz"] },
  ]);
  t.deepEqual(
    diff("foo\nbar", "foo"),
    [
      { count: 1, value: ["foo"] },
      { count: 1, added: undefined, removed: true, value: ["bar"] },
    ],
    "개행유무는 상관없다"
  );
});
