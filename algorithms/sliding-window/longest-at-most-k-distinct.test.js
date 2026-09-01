import assert from "node:assert/strict";
import test from "node:test";

import { longestAtMostKDistinct } from "./longest-at-most-k-distinct.js";

test("longestAtMostKDistinct", async (t) => {

    // ─────────────────────────────────────────────
    // Basic correctness
    // ─────────────────────────────────────────────

    await t.test("should find longest substring with at most k distinct characters", () => {
        assert.equal(
            longestAtMostKDistinct("eceba", 2),
            3
        );
    });

    await t.test("should return entire string when distinct characters are within k", () => {
        assert.equal(
            longestAtMostKDistinct("aabbcc", 3),
            6
        );
    });

    await t.test("should return one when k is one", () => {
        assert.equal(
            longestAtMostKDistinct("aaabbc", 1),
            3
        );
    });

    await t.test("should return zero when no valid character exists", () => {
        assert.equal(
            longestAtMostKDistinct("abc", 0),
            0
        );
    });

    // ─────────────────────────────────────────────
    // Boundary cases
    // ─────────────────────────────────────────────

    await t.test("should handle empty string", () => {
        assert.equal(
            longestAtMostKDistinct("", 2),
            0
        );
    });

    await t.test("should handle single character", () => {
        assert.equal(
            longestAtMostKDistinct("a", 1),
            1
        );
    });

    await t.test("should handle single character with k zero", () => {
        assert.equal(
            longestAtMostKDistinct("a", 0),
            0
        );
    });

    await t.test("should handle k greater than number of distinct characters", () => {
        assert.equal(
            longestAtMostKDistinct("abc", 10),
            3
        );
    });

    // ─────────────────────────────────────────────
    // Duplicate characters
    // ─────────────────────────────────────────────

    await t.test("should handle all identical characters", () => {
        assert.equal(
            longestAtMostKDistinct("aaaaaa", 1),
            6
        );
    });

    await t.test("should handle duplicate characters", () => {
        assert.equal(
            longestAtMostKDistinct("aabbcc", 2),
            4
        );
    });

    await t.test("should handle repeated pattern", () => {
        assert.equal(
            longestAtMostKDistinct("aabacbebebe", 3),
            7
        );
    });

    // ─────────────────────────────────────────────
    // Window shrinking
    // ─────────────────────────────────────────────

    await t.test("should shrink when distinct characters exceed k", () => {
        assert.equal(
            longestAtMostKDistinct("abc", 2),
            2
        );
    });

    await t.test("should shrink multiple times when necessary", () => {
        assert.equal(
            longestAtMostKDistinct("abcd", 1),
            1
        );
    });

    await t.test("should find a longer valid window after shrinking", () => {
        assert.equal(
            longestAtMostKDistinct("aabac", 2),
            4
        );
    });

    // ─────────────────────────────────────────────
    // Different k values
    // ─────────────────────────────────────────────

    await t.test("should handle k equal to one", () => {
        assert.equal(
            longestAtMostKDistinct("abbbcc", 1),
            3
        );
    });

    await t.test("should handle k equal to two", () => {
        assert.equal(
            longestAtMostKDistinct("aabbcc", 2),
            4
        );
    });

    await t.test("should handle k equal to all distinct characters", () => {
        assert.equal(
            longestAtMostKDistinct("abcdef", 6),
            6
        );
    });

    // ─────────────────────────────────────────────
    // Spaces and special characters
    // ─────────────────────────────────────────────

    await t.test("should treat spaces as characters", () => {
        assert.equal(
            longestAtMostKDistinct("a a a", 2),
            5
        );
    });

    await t.test("should handle special characters", () => {
        assert.equal(
            longestAtMostKDistinct("!!@@##", 2),
            4
        );
    });

    await t.test("should treat uppercase and lowercase as different characters", () => {
        assert.equal(
            longestAtMostKDistinct("aAbB", 2),
            2
        );
    });

    // ─────────────────────────────────────────────
    // Unicode
    // ─────────────────────────────────────────────

    await t.test("should handle unicode characters", () => {
        assert.equal(
            longestAtMostKDistinct("😀😃😄😀", 2),
            2
        );
    });

    // ─────────────────────────────────────────────
    // Large input
    // ─────────────────────────────────────────────

    await t.test("should handle a large input", () => {
        const str = "aabbcc".repeat(10_000);

        assert.equal(
            longestAtMostKDistinct(str, 2),
            4
        );
    });

    // ─────────────────────────────────────────────
    // Input behavior
    // ─────────────────────────────────────────────

    await t.test("should not modify the input string", () => {
        const str = "eceba";
        const original = str;

        longestAtMostKDistinct(str, 2);

        assert.equal(str, original);
    });
});

console.log("\nLongest At Most K Distinct tests starting...\n");