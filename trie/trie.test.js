import test from "node:test";
import assert from "node:assert/strict";
import { Trie } from "./trie.js";

test("1. Initial state", () => {
    const trie = new Trie();

    assert.equal(trie.search("cat"), false);
    assert.equal(trie.startsWith("cat"), false);
});

test("2. Insert and search single word", () => {
    const trie = new Trie();

    trie.insert("cat");

    assert.equal(trie.search("cat"), true);
});

test("3. Search unknown word", () => {
    const trie = new Trie();

    trie.insert("cat");

    assert.equal(trie.search("dog"), false);
});

test("4. Prefix is not a complete word", () => {
    const trie = new Trie();

    trie.insert("cater");

    assert.equal(trie.search("cat"), false);
    assert.equal(trie.search("cater"), true);
});

test("5. Insert multiple words", () => {
    const trie = new Trie();

    trie.insert("cat");
    trie.insert("dog");
    trie.insert("bird");

    assert.equal(trie.search("cat"), true);
    assert.equal(trie.search("dog"), true);
    assert.equal(trie.search("bird"), true);
});

test("6. Shared prefix", () => {
    const trie = new Trie();

    trie.insert("cat");
    trie.insert("car");

    assert.equal(trie.search("cat"), true);
    assert.equal(trie.search("car"), true);
    assert.equal(trie.search("can"), false);
});

test("7. One word is prefix of another", () => {
    const trie = new Trie();

    trie.insert("cat");
    trie.insert("cater");

    assert.equal(trie.search("cat"), true);
    assert.equal(trie.search("cater"), true);
});

test("8. startsWith existing prefix", () => {
    const trie = new Trie();

    trie.insert("cater");

    assert.equal(trie.startsWith("c"), true);
    assert.equal(trie.startsWith("ca"), true);
    assert.equal(trie.startsWith("cat"), true);
    assert.equal(trie.startsWith("cate"), true);
    assert.equal(trie.startsWith("cater"), true);
});

test("9. startsWith unknown prefix", () => {
    const trie = new Trie();

    trie.insert("cat");

    assert.equal(trie.startsWith("car"), false);
    assert.equal(trie.startsWith("dog"), false);
    assert.equal(trie.startsWith("x"), false);
});

test("10. Insert same word twice", () => {
    const trie = new Trie();

    trie.insert("cat");
    trie.insert("cat");

    assert.equal(trie.search("cat"), true);
});

test("11. Delete existing leaf word", () => {
    const trie = new Trie();

    trie.insert("cat");

    assert.equal(trie.delete("cat"), true);
    assert.equal(trie.search("cat"), false);
    assert.equal(trie.startsWith("cat"), false);
});

test("12. Delete word while longer word exists", () => {
    const trie = new Trie();

    trie.insert("cat");
    trie.insert("cater");

    assert.equal(trie.delete("cat"), true);

    assert.equal(trie.search("cat"), false);
    assert.equal(trie.search("cater"), true);
    assert.equal(trie.startsWith("cat"), true);
});

test("13. Delete one word with shared prefix", () => {
    const trie = new Trie();

    trie.insert("cat");
    trie.insert("car");

    assert.equal(trie.delete("cat"), true);

    assert.equal(trie.search("cat"), false);
    assert.equal(trie.search("car"), true);
    assert.equal(trie.startsWith("ca"), true);
});

test("14. Delete longer word while shorter prefix exists", () => {
    const trie = new Trie();

    trie.insert("cat");
    trie.insert("cater");

    assert.equal(trie.delete("cater"), true);

    assert.equal(trie.search("cater"), false);
    assert.equal(trie.search("cat"), true);
    assert.equal(trie.startsWith("cat"), true);
});

test("15. Delete non-existing word", () => {
    const trie = new Trie();

    trie.insert("cat");

    assert.equal(trie.delete("dog"), false);
    assert.equal(trie.search("cat"), true);
});

test("16. Delete same word twice", () => {
    const trie = new Trie();

    trie.insert("cat");

    assert.equal(trie.delete("cat"), true);
    assert.equal(trie.delete("cat"), false);
});

test("17. Delete prefix that was never a word", () => {
    const trie = new Trie();

    trie.insert("cater");

    assert.equal(trie.delete("cat"), false);
    assert.equal(trie.search("cater"), true);
});

test("18. Empty trie", () => {
    const trie = new Trie();

    assert.equal(trie.search(""), false);
    assert.equal(trie.startsWith("cat"), false);
    assert.equal(trie.delete("cat"), false);
});

test("19. Empty string insert", () => {
    const trie = new Trie();

    trie.insert("");

    assert.equal(trie.search(""), true);
    assert.equal(trie.startsWith(""), true);
});

test("20. Delete empty string", () => {
    const trie = new Trie();

    trie.insert("");

    assert.equal(trie.delete(""), true);
    assert.equal(trie.search(""), false);
});


console.log("\nTrie tests starting...\n");