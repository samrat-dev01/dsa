import assert from "node:assert/strict";
import test from "node:test";
import { Set } from "./set.js";


/* ==================================================
   1. INITIAL STATE
================================================== */

test("Set should start empty", () => {
    const set = new Set();

    assert.equal(set.size(), 0);
    assert.equal(set.has(10), false);
    assert.equal(set.has("hello"), false);
});


/* ==================================================
   2. ADD
================================================== */

test("add() should add values", () => {
    const set = new Set();

    set.add(10);
    set.add(20);
    set.add(30);

    assert.equal(set.has(10), true);
    assert.equal(set.has(20), true);
    assert.equal(set.has(30), true);

    assert.equal(set.size(), 3);
});


/* ==================================================
   3. DUPLICATES
================================================== */

test("add() should not add duplicate values", () => {
    const set = new Set();

    set.add(10);
    set.add(10);
    set.add(10);

    assert.equal(set.size(), 1);
    assert.equal(set.has(10), true);
});


test("duplicate values should not affect size", () => {
    const set = new Set();

    set.add(10);
    set.add(20);
    set.add(30);

    set.add(20);
    set.add(30);
    set.add(10);

    assert.equal(set.size(), 3);
});


/* ==================================================
   4. HAS
================================================== */

test("has() should return true for existing values", () => {
    const set = new Set();

    set.add(10);
    set.add(20);

    assert.equal(set.has(10), true);
    assert.equal(set.has(20), true);
});


test("has() should return false for missing values", () => {
    const set = new Set();

    set.add(10);
    set.add(20);

    assert.equal(set.has(30), false);
    assert.equal(set.has(999), false);
});


/* ==================================================
   5. DELETE
================================================== */

test("delete() should remove an existing value", () => {
    const set = new Set();

    set.add(10);
    set.add(20);
    set.add(30);

    assert.equal(set.delete(20), true);

    assert.equal(set.has(20), false);
    assert.equal(set.has(10), true);
    assert.equal(set.has(30), true);

    assert.equal(set.size(), 2);
});


test("delete() should return false for missing value", () => {
    const set = new Set();

    set.add(10);
    set.add(20);

    assert.equal(set.delete(999), false);

    assert.equal(set.size(), 2);
});


test("deleting the same value twice should return false the second time", () => {
    const set = new Set();

    set.add(10);

    assert.equal(set.delete(10), true);
    assert.equal(set.delete(10), false);

    assert.equal(set.size(), 0);
});


/* ==================================================
   6. DELETE FIRST / MIDDLE / LAST
================================================== */

test("delete() should correctly remove the first value", () => {
    const set = new Set();

    set.add(10);
    set.add(20);
    set.add(30);

    set.delete(10);

    assert.equal(set.has(10), false);
    assert.equal(set.has(20), true);
    assert.equal(set.has(30), true);
    assert.equal(set.size(), 2);
});


test("delete() should correctly remove the middle value", () => {
    const set = new Set();

    set.add(10);
    set.add(20);
    set.add(30);

    set.delete(20);

    assert.equal(set.has(10), true);
    assert.equal(set.has(20), false);
    assert.equal(set.has(30), true);
    assert.equal(set.size(), 2);
});


test("delete() should correctly remove the last value", () => {
    const set = new Set();

    set.add(10);
    set.add(20);
    set.add(30);

    set.delete(30);

    assert.equal(set.has(10), true);
    assert.equal(set.has(20), true);
    assert.equal(set.has(30), false);
    assert.equal(set.size(), 2);
});


/* ==================================================
   7. SINGLE VALUE
================================================== */

test("Set should work with a single value", () => {
    const set = new Set();

    set.add(100);

    assert.equal(set.size(), 1);
    assert.equal(set.has(100), true);

    assert.equal(set.delete(100), true);

    assert.equal(set.size(), 0);
    assert.equal(set.has(100), false);
});


/* ==================================================
   8. CLEAR
================================================== */

test("clear() should remove all values", () => {
    const set = new Set();

    set.add(10);
    set.add(20);
    set.add(30);

    set.clear();

    assert.equal(set.size(), 0);

    assert.equal(set.has(10), false);
    assert.equal(set.has(20), false);
    assert.equal(set.has(30), false);
});


