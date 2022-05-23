const { lines } = require("../lib/print");
const test = require("tape");

test("라인 출력", (t) => {
  t.plan(1);
  t.equal(lines(["foo", "bar"], "-"), "-   foo".padEnd(80, " ") + "\n" + "-   bar".padEnd(80, " "));
});
