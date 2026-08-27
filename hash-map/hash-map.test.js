import test from "node:test";
import assert from "node:assert/strict";
import { getHash, HashMap } from "./hash-map.js";

test("1. Initial state", () => {
    const map = new HashMap();

    assert.equal(map.size(), 0);
    assert.equal(map.get("name"), undefined);
    assert.equal(map.has("name"), false);
});

test("2. Set and get value", () => {
    const map = new HashMap();

    map.set("name", "Samrat");

    assert.equal(map.get("name"), "Samrat");
    assert.equal(map.size(), 1);
});

test("3. Set multiple values", () => {
    const map = new HashMap();

    map.set("name", "Samrat");
    map.set("age", 25);
    map.set("city", "Kolkata");

    assert.equal(map.get("name"), "Samrat");
    assert.equal(map.get("age"), 25);
    assert.equal(map.get("city"), "Kolkata");
    assert.equal(map.size(), 3);
});

test("4. Update existing key", () => {
    const map = new HashMap();

    map.set("name", "Samrat");
    map.set("name", "John");

    assert.equal(map.get("name"), "John");
    assert.equal(map.size(), 1);
});

test("5. Has existing key", () => {
    const map = new HashMap();

    map.set("name", "Samrat");

    assert.equal(map.has("name"), true);
});

test("6. Has missing key", () => {
    const map = new HashMap();

    map.set("name", "Samrat");

    assert.equal(map.has("age"), false);
});

test("7. Get missing key", () => {
    const map = new HashMap();

    map.set("name", "Samrat");

    assert.equal(map.get("age"), undefined);
});

test("8. Handles undefined as a value", () => {
    const map = new HashMap();

    map.set("name", undefined);

    assert.equal(map.get("name"), undefined);
    assert.equal(map.has("name"), true);
    assert.equal(map.size(), 1);
});

test("9. Delete existing key", () => {
    const map = new HashMap();

    map.set("name", "Samrat");

    assert.equal(map.delete("name"), true);
    assert.equal(map.has("name"), false);
    assert.equal(map.get("name"), undefined);
    assert.equal(map.size(), 0);
});

test("10. Delete missing key", () => {
    const map = new HashMap();

    map.set("name", "Samrat");

    assert.equal(map.delete("age"), false);
    assert.equal(map.size(), 1);
    assert.equal(map.has("name"), true);
});

test("11. Delete one key from collision bucket", () => {
    const map = new HashMap(1);

    map.set("name", "Samrat");
    map.set("age", 25);
    map.set("city", "Kolkata");

    assert.equal(map.size(), 3);

    assert.equal(map.delete("age"), true);

    assert.equal(map.get("name"), "Samrat");
    assert.equal(map.get("city"), "Kolkata");
    assert.equal(map.has("age"), false);
    assert.equal(map.size(), 2);
});

test("12. Delete last item from bucket", () => {
    const map = new HashMap();

    map.set("name", "Samrat");

    assert.equal(map.delete("name"), true);
    assert.equal(map.size(), 0);
    assert.equal(map.has("name"), false);
});

test("13. Delete same key twice", () => {
    const map = new HashMap();

    map.set("name", "Samrat");

    assert.equal(map.delete("name"), true);
    assert.equal(map.delete("name"), false);
    assert.equal(map.size(), 0);
});

test("14. Clear map", () => {
    const map = new HashMap();

    map.set("name", "Samrat");
    map.set("age", 25);
    map.set("city", "Kolkata");

    map.clear();

    assert.equal(map.size(), 0);
    assert.equal(map.get("name"), undefined);
    assert.equal(map.get("age"), undefined);
    assert.equal(map.get("city"), undefined);

    assert.equal(map.has("name"), false);
    assert.equal(map.has("age"), false);
    assert.equal(map.has("city"), false);
});

test("15. Can use map after clear", () => {
    const map = new HashMap();

    map.set("name", "Samrat");
    map.clear();

    map.set("age", 25);

    assert.equal(map.get("age"), 25);
    assert.equal(map.has("age"), true);
    assert.equal(map.size(), 1);
});

test("16. getHash returns valid bucket index", () => {
    const size = 5;

    const hash = getHash("name", size);

    assert.equal(typeof hash, "number");
    assert.ok(hash >= 0);
    assert.ok(hash < size);
});

test("17. Different keys can coexist", () => {
    const map = new HashMap();

    map.set(1, "number");
    map.set("1", "string");

    assert.equal(map.get(1), "number");
    assert.equal(map.get("1"), "string");
    assert.equal(map.size(), 2);
});

test("18. Numeric keys", () => {
    const map = new HashMap();

    map.set(100, "hundred");
    map.set(200, "two hundred");

    assert.equal(map.get(100), "hundred");
    assert.equal(map.get(200), "two hundred");
    assert.equal(map.has(100), true);
    assert.equal(map.size(), 2);
});

test("19. Delete from collision bucket and preserve remaining keys", () => {
    const map = new HashMap(1);

    map.set("a", 10);
    map.set("b", 20);
    map.set("c", 30);

    map.delete("a");

    assert.equal(map.get("b"), 20);
    assert.equal(map.get("c"), 30);
    assert.equal(map.has("a"), false);
    assert.equal(map.size(), 2);
});

test("20. Size only counts unique keys", () => {
    const map = new HashMap();

    map.set("name", "Samrat");
    map.set("name", "John");
    map.set("name", "Alex");

    assert.equal(map.size(), 1);
    assert.equal(map.get("name"), "Alex");
});

console.log("\nHashMap tests starting...\n");