test("clear() on an empty Set should remain empty", () => {
    const set = new Set();

    set.clear();

    assert.equal(set.size(), 0);
});


test("Set should be reusable after clear()", () => {
    const set = new Set();

    set.add(10);
    set.add(20);

    set.clear();

    set.add(30);

    assert.equal(set.size(), 1);
    assert.equal(set.has(30), true);
    assert.equal(set.has(10), false);
});


/* ==================================================
   9. DIFFERENT VALUE TYPES
================================================== */

test("Set should support different primitive values", () => {
    const set = new Set();

    set.add(0);
    set.add(false);
    set.add(true);
    set.add(null);
    set.add(undefined);
    set.add("hello");

    assert.equal(set.has(0), true);
    assert.equal(set.has(false), true);
    assert.equal(set.has(true), true);
    assert.equal(set.has(null), true);
    assert.equal(set.has(undefined), true);
    assert.equal(set.has("hello"), true);

    assert.equal(set.size(), 6);
});


/* ==================================================
   10. STRICT EQUALITY
================================================== */

test("Set should distinguish different primitive types", () => {
    const set = new Set();

    set.add(1);
    set.add("1");
    set.add(true);
    set.add("true");

    assert.equal(set.size(), 4);

    assert.equal(set.has(1), true);
    assert.equal(set.has("1"), true);
    assert.equal(set.has(true), true);
    assert.equal(set.has("true"), true);
});


/* ==================================================
   11. OBJECT REFERENCES
================================================== */

test("Set should distinguish object references", () => {
    const set = new Set();

    const obj1 = { name: "Samrat" };
    const obj2 = { name: "Samrat" };

    set.add(obj1);
    set.add(obj2);

    assert.equal(set.size(), 2);

    assert.equal(set.has(obj1), true);
    assert.equal(set.has(obj2), true);
});


test("Set should recognize the same object reference", () => {
    const set = new Set();

    const obj = { name: "Samrat" };

    set.add(obj);

    assert.equal(set.has(obj), true);
    assert.equal(set.size(), 1);
});


/* ==================================================
   12. ARRAY REFERENCES
================================================== */

test("Set should distinguish array references", () => {
    const set = new Set();

    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3];

    set.add(arr1);
    set.add(arr2);

    assert.equal(set.size(), 2);
});


/* ==================================================
   13. MANY VALUES
================================================== */

test("Set should handle many values", () => {
    const set = new Set();

    for (let i = 1; i <= 100; i++) {
        set.add(i);
    }

    assert.equal(set.size(), 100);

    for (let i = 1; i <= 100; i++) {
        assert.equal(set.has(i), true);
    }
});


/* ==================================================
   14. MANY DUPLICATES
================================================== */

test("Set should ignore many duplicate values", () => {
    const set = new Set();

    for (let i = 0; i < 100; i++) {
        set.add(10);
    }

    assert.equal(set.size(), 1);
    assert.equal(set.has(10), true);
});


/* ==================================================
   15. DELETE MANY
================================================== */

test("Set should correctly delete many values", () => {
    const set = new Set();

    for (let i = 1; i <= 10; i++) {
        set.add(i);
    }

    set.delete(2);
    set.delete(5);
    set.delete(8);

    assert.equal(set.size(), 7);

    assert.equal(set.has(2), false);
    assert.equal(set.has(5), false);
    assert.equal(set.has(8), false);

    assert.equal(set.has(1), true);
    assert.equal(set.has(3), true);
    assert.equal(set.has(10), true);
});


/* ==================================================
   16. DELETE EVERYTHING
================================================== */

test("Set should become empty after deleting everything", () => {
    const set = new Set();

    set.add(10);
    set.add(20);
    set.add(30);

    set.delete(10);
    set.delete(20);
    set.delete(30);

    assert.equal(set.size(), 0);

    assert.equal(set.has(10), false);
    assert.equal(set.has(20), false);
    assert.equal(set.has(30), false);
});


/* ==================================================
   17. ADD AFTER DELETE
================================================== */

test("Set should allow adding a value again after deletion", () => {
    const set = new Set();

    set.add(10);

    assert.equal(set.delete(10), true);
    assert.equal(set.has(10), false);

    set.add(10);

    assert.equal(set.has(10), true);
    assert.equal(set.size(), 1);
});

console.log("\nSet tests starting...\n");