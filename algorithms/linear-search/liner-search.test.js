import { test } from "node:test";
import assert from "node:assert/strict";
import { linearSearch } from "./linear-search.js";

test("should return index when target exists", () => {
    assert.equal(linearSearch([10, 20, 30, 40], 30), 2);
});

test("should return -1 when target does not exist", () => {
    assert.equal(linearSearch([10, 20, 30, 40], 50), -1);
});

test("should return -1 for empty array", () => {
    assert.equal(linearSearch([], 10), -1);
});

test("should find target at first index", () => {
    assert.equal(linearSearch([10, 20, 30], 10), 0);
});

test("should find target at last index", () => {
    assert.equal(linearSearch([10, 20, 30], 30), 2);
});

test("should return first occurrence when duplicates exist", () => {
    assert.equal(linearSearch([10, 20, 20, 30], 20), 1);
});

test("should work with strings", () => {
    assert.equal(linearSearch(["a", "b", "c"], "b"), 1);
});

test("should use strict equality", () => {
    assert.equal(linearSearch([1, 2, 3], "2"), -1);
});



console.log("\nLinear Search tests starting...\n");