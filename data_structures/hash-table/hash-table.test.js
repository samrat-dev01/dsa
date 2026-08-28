import assert from "node:assert/strict";
import test from "node:test";
import { getHash, HashTable } from "./hash-table.js";


/* ==================================================
   HASH FUNCTION
================================================== */

test("hash function returns valid bucket indexes", () => {
    const size = 5;

    const values = [
        getHash("abc", size),
        getHash("hello", size),
        getHash("Samrat", size),
        getHash("javascript", size),
        getHash("data structure", size),
    ];

    for (const value of values) {
        assert.ok(value >= 0);
        assert.ok(value < size);
    }
});


test("same key should produce same hash", () => {
    assert.equal(
        getHash("abc", 10),
        getHash("abc", 10)
    );
});


/* ==================================================
   INITIAL STATE
================================================== */

test("new HashTable should start empty", () => {
    const table = new HashTable(10);

    assert.equal(table.size, 0);
    assert.equal(table.get("name"), undefined);
    assert.equal(table.has("name"), false);
});


/* ==================================================
   SET
================================================== */

test("set() should store a key/value pair", () => {
    const table = new HashTable(10);

    table.set("name", "Samrat");

    assert.equal(table.get("name"), "Samrat");
    assert.equal(table.size, 1);
});


test("set() should store multiple values", () => {
    const table = new HashTable(10);

    table.set("name", "Samrat");
    table.set("age", 25);
    table.set("city", "Kolkata");

    assert.equal(table.get("name"), "Samrat");
    assert.equal(table.get("age"), 25);
    assert.equal(table.get("city"), "Kolkata");

    assert.equal(table.size, 3);
});


/* ==================================================
   GET
================================================== */

test("get() should return undefined for missing key", () => {
    const table = new HashTable(10);

    table.set("name", "Samrat");

    assert.equal(table.get("unknown"), undefined);
});


test("get() should return the correct value", () => {
    const table = new HashTable(10);

    table.set("name", "Samrat");

    assert.equal(table.get("name"), "Samrat");
});


/* ==================================================
   UPDATE EXISTING KEY
================================================== */

test("set() should update an existing key", () => {
    const table = new HashTable(10);

    table.set("name", "Samrat");
    table.set("name", "John");

    assert.equal(table.get("name"), "John");
});


test("updating an existing key should not increase size", () => {
    const table = new HashTable(10);

    table.set("name", "Samrat");

    assert.equal(table.size, 1);

    table.set("name", "John");

    assert.equal(table.size, 1);
});


test("multiple updates should keep size unchanged", () => {
    const table = new HashTable(10);

    table.set("name", "Samrat");
    table.set("name", "John");
    table.set("name", "Alice");
    table.set("name", "Bob");

    assert.equal(table.get("name"), "Bob");
    assert.equal(table.size, 1);
});


/* ==================================================
   HAS
================================================== */

test("has() should return true for existing key", () => {
    const table = new HashTable(10);

    table.set("name", "Samrat");

    assert.equal(table.has("name"), true);
});


test("has() should return false for missing key", () => {
    const table = new HashTable(10);

    assert.equal(table.has("name"), false);
});


test("has() should work after updating a key", () => {
    const table = new HashTable(10);

    table.set("name", "Samrat");
    table.set("name", "John");

    assert.equal(table.has("name"), true);
});


/* ==================================================
   COLLISION
================================================== */

test("hash function should allow collisions", () => {
    assert.equal(
        getHash("abc", 5),
        getHash("acb", 5)
    );
});


test("HashTable should handle collisions", () => {
    const table = new HashTable(5);

    table.set("abc", "value-1");
    table.set("acb", "value-2");

    assert.equal(table.get("abc"), "value-1");
    assert.equal(table.get("acb"), "value-2");

    assert.equal(table.size, 2);
});


test("updating one colliding key should not affect another", () => {
    const table = new HashTable(5);

    table.set("abc", "value-1");
    table.set("acb", "value-2");

    table.set("abc", "updated");

    assert.equal(table.get("abc"), "updated");
    assert.equal(table.get("acb"), "value-2");

    assert.equal(table.size, 2);
});


test("deleting one colliding key should not affect another", () => {
    const table = new HashTable(5);

    table.set("abc", "value-1");
    table.set("acb", "value-2");

    table.delete("abc");

    assert.equal(table.get("abc"), undefined);
    assert.equal(table.get("acb"), "value-2");

    assert.equal(table.size, 1);
});


/* ==================================================
   DELETE
================================================== */

test("delete() should remove an existing key", () => {
    const table = new HashTable(10);

    table.set("name", "Samrat");

    assert.equal(table.delete("name"), true);
    assert.equal(table.get("name"), undefined);
    assert.equal(table.has("name"), false);
});


test("delete() should decrease size", () => {
    const table = new HashTable(10);

    table.set("name", "Samrat");
    table.set("age", 25);

    assert.equal(table.size, 2);

    table.delete("name");

    assert.equal(table.size, 1);
});


test("delete() should return false for missing key", () => {
    const table = new HashTable(10);

    assert.equal(table.delete("unknown"), false);
    assert.equal(table.size, 0);
});


test("delete() should only decrease size when key exists", () => {
    const table = new HashTable(10);

    table.set("name", "Samrat");

    assert.equal(table.size, 1);

    table.delete("unknown");

    assert.equal(table.size, 1);
});


test("delete() should work when deleting the only item", () => {
    const table = new HashTable(10);

    table.set("name", "Samrat");

    assert.equal(table.delete("name"), true);

    assert.equal(table.size, 0);
    assert.equal(table.get("name"), undefined);
    assert.equal(table.has("name"), false);
});


/* ==================================================
   DIFFERENT VALUE TYPES
================================================== */

test("HashTable should store different value types", () => {
    const table = new HashTable(10);

    const object = { name: "Samrat" };
    const array = [1, 2, 3];

    table.set("number", 100);
    table.set("string", "hello");
    table.set("boolean", true);
    table.set("null", null);
    table.set("object", object);
    table.set("array", array);

    assert.equal(table.get("number"), 100);
    assert.equal(table.get("string"), "hello");
    assert.equal(table.get("boolean"), true);
    assert.equal(table.get("null"), null);

    assert.strictEqual(table.get("object"), object);
    assert.strictEqual(table.get("array"), array);

    assert.equal(table.size, 6);
});


/* ==================================================
   EMPTY STRING
================================================== */

test("HashTable should support empty string as key", () => {
    const table = new HashTable(10);

    table.set("", "empty");

    assert.equal(table.get(""), "empty");
    assert.equal(table.has(""), true);
    assert.equal(table.size, 1);
});


/* ==================================================
   MANY VALUES
================================================== */

test("HashTable should store many values", () => {
    const table = new HashTable(10);

    for (let i = 1; i <= 20; i++) {
        table.set(`key-${i}`, `value-${i}`);
    }

    assert.equal(table.size, 20);

    for (let i = 1; i <= 20; i++) {
        assert.equal(
            table.get(`key-${i}`),
            `value-${i}`
        );
    }
});


/* ==================================================
   MANY VALUES + UPDATE
================================================== */

test("updating one key among many should not affect others", () => {
    const table = new HashTable(10);

    for (let i = 1; i <= 20; i++) {
        table.set(`key-${i}`, `value-${i}`);
    }

    table.set("key-10", "UPDATED");

    assert.equal(table.get("key-10"), "UPDATED");

    assert.equal(table.get("key-9"), "value-9");
    assert.equal(table.get("key-11"), "value-11");

    assert.equal(table.size, 20);
});


/* ==================================================
   DELETE MANY
================================================== */

test("delete() should correctly remove multiple keys", () => {
    const table = new HashTable(10);

    for (let i = 1; i <= 10; i++) {
        table.set(`key-${i}`, `value-${i}`);
    }

    table.delete("key-2");
    table.delete("key-5");
    table.delete("key-8");

    assert.equal(table.size, 7);

    assert.equal(table.get("key-2"), undefined);
    assert.equal(table.get("key-5"), undefined);
    assert.equal(table.get("key-8"), undefined);

    assert.equal(table.get("key-1"), "value-1");
    assert.equal(table.get("key-3"), "value-3");
    assert.equal(table.get("key-10"), "value-10");
});


console.log("\nHashTable tests starting...\n");