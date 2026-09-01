import test from "node:test";
import assert from "node:assert/strict";

import { minSubArrayLen } from "./minimum-subarray-length.js";

test("minSubArrayLen", async (t) => {

    // ─────────────────────────────────────────────
    // Basic correctness
    // ─────────────────────────────────────────────

    await t.test("should find minimum subarray length", () => {
        assert.equal(
            minSubArrayLen([2, 3, 1, 2, 4, 3], 7),
            2
        );
    });

    await t.test("should return one when a single element reaches target", () => {
        assert.equal(
            minSubArrayLen([1, 4, 4], 4),
            1
        );
    });

    await t.test("should return zero when no valid subarray exists", () => {
        assert.equal(
            minSubArrayLen([1, 1, 1, 1], 10),
            0
        );
    });

    // ─────────────────────────────────────────────
    // Boundary cases
    // ─────────────────────────────────────────────

    await t.test("should handle empty array", () => {
        assert.equal(
            minSubArrayLen([], 7),
            0
        );
    });

    await t.test("should handle single element when valid", () => {
        assert.equal(
            minSubArrayLen([10], 7),
            1
        );
    });

    await t.test("should handle single element when invalid", () => {
        assert.equal(
            minSubArrayLen([5], 7),
            0
        );
    });

    await t.test("should handle two elements", () => {
        assert.equal(
            minSubArrayLen([3, 4], 7),
            2
        );
    });

    await t.test("should return one when target equals first element", () => {
        assert.equal(
            minSubArrayLen([7, 10, 20], 7),
            1
        );
    });

    // ─────────────────────────────────────────────
    // Exact target
    // ─────────────────────────────────────────────

    await t.test("should handle sum exactly equal to target", () => {
        assert.equal(
            minSubArrayLen([2, 3, 2], 5),
            2
        );
    });

    await t.test("should find exact target in the middle", () => {
        assert.equal(
            minSubArrayLen([5, 1, 2, 4, 3], 6),
            2
        );
    });

    // ─────────────────────────────────────────────
    // Multiple possible windows
    // ─────────────────────────────────────────────

    await t.test("should choose the shortest valid window", () => {
        assert.equal(
            minSubArrayLen([1, 2, 3, 4, 5], 11),
            3
        );
    });

    await t.test("should update answer multiple times", () => {
        assert.equal(
            minSubArrayLen([1, 1, 1, 10, 1, 1], 10),
            1
        );
    });

    await t.test("should shrink the window as much as possible", () => {
        assert.equal(
            minSubArrayLen([2, 3, 1, 1, 1, 5], 5),
            1
        );
    });

    // ─────────────────────────────────────────────
    // Target and values
    // ─────────────────────────────────────────────

    await t.test("should handle target of one", () => {
        assert.equal(
            minSubArrayLen([1, 2, 3], 1),
            1
        );
    });

    await t.test("should handle large target", () => {
        assert.equal(
            minSubArrayLen([10, 20, 30, 40, 50], 100),
            3
        );
    });

    await t.test("should handle all identical values", () => {
        assert.equal(
            minSubArrayLen([5, 5, 5, 5, 5], 15),
            3
        );
    });

    await t.test("should handle duplicate values", () => {
        assert.equal(
            minSubArrayLen([2, 2, 2, 2, 2], 6),
            3
        );
    });

    // ─────────────────────────────────────────────
    // Large values
    // ─────────────────────────────────────────────

    await t.test("should handle large values", () => {
        assert.equal(
            minSubArrayLen([1_000_000, 2_000_000, 3_000_000], 2_500_000),
            1
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
            minSubArrayLen(arr, 50_000),
            50_000
        );
    });

    await t.test("should handle a large input with a valid single-element window", () => {
        const arr = Array.from(
            { length: 100_000 },
            () => 1
        );

        arr[99_999] = 100_000;

        assert.equal(
            minSubArrayLen(arr, 100_000),
            1
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

        const result = minSubArrayLen(arr, 500_000);

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
        const arr = [2, 3, 1, 2, 4, 3];
        const original = [...arr];

        minSubArrayLen(arr, 7);

        assert.deepEqual(arr, original);
    });
});

console.log("\nMinimum Subarray Length tests starting...\n");