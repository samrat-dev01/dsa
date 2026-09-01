import test from "node:test";
import assert from "node:assert/strict";

import { longestUniqueSubstring } from "./longest-unique-substring.js";

test("longestUniqueSubstring", async (t) => {

    // ─────────────────────────────────────────────
    // Basic correctness
    // ─────────────────────────────────────────────

    await t.test("should find longest substring without duplicates", () => {
        assert.equal(
            longestUniqueSubstring("abcabcbb"),
            3
        );
    });

    await t.test("should handle all unique characters", () => {
        assert.equal(
            longestUniqueSubstring("abcdef"),
            6
        );
    });

    await t.test("should handle all duplicate characters", () => {
        assert.equal(
            longestUniqueSubstring("aaaaa"),
            1
        );
    });

    await t.test("should handle repeated characters", () => {
        assert.equal(
            longestUniqueSubstring("pwwkew"),
            3
        );
    });

    // ─────────────────────────────────────────────
    // Boundary cases
    // ─────────────────────────────────────────────

    await t.test("should handle empty string", () => {
        assert.equal(
            longestUniqueSubstring(""),
            0
        );
    });

    await t.test("should handle single character", () => {
        assert.equal(
            longestUniqueSubstring("a"),
            1
        );
    });

    await t.test("should handle two unique characters", () => {
        assert.equal(
            longestUniqueSubstring("ab"),
            2
        );
    });

    await t.test("should handle two identical characters", () => {
        assert.equal(
            longestUniqueSubstring("aa"),
            1
        );
    });

    // ─────────────────────────────────────────────
    // Duplicate handling
    // ─────────────────────────────────────────────

    await t.test("should shrink window when duplicate appears", () => {
        assert.equal(
            longestUniqueSubstring("abba"),
            2
        );
    });

    await t.test("should handle duplicate at the beginning", () => {
        assert.equal(
            longestUniqueSubstring("aabc"),
            3
        );
    });

    await t.test("should handle duplicate at the end", () => {
        assert.equal(
            longestUniqueSubstring("abca"),
            3
        );
    });

    await t.test("should handle duplicate in the middle", () => {
        assert.equal(
            longestUniqueSubstring("abcdaef"),
            6
        );
    });

    // ─────────────────────────────────────────────
    // Spaces and special characters
    // ─────────────────────────────────────────────

    await t.test("should treat spaces as characters", () => {
        assert.equal(
            longestUniqueSubstring("a b c"),
            3
        );
    });

    await t.test("should handle spaces between duplicate characters", () => {
        assert.equal(
            longestUniqueSubstring("a a"),
            2
        );
    });

    await t.test("should handle special characters", () => {
        assert.equal(
            longestUniqueSubstring("!@#$!"),
            4
        );
    });

    // ─────────────────────────────────────────────
    // Case sensitivity
    // ─────────────────────────────────────────────

    await t.test("should treat uppercase and lowercase as different characters", () => {
        assert.equal(
            longestUniqueSubstring("aA"),
            2
        );
    });

    await t.test("should handle mixed case characters", () => {
        assert.equal(
            longestUniqueSubstring("aAbBcC"),
            6
        );
    });

    // ─────────────────────────────────────────────
    // Longer patterns
    // ─────────────────────────────────────────────

    await t.test("should find longest unique substring in a longer string", () => {
        assert.equal(
            longestUniqueSubstring("dvdf"),
            3
        );
    });

    await t.test("should handle repeated patterns", () => {
        assert.equal(
            longestUniqueSubstring("abcdeabc"),
            5
        );
    });

    await t.test("should handle a unique substring after repeated characters", () => {
        assert.equal(
            longestUniqueSubstring("aaaaabcdef"),
            6
        );
    });

    // ─────────────────────────────────────────────
    // Unicode
    // ─────────────────────────────────────────────

    await t.test("should handle unicode characters", () => {
        assert.equal(
            longestUniqueSubstring("😀😃😄😁"),
            4
        );
    });

    // ─────────────────────────────────────────────
    // Large input
    // ─────────────────────────────────────────────

    await t.test("should handle a large input", () => {
        const str = "abcdefghijklmnopqrstuvwxyz".repeat(10_000);

        assert.equal(
            longestUniqueSubstring(str),
            26
        );
    });

    // ─────────────────────────────────────────────
    // Performance sanity check
    // ─────────────────────────────────────────────

    await t.test("should process large input efficiently", () => {
        const str = "abcdefghijklmnopqrstuvwxyz".repeat(10_000);

        const start = performance.now();

        const result = longestUniqueSubstring(str);

        const elapsed = performance.now() - start;

        assert.equal(result, 26);

        // Performance sanity check.
        // This does NOT mathematically prove O(n).
        assert.ok(
            elapsed < 100,
            `Sliding window took ${elapsed.toFixed(2)}ms`
        );
    });

    // ─────────────────────────────────────────────
    // Input behavior
    // ─────────────────────────────────────────────

    await t.test("should not modify the input string", () => {
        const str = "abcabcbb";
        const original = str;

        longestUniqueSubstring(str);

        assert.equal(str, original);
    });
});

console.log("\nLongest Unique Substring tests starting...\n");