import test from "node:test";
import assert from "node:assert/strict";

import { twoSumSorted } from "./two-sum-sorted.js";

test("twoSumSorted", async (t) => {

    // ─────────────────────────────────────────────
    // Basic correctness
    // ─────────────────────────────────────────────

    await t.test("should find a pair in the middle", () => {
        assert.equal(
            twoSumSorted([1, 2, 4, 6, 8, 9, 12], 14),
            true
        );
    });

    await t.test("should find a pair using first and last elements", () => {
        assert.equal(
            twoSumSorted([1, 2, 4, 6, 8, 9, 12], 13),
            true
        );
    });

    await t.test("should find a pair using adjacent elements", () => {
        assert.equal(
            twoSumSorted([1, 2, 4, 6, 8], 10),
            true
        );
    });

    await t.test("should return false when no pair exists", () => {
        assert.equal(
            twoSumSorted([1, 2, 4, 6, 8, 9, 12], 30),
            false
        );
    });

    // ─────────────────────────────────────────────
    // Boundary cases
    // ─────────────────────────────────────────────

    await t.test("should handle empty array", () => {
        assert.equal(
            twoSumSorted([], 10),
            false
        );
    });

    await t.test("should handle single-element array", () => {
        assert.equal(
            twoSumSorted([5], 10),
            false
        );
    });

    await t.test("should handle two elements when pair exists", () => {
        assert.equal(
            twoSumSorted([3, 7], 10),
            true
        );
    });

    await t.test("should handle two elements when pair does not exist", () => {
        assert.equal(
            twoSumSorted([3, 7], 11),
            false
        );
    });

    // ─────────────────────────────────────────────
    // Duplicate values
    // ─────────────────────────────────────────────

    await t.test("should find pair using duplicate values", () => {
        assert.equal(
            twoSumSorted([1, 2, 2, 4, 8], 4),
            true
        );
    });

    await t.test("should find two identical values", () => {
        assert.equal(
            twoSumSorted([1, 3, 3, 5], 6),
            true
        );
    });

    await t.test("should not reuse the same element", () => {
        assert.equal(
            twoSumSorted([5], 10),
            false
        );
    });

    await t.test("should handle all identical values", () => {
        assert.equal(
            twoSumSorted([5, 5, 5, 5], 10),
            true
        );
    });

    await t.test("should return false when identical values cannot make target", () => {
        assert.equal(
            twoSumSorted([5, 5, 5, 5], 11),
            false
        );
    });

    // ─────────────────────────────────────────────
    // Negative numbers
    // ─────────────────────────────────────────────

    await t.test("should handle negative numbers", () => {
        assert.equal(
            twoSumSorted([-10, -5, -2, 0, 3, 8], -7),
            true
        );
    });

    await t.test("should find pair with negative and positive number", () => {
        assert.equal(
            twoSumSorted([-10, -5, 0, 3, 7, 10], 5),
            true
        );
    });

    await t.test("should handle target zero", () => {
        assert.equal(
            twoSumSorted([-5, -2, 0, 2, 5], 0),
            true
        );
    });

    await t.test("should return false when no negative pair exists", () => {
        assert.equal(
            twoSumSorted([-10, -5, -2], 0),
            false
        );
    });

    // ─────────────────────────────────────────────
    // Target outside possible range
    // ─────────────────────────────────────────────

    await t.test("should return false when target is smaller than every possible pair", () => {
        assert.equal(
            twoSumSorted([5, 10, 15, 20], 4),
            false
        );
    });

    await t.test("should return false when target is greater than every possible pair", () => {
        assert.equal(
            twoSumSorted([1, 2, 3, 4], 20),
            false
        );
    });

    // ─────────────────────────────────────────────
    // Pointer movement cases
    // ─────────────────────────────────────────────

    await t.test("should move left pointer when sum is too small", () => {
        assert.equal(
            twoSumSorted([1, 2, 4, 8, 16], 18),
            true
        );
    });

    await t.test("should move right pointer when sum is too large", () => {
        assert.equal(
            twoSumSorted([1, 4, 8, 12, 20], 13),
            true
        );
    });

    await t.test("should require multiple pointer movements", () => {
        assert.equal(
            twoSumSorted([1, 3, 5, 7, 9, 11], 12),
            true
        );
    });

    await t.test("should return false after both pointers converge", () => {
        assert.equal(
            twoSumSorted([1, 2, 4, 8, 16], 15),
            false
        );
    });

    // ─────────────────────────────────────────────
    // Larger input
    // ─────────────────────────────────────────────

    await t.test("should handle a large sorted array", () => {
        const arr = Array.from(
            { length: 100_000 },
            (_, index) => index
        );

        assert.equal(
            twoSumSorted(arr, 199_997),
            true
        );
    });

    await t.test("should handle a large array when pair does not exist", () => {
        const arr = Array.from(
            { length: 100_000 },
            (_, index) => index
        );

        assert.equal(
            twoSumSorted(arr, 200_000),
            false
        );
    });

    // ─────────────────────────────────────────────
    // Performance sanity check
    // ─────────────────────────────────────────────

    await t.test("should process large input efficiently", () => {
        const arr = Array.from(
            { length: 1_000_000 },
            (_, index) => index
        );

        const start = performance.now();

        const result = twoSumSorted(arr, 1_999_997);

        const elapsed = performance.now() - start;

        assert.equal(result, true);

        // Performance sanity check.
        // This does NOT mathematically prove O(n).
        assert.ok(
            elapsed < 100,
            `Two pointers took ${elapsed.toFixed(2)}ms`
        );
    });
});

console.log("\nTwo Sum Sorted tests starting...\n");