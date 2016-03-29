import test = require("tape");

import { generateScopeSelectors } from "./generateScopeSelectors";

test("generateScopeSelectors", (t) => {
  t.deepEqual(
    generateScopeSelectors([]),
    []);
  t.deepEqual(
    generateScopeSelectors([[".a", ".b"]]),
    [ '.a', '.b' ]);
  t.deepEqual(
    generateScopeSelectors([[".a", ".b"], [".a2", ".b2", ".c2"]]),
    [ '.a .a2', '.a .b2', '.a .c2', '.b .a2', '.b .b2', '.b .c2' ]);
  t.end()
});