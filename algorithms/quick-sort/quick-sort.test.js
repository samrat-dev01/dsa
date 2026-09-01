import test from "node:test";
import assert from "node:assert/strict";

import { quickSort } from "./quick-sort.js";

// ─────────────────────────────────────────────
// Basic correctness
// ─────────────────────────────────────────────

test("quickSort", async (t) => {

    await t.test("should sort a normal array", () => {
        assert.deepEqual(
            quickSort([8, 3, 7, 4, 9, 2]),
            [2, 3, 4, 7, 8, 9]
        );
    });

    await t.test("should sort an unsorted array", () => {
        assert.deepEqual(
            quickSort([5, 1, 4, 2, 8, 3]),
            [1, 2, 3, 4, 5, 8]
        );
    });

    await t.test("should sort when minimum is at the end", () => {
        assert.deepEqual(
            quickSort([5, 4, 3, 2, 1]),
            [1, 2, 3, 4, 5]
        );
    });

    await t.test("should sort when maximum is at the end", () => {
        assert.deepEqual(
            quickSort([1, 2, 3, 4, 5]),
            [1, 2, 3, 4, 5]
        );
    });

    // ─────────────────────────────────────────────
    // Boundary cases
    // ─────────────────────────────────────────────

    await t.test("should handle empty array", () => {
        assert.deepEqual(
            quickSort([]),
            []
        );
    });

    await t.test("should handle single-element array", () => {
        assert.deepEqual(
            quickSort([42]),
            [42]
        );
    });

    await t.test("should handle two elements", () => {
        assert.deepEqual(
            quickSort([20, 10]),
            [10, 20]
        );
    });

    await t.test("should handle already sorted array", () => {
        assert.deepEqual(
            quickSort([1, 2, 3, 4, 5]),
            [1, 2, 3, 4, 5]
        );
    });

    await t.test("should handle reverse sorted array", () => {
        assert.deepEqual(
            quickSort([5, 4, 3, 2, 1]),
            [1, 2, 3, 4, 5]
        );
    });

    // ─────────────────────────────────────────────
    // Duplicate values
    // ─────────────────────────────────────────────

    await t.test("should handle duplicate values", () => {
        assert.deepEqual(
            quickSort([4, 2, 4, 3, 2, 4, 2]),
            [2, 2, 2, 3, 4, 4, 4]
        );
    });

    await t.test("should handle all identical values", () => {
        assert.deepEqual(
            quickSort([5, 5, 5, 5, 5]),
            [5, 5, 5, 5, 5]
        );
    });

    await t.test("should handle duplicate minimum values", () => {
        assert.deepEqual(
            quickSort([1, 4, 1, 3, 1, 2]),
            [1, 1, 1, 2, 3, 4]
        );
    });

    await t.test("should handle duplicate maximum values", () => {
        assert.deepEqual(
            quickSort([4, 9, 2, 9, 1, 9]),
            [1, 2, 4, 9, 9, 9]
        );
    });

    // ─────────────────────────────────────────────
    // Negative numbers and zero
    // ─────────────────────────────────────────────

    await t.test("should handle negative numbers", () => {
        assert.deepEqual(
            quickSort([-5, -1, -10, -3, -2]),
            [-10, -5, -3, -2, -1]
        );
    });

    await t.test("should handle negative and positive numbers", () => {
        assert.deepEqual(
            quickSort([3, -2, 7, -5, 0, 4]),
            [-5, -2, 0, 3, 4, 7]
        );
    });

    await t.test("should handle zero", () => {
        assert.deepEqual(
            quickSort([0, 5, -1, 0, 3]),
            [-1, 0, 0, 3, 5]
        );
    });

    // ─────────────────────────────────────────────
    // Large values
    // ─────────────────────────────────────────────

    await t.test("should handle large positive values", () => {
        assert.deepEqual(
            quickSort([1_000_000, 5, 999_999, 2]),
            [2, 5, 999_999, 1_000_000]
        );
    });

    await t.test("should handle large negative values", () => {
        assert.deepEqual(
            quickSort([-1_000_000, -5, -999_999, -2]),
            [-1_000_000, -999_999, -5, -2]
        );
    });

    // ─────────────────────────────────────────────
    // Different array sizes
    // ─────────────────────────────────────────────

    await t.test("should handle odd-length array", () => {
        assert.deepEqual(
            quickSort([7, 3, 9, 1, 5]),
            [1, 3, 5, 7, 9]
        );
    });

    await t.test("should handle even-length array", () => {
        assert.deepEqual(
            quickSort([7, 3, 9, 1, 5, 2]),
            [1, 2, 3, 5, 7, 9]
        );
    });

    // ─────────────────────────────────────────────
    // Mutation
    // ─────────────────────────────────────────────

    await t.test("should sort the original array in place", () => {
        const arr = [5, 2, 8, 1, 4];

        const result = quickSort(arr);

        assert.strictEqual(result, arr);
        assert.deepEqual(arr, [1, 2, 4, 5, 8]);
    });

    // ─────────────────────────────────────────────
    // Custom range
    // ─────────────────────────────────────────────

    await t.test("should sort only the specified range", () => {
        const arr = [10, 5, 4, 3, 20];

        quickSort(arr, 1, 3);

        assert.deepEqual(
            arr,
            [10, 3, 4, 5, 20]
        );
    });

    await t.test("should leave elements outside custom range unchanged", () => {
        const arr = [100, 9, 7, 8, 200];

        quickSort(arr, 1, 3);

        assert.equal(arr[0], 100);
        assert.equal(arr[4], 200);
        assert.deepEqual(
            arr.slice(1, 4),
            [7, 8, 9]
        );
    });

    // ─────────────────────────────────────────────
    // Large input
    // ─────────────────────────────────────────────

    await t.test("should handle a large array", () => {
        const arr = Array.from(
            { length: 10_000 },
            (_, index) => 10_000 - index
        );

        const result = quickSort(arr);

        assert.equal(result[0], 1);
        assert.equal(result[result.length - 1], 10_000);
        assert.equal(result.length, 10_000);
    });

    // ─────────────────────────────────────────────
    // Performance sanity check
    // ─────────────────────────────────────────────

    await t.test("should sort a large input efficiently", () => {
        const arr = Array.from(
            { length: 5_000 },
            (_, index) => 5_000 - index
        );

        const start = performance.now();

        const result = quickSort(arr);

        const elapsed = performance.now() - start;

        assert.equal(result[0], 1);
        assert.equal(result[result.length - 1], 5_000);

        // Performance sanity check.
        // This does NOT mathematically prove O(n log n).
        assert.ok(
            elapsed < 100,
            `Quick sort took ${elapsed.toFixed(2)}ms`
        );
    });
});

console.log("\nQuick Sort tests starting...\n");