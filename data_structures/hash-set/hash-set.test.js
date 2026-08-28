import test from "node:test";
import assert from "node:assert/strict";

import { HashSet } from "./hash-set.js";


test("1. Initial state", () => {
    const set = new HashSet(10);

    assert.equal(set.size(), 0);
    assert.equal(set.has("name"), false);
    assert.equal(set.has(10), false);
});



test("2. Add values", () => {
    const set = new HashSet(10);

    set.add("Samrat");
    set.add("Developer");
    set.add(100);

    assert.equal(set.has("Samrat"), true);
    assert.equal(set.has("Developer"), true);
    assert.equal(set.has(100), true);

    assert.equal(set.size(), 3);
});



test("3. Duplicate values should not increase size", () => {
    const set = new HashSet(10);

    set.add("A");
    set.add("A");
    set.add("A");

    assert.equal(set.has("A"), true);
    assert.equal(set.size(), 1);
});



test("4. has() should correctly find values", () => {
    const set = new HashSet(10);

    set.add("A");
    set.add("B");
    set.add("C");

    assert.equal(set.has("A"), true);
    assert.equal(set.has("B"), true);
    assert.equal(set.has("C"), true);

    assert.equal(set.has("D"), false);
    assert.equal(set.has("XYZ"), false);
});



test("5. Delete existing value", () => {
    const set = new HashSet(10);

    set.add("A");
    set.add("B");
    set.add("C");

    assert.equal(set.size(), 3);

    const result = set.delete("B");

    assert.equal(result, true);
    assert.equal(set.has("B"), false);
    assert.equal(set.has("A"), true);
    assert.equal(set.has("C"), true);
    assert.equal(set.size(), 2);
});



test("6. Delete missing value", () => {
    const set = new HashSet(10);

    set.add("A");
    set.add("B");

    const result = set.delete("XYZ");

    assert.equal(result, false);
    assert.equal(set.size(), 2);
    assert.equal(set.has("A"), true);
    assert.equal(set.has("B"), true);
});



test("7. Delete same value twice", () => {
    const set = new HashSet(10);

    set.add("A");

    assert.equal(set.delete("A"), true);
    assert.equal(set.delete("A"), false);

    assert.equal(set.size(), 0);
    assert.equal(set.has("A"), false);
});



test("8. Collision handling", () => {
    const set = new HashSet(5);

    /*
    With your hash function:

    hash("abc", 5) === 4
    hash("acb", 5) === 4
    */

    set.add("abc");
    set.add("acb");

    assert.equal(set.has("abc"), true);
    assert.equal(set.has("acb"), true);

    assert.equal(set.size(), 2);
});



test("9. Collision handling with delete", () => {
    const set = new HashSet(5);

    set.add("abc");
    set.add("acb");

    assert.equal(set.size(), 2);

    set.delete("abc");

    assert.equal(set.has("abc"), false);
    assert.equal(set.has("acb"), true);

    assert.equal(set.size(), 1);
});



test("10. Different types can coexist", () => {
    const set = new HashSet(5);

    set.add(10);
    set.add("10");

    assert.equal(set.has(10), true);
    assert.equal(set.has("10"), true);

    assert.equal(set.size(), 2);
});



test("11. Boolean values", () => {
    const set = new HashSet(10);

    set.add(true);
    set.add(false);

    assert.equal(set.has(true), true);
    assert.equal(set.has(false), true);

    assert.equal(set.size(), 2);
});


test("12. null and undefined", () => {
    const set = new HashSet(10);

    set.add(null);
    set.add(undefined);

    assert.equal(set.has(null), true);
    assert.equal(set.has(undefined), true);

    assert.equal(set.size(), 2);
});


test("13. Empty string", () => {
    const set = new HashSet(10);

    set.add("");

    assert.equal(set.has(""), true);
    assert.equal(set.size(), 1);

    assert.equal(set.delete(""), true);
    assert.equal(set.has(""), false);
    assert.equal(set.size(), 0);
});



test("14. Many values", () => {
    const set = new HashSet(10);

    for (let i = 1; i <= 100; i++) {
        set.add(`value-${i}`);
    }

    assert.equal(set.size(), 100);

    assert.equal(set.has("value-1"), true);
    assert.equal(set.has("value-50"), true);
    assert.equal(set.has("value-100"), true);
    assert.equal(set.has("value-101"), false);
});



test("15. Many values with duplicates", () => {
    const set = new HashSet(10);

    for (let i = 1; i <= 50; i++) {
        set.add(i);
    }

    for (let i = 1; i <= 50; i++) {
        set.add(i);
    }

    assert.equal(set.size(), 50);

    for (let i = 1; i <= 50; i++) {
        assert.equal(set.has(i), true);
    }
});


test("16. clear()", () => {
    const set = new HashSet(10);

    set.add("A");
    set.add("B");
    set.add("C");

    assert.equal(set.size(), 3);

    set.clear();

    assert.equal(set.size(), 0);

    assert.equal(set.has("A"), false);
    assert.equal(set.has("B"), false);
    assert.equal(set.has("C"), false);
});


test("17. Clear and reuse HashSet", () => {
    const set = new HashSet(10);

    set.add("A");
    set.add("B");

    set.clear();

    set.add("C");
    set.add("D");

    assert.equal(set.size(), 2);

    assert.equal(set.has("A"), false);
    assert.equal(set.has("B"), false);
    assert.equal(set.has("C"), true);
    assert.equal(set.has("D"), true);
});


test("18. Delete all values", () => {
    const set = new HashSet(10);

    set.add("A");
    set.add("B");
    set.add("C");
    set.add("D");

    assert.equal(set.size(), 4);

    assert.equal(set.delete("A"), true);
    assert.equal(set.delete("B"), true);
    assert.equal(set.delete("C"), true);
    assert.equal(set.delete("D"), true);

    assert.equal(set.size(), 0);

    assert.equal(set.has("A"), false);
    assert.equal(set.has("B"), false);
    assert.equal(set.has("C"), false);
    assert.equal(set.has("D"), false);
});


console.log("\nHashSet tests starting...\n");
