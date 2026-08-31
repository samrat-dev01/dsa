
import assert from "node:assert/strict";
import { test } from "node:test";

import { insertionSort } from "./insertion-sort.js";

// ─────────────────────────────────────────────
// Basic correctness
// ─────────────────────────────────────────────

test("should sort an unsorted array", () => {
    assert.deepEqual(
        insertionSort([5, 2, 8, 1, 3]),
        [1, 2, 3, 5, 8]
    );
});

test("should sort an array with elements in random order", () => {
    assert.deepEqual(
        insertionSort([9, 4, 7, 2, 6, 1, 8, 3, 5]),
        [1, 2, 3, 4, 5, 6, 7, 8, 9]
    );
});

test("should sort an array with two elements", () => {
    assert.deepEqual(
        insertionSort([20, 10]),
        [10, 20]
    );
});

test("should sort an array when elements are already in correct order", () => {
    assert.deepEqual(
        insertionSort([1, 2, 3, 4, 5]),
        [1, 2, 3, 4, 5]
    );
});

// ─────────────────────────────────────────────
// Boundary cases
// ─────────────────────────────────────────────

test("should handle empty array", () => {
    assert.deepEqual(
        insertionSort([]),
        []
    );
});

test("should handle single-element array", () => {
    assert.deepEqual(
        insertionSort([10]),
        [10]
    );
});

test("should handle two-element array when already sorted", () => {
    assert.deepEqual(
        insertionSort([10, 20]),
        [10, 20]
    );
});

test("should handle two-element array when reverse sorted", () => {
    assert.deepEqual(
        insertionSort([20, 10]),
        [10, 20]
    );
});

// ─────────────────────────────────────────────
// Already / Reverse sorted
// ─────────────────────────────────────────────

test("should handle an already sorted array", () => {
    assert.deepEqual(
        insertionSort([1, 2, 3, 4, 5, 6]),
        [1, 2, 3, 4, 5, 6]
    );
});

test("should handle a reverse sorted array", () => {
    assert.deepEqual(
        insertionSort([6, 5, 4, 3, 2, 1]),
        [1, 2, 3, 4, 5, 6]
    );
});

test("should handle a reverse sorted array with larger input", () => {
    assert.deepEqual(
        insertionSort([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]),
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    );
});

// ─────────────────────────────────────────────
// Duplicate values
// ─────────────────────────────────────────────

test("should correctly sort duplicate values", () => {
    assert.deepEqual(
        insertionSort([4, 2, 4, 1, 2, 4]),
        [1, 2, 2, 4, 4, 4]
    );
});

test("should handle an array where every element is identical", () => {
    assert.deepEqual(
        insertionSort([5, 5, 5, 5, 5]),
        [5, 5, 5, 5, 5]
    );
});

test("should handle duplicates at the beginning and end", () => {
    assert.deepEqual(
        insertionSort([3, 1, 1, 5, 3, 5, 1]),
        [1, 1, 1, 3, 3, 5, 5]
    );
});

// ─────────────────────────────────────────────
// Negative numbers and zero
// ─────────────────────────────────────────────

test("should correctly sort negative numbers", () => {
    assert.deepEqual(
        insertionSort([3, -1, 5, -7, 2]),
        [-7, -1, 2, 3, 5]
    );
});

test("should correctly sort negative numbers and zero", () => {
    assert.deepEqual(
        insertionSort([0, -3, 5, -1, 2]),
        [-3, -1, 0, 2, 5]
    );
});

test("should correctly sort negative and positive numbers", () => {
    assert.deepEqual(
        insertionSort([-5, 3, -2, 8, 0, -1]),
        [-5, -2, -1, 0, 3, 8]
    );
});

// ─────────────────────────────────────────────
// Large values
// ─────────────────────────────────────────────

test("should handle large numeric values", () => {
    assert.deepEqual(
        insertionSort([1_000_000, 5, 999_999, 1]),
        [1, 5, 999_999, 1_000_000]
    );
});

test("should handle large negative values", () => {
    assert.deepEqual(
        insertionSort([-1_000_000, 5, -999_999, 1]),
        [-1_000_000, -999_999, 1, 5]
    );
});

// ─────────────────────────────────────────────
// Mutation behavior
// ─────────────────────────────────────────────

test("should mutate the original array", () => {
    const arr = [5, 3, 1, 4, 2];

    const result = insertionSort(arr);

    assert.strictEqual(result, arr);
    assert.deepEqual(arr, [1, 2, 3, 4, 5]);
});

// ─────────────────────────────────────────────
// Large input / constraint test
// ─────────────────────────────────────────────

test("should correctly sort a large reverse-sorted array", () => {
    const arr = Array.from(
        { length: 1_000 },
        (_, index) => 1_000 - index
    );

    const expected = Array.from(
        { length: 1_000 },
        (_, index) => index + 1
    );

    assert.deepEqual(
        insertionSort(arr),
        expected
    );
});

// ─────────────────────────────────────────────
// Performance sanity check
// ─────────────────────────────────────────────

test("should sort a reasonably large input", () => {
    const arr = Array.from(
        { length: 2_000 },
        (_, index) => 2_000 - index
    );

    const start = performance.now();

    const result = insertionSort(arr);

    const elapsed = performance.now() - start;

    assert.equal(result[0], 1);
    assert.equal(result[result.length - 1], 2_000);

    // Performance sanity check.
    // This does NOT mathematically prove the time complexity.
    assert.ok(
        elapsed < 1000,
        `Insertion sort took ${elapsed.toFixed(2)}ms`
    );
});

// ─────────────────────────────────────────────
// Final verification
// ─────────────────────────────────────────────

console.log("\nInsertion Sort tests starting...\n");

