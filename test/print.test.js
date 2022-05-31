const { lines, pluralize } = require("../lib/print");
const test = require("tape");

test("라인 출력", (t) => {
  t.plan(1);
  t.equal(lines(["foo", "bar"], "-"), "-   foo".padEnd(80, " ") + "\n" + "-   bar".padEnd(80, " "));
});

test("복수형 출력", (t) => {
  t.plan(2);
  t.equal(pluralize("case", 3), "cases");
  t.equal(pluralize("case", 1), "case");
});
