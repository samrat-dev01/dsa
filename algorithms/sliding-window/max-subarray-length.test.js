import test from "node:test";
import assert from "node:assert/strict";

import { maxSubarrayLength } from "./max-subarray-length.js";

test("maxSubarrayLength", async (t) => {

    // ─────────────────────────────────────────────
    // Basic correctness
    // ─────────────────────────────────────────────

    await t.test("should find the maximum length window", () => {
        assert.equal(
            maxSubarrayLength([1, 2, 1, 1, 1], 4),
            3
        );
    });

    await t.test("should find the entire array when its sum is valid", () => {
        assert.equal(
            maxSubarrayLength([1, 1, 1, 1], 4),
            4
        );
    });

    await t.test("should find a single valid element", () => {
        assert.equal(
            maxSubarrayLength([5, 1, 1], 5),
            2
        );
    });

    await t.test("should return zero when no window is valid", () => {
        assert.equal(
            maxSubarrayLength([5, 6, 7], 4),
            0
        );
    });

    // ─────────────────────────────────────────────
    // Boundary cases
    // ─────────────────────────────────────────────

    await t.test("should handle empty array", () => {
        assert.equal(
            maxSubarrayLength([], 10),
            0
        );
    });

    await t.test("should handle single-element array when valid", () => {
        assert.equal(
            maxSubarrayLength([5], 5),
            1
        );
    });

    await t.test("should handle single-element array when invalid", () => {
        assert.equal(
            maxSubarrayLength([10], 5),
            0
        );
    });

    await t.test("should handle two elements", () => {
        assert.equal(
            maxSubarrayLength([2, 3], 5),
            2
        );
    });

    // ─────────────────────────────────────────────
    // Exact target
    // ─────────────────────────────────────────────

    await t.test("should include a window whose sum exactly equals k", () => {
        assert.equal(
            maxSubarrayLength([2, 3, 4], 5),
            2
        );
    });

    await t.test("should allow the entire array when sum exactly equals k", () => {
        assert.equal(
            maxSubarrayLength([2, 1, 2], 5),
            3
        );
    });

    // ─────────────────────────────────────────────
    // Shrinking behavior
    // ─────────────────────────────────────────────

    await t.test("should shrink when sum exceeds k", () => {
        assert.equal(
            maxSubarrayLength([2, 3, 5, 1], 6),
            2
        );
    });

    await t.test("should continue shrinking until the window becomes valid", () => {
        assert.equal(
            maxSubarrayLength([5, 1, 1, 1], 3),
            3
        );
    });

    await t.test("should find a longer window after shrinking", () => {
        assert.equal(
            maxSubarrayLength([1, 1, 5, 1, 1, 1], 3),
            3
        );
    });

    // ─────────────────────────────────────────────
    // Multiple valid windows
    // ─────────────────────────────────────────────

    await t.test("should keep the longest valid window", () => {
        assert.equal(
            maxSubarrayLength([1, 2, 1, 2, 1], 4),
            3
        );
    });

    await t.test("should update maximum when a later window is longer", () => {
        assert.equal(
            maxSubarrayLength([5, 1, 1, 1, 1], 4),
            4
        );
    });

    await t.test("should not replace the maximum with a shorter window", () => {
        assert.equal(
            maxSubarrayLength([1, 1, 1, 5], 3),
            3
        );
    });

    // ─────────────────────────────────────────────
    // Duplicate values
    // ─────────────────────────────────────────────

    await t.test("should handle duplicate values", () => {
        assert.equal(
            maxSubarrayLength([2, 2, 2, 2], 4),
            2
        );
    });

    await t.test("should handle all ones", () => {
        assert.equal(
            maxSubarrayLength([1, 1, 1, 1, 1], 3),
            3
        );
    });

    // ─────────────────────────────────────────────
    // Target values
    // ─────────────────────────────────────────────

    await t.test("should handle k equal to zero", () => {
        assert.equal(
            maxSubarrayLength([1, 2, 3], 0),
            0
        );
    });

    await t.test("should handle a very large k", () => {
        assert.equal(
            maxSubarrayLength([1, 2, 3, 4, 5], 100),
            5
        );
    });

    // ─────────────────────────────────────────────
    // Larger values
    // ─────────────────────────────────────────────

    await t.test("should handle large element values", () => {
        assert.equal(
            maxSubarrayLength([100, 200, 300, 400], 500),
            2
        );
    });

    await t.test("should handle a large valid window", () => {
        assert.equal(
            maxSubarrayLength([10, 10, 10, 10, 10], 30),
            3
        );
    });

    // ─────────────────────────────────────────────
    // Large input
    // ─────────────────────────────────────────────

    await t.test("should handle a large input", () => {
        const arr = Array.from(
            { length: 100_000 },
            () => 1
        );

        assert.equal(
            maxSubarrayLength(arr, 50_000),
            50_000
        );
    });

    await t.test("should handle a large input where the entire array is valid", () => {
        const arr = Array.from(
            { length: 100_000 },
            () => 1
        );

        assert.equal(
            maxSubarrayLength(arr, 100_000),
            100_000
        );
    });

    // ─────────────────────────────────────────────
    // Performance sanity check
    // ─────────────────────────────────────────────

    await t.test("should process large input efficiently", () => {
        const arr = Array.from(
            { length: 1_000_000 },
            () => 1
        );

        const start = performance.now();

        const result = maxSubarrayLength(arr, 500_000);

        const elapsed = performance.now() - start;

        assert.equal(result, 500_000);

        // Performance sanity check.
        // This does NOT mathematically prove O(n).
        assert.ok(
            elapsed < 100,
            `Sliding window took ${elapsed.toFixed(2)}ms`
        );
    });

    // ─────────────────────────────────────────────
    // Input immutability
    // ─────────────────────────────────────────────

    await t.test("should not modify the input array", () => {
        const arr = [1, 2, 1, 1, 1];
        const original = [...arr];

        maxSubarrayLength(arr, 4);

        assert.deepEqual(arr, original);
    });
});

console.log("\nMaximum Subarray Length tests starting...\n");