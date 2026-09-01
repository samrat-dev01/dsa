import test from "node:test";
import assert from "node:assert/strict";
import { minWindow } from "./minimum-window.js";


test("minWindow", async (t) => {

    // ─────────────────────────────────────────────
    // Basic correctness
    // ─────────────────────────────────────────────

    await t.test("should find the minimum window", () => {
        assert.equal(
            minWindow("ADOBECODEBANC", "ABC"),
            "BANC"
        );
    });

    await t.test("should find an exact match", () => {
        assert.equal(
            minWindow("ABC", "ABC"),
            "ABC"
        );
    });

    await t.test("should find a single character window", () => {
        assert.equal(
            minWindow("a", "a"),
            "a"
        );
    });

    await t.test("should return empty string when target cannot be found", () => {
        assert.equal(
            minWindow("abc", "d"),
            ""
        );
    });

    // ─────────────────────────────────────────────
    // Boundary cases
    // ─────────────────────────────────────────────

    await t.test("should handle empty source string", () => {
        assert.equal(
            minWindow("", "abc"),
            ""
        );
    });

    await t.test("should handle empty target string", () => {
        assert.equal(
            minWindow("abc", ""),
            ""
        );
    });

    await t.test("should handle single character source and target", () => {
        assert.equal(
            minWindow("a", "a"),
            "a"
        );
    });

    await t.test("should return empty when source is shorter than target", () => {
        assert.equal(
            minWindow("ab", "abc"),
            ""
        );
    });

    // ─────────────────────────────────────────────
    // Duplicate characters in target
    // ─────────────────────────────────────────────

    await t.test("should handle duplicate characters in target", () => {
        assert.equal(
            minWindow("ADOBECODEBANC", "AABC"),
            "ADOBECODEBA"
        );
    });

    await t.test("should find window when target contains duplicates", () => {
        assert.equal(
            minWindow("AAOBECODEBANC", "AABC"),
            "AAOBEC"
        );
    });

    await t.test("should handle target with repeated character", () => {
        assert.equal(
            minWindow("aabbcc", "aa"),
            "aa"
        );
    });

    await t.test("should return empty when required frequency is unavailable", () => {
        assert.equal(
            minWindow("abc", "aa"),
            ""
        );
    });

    // ─────────────────────────────────────────────
    // Window shrinking
    // ─────────────────────────────────────────────

    await t.test("should shrink the window after becoming valid", () => {
        assert.equal(
            minWindow("aaabc", "abc"),
            "abc"
        );
    });

    await t.test("should remove unnecessary characters from the left", () => {
        assert.equal(
            minWindow("xxabc", "abc"),
            "abc"
        );
    });

    await t.test("should find a smaller window after an earlier valid window", () => {
        assert.equal(
            minWindow("ADOBECODEBANCA", "ABC"),
            "BANC"
        );
    });

    // ─────────────────────────────────────────────
    // Multiple valid windows
    // ─────────────────────────────────────────────

    await t.test("should return the shortest valid window", () => {
        assert.equal(
            minWindow("abbbbbc", "abc"),
            "abbbbbc"
        );
    });

    await t.test("should choose the later shorter window", () => {
        assert.equal(
            minWindow("abcdebdca", "abc"),
            "abc"
        );
    });

    await t.test("should handle multiple possible starting positions", () => {
        assert.equal(
            minWindow("aaabdabcefaecbef", "abc"),
            "abc"
        );
    });

    // ─────────────────────────────────────────────
    // Character frequency
    // ─────────────────────────────────────────────

    await t.test("should respect required character frequency", () => {
        assert.equal(
            minWindow("aabbcc", "abc"),
            "abbc"
        );
    });

    await t.test("should handle multiple occurrences of required characters", () => {
        assert.equal(
            minWindow("aaabbbccc", "aabb"),
            "aabb"
        );
    });

    await t.test("should not count extra characters as required matches", () => {
        assert.equal(
            minWindow("aaaab", "ab"),
            "ab"
        );
    });

    // ─────────────────────────────────────────────
    // Spaces and special characters
    // ─────────────────────────────────────────────

    await t.test("should treat spaces as valid characters", () => {
        assert.equal(
            minWindow("a b c", " "),
            " "
        );
    });

    await t.test("should handle special characters", () => {
        assert.equal(
            minWindow("!!@@##", "@#"),
            "@#"
        );
    });

    await t.test("should handle uppercase and lowercase as different characters", () => {
        assert.equal(
            minWindow("aAbBcC", "Ab"),
            "Ab"
        );
    });

    // ─────────────────────────────────────────────
    // Unicode
    // ─────────────────────────────────────────────

    await t.test("should handle unicode characters", () => {
        assert.equal(
            minWindow("😀😃😄😁", "😃😄"),
            "😃😄"
        );
    });

    // ─────────────────────────────────────────────
    // Large input
    // ─────────────────────────────────────────────

    await t.test("should handle a large input", () => {
        const str = "x".repeat(100_000) + "abc";

        assert.equal(
            minWindow(str, "abc"),
            "abc"
        );
    });

    await t.test("should handle a large input with no valid window", () => {
        const str = "x".repeat(100_000);

        assert.equal(
            minWindow(str, "abc"),
            ""
        );
    });

    // ─────────────────────────────────────────────
    // Input behavior
    // ─────────────────────────────────────────────

    await t.test("should not modify the input strings", () => {
        const str = "ADOBECODEBANC";
        const target = "ABC";

        const originalStr = str;
        const originalTarget = target;

        minWindow(str, target);

        assert.equal(str, originalStr);
        assert.equal(target, originalTarget);
    });
});

console.log("\nMinimum Window tests starting...\n");