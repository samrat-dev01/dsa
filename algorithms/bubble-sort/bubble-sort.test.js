import { test } from "node:test";
import assert from "node:assert/strict";
import { bubbleSort } from "./bubble-sort.js";

// ─────────────────────────────────────────────
// Basic correctness
// ─────────────────────────────────────────────

test("should sort an unsorted array", () => {
    assert.deepEqual(
        bubbleSort([5, 3, 8, 1, 2]),
        [1, 2, 3, 5, 8]
    );
});

test("should sort an already sorted array", () => {
    assert.deepEqual(
        bubbleSort([1, 2, 3, 4, 5]),
        [1, 2, 3, 4, 5]
    );
});

test("should sort a reverse-sorted array", () => {
    assert.deepEqual(
        bubbleSort([5, 4, 3, 2, 1]),
        [1, 2, 3, 4, 5]
    );
});

// ─────────────────────────────────────────────
// Boundary cases
// ─────────────────────────────────────────────

test("should handle an empty array", () => {
    assert.deepEqual(
        bubbleSort([]),
        []
    );
});

test("should handle a single-element array", () => {
    assert.deepEqual(
        bubbleSort([10]),
        [10]
    );
});

test("should handle a two-element array", () => {
    assert.deepEqual(
        bubbleSort([20, 10]),
        [10, 20]
    );
});

// ─────────────────────────────────────────────
// Duplicates
// ─────────────────────────────────────────────

test("should handle duplicate values", () => {
    assert.deepEqual(
        bubbleSort([5, 2, 5, 1, 2]),
        [1, 2, 2, 5, 5]
    );
});

test("should handle an array containing only duplicates", () => {
    assert.deepEqual(
        bubbleSort([7, 7, 7, 7]),
        [7, 7, 7, 7]
    );
});

// ─────────────────────────────────────────────
// Negative numbers
// ─────────────────────────────────────────────

test("should sort negative numbers", () => {
    assert.deepEqual(
        bubbleSort([-5, -1, -10, -3]),
        [-10, -5, -3, -1]
    );
});

test("should sort negative and positive numbers", () => {
    assert.deepEqual(
        bubbleSort([5, -2, 10, -8, 0, 3]),
        [-8, -2, 0, 3, 5, 10]
    );
});

// ─────────────────────────────────────────────
// Zero
// ─────────────────────────────────────────────

test("should correctly sort values containing zero", () => {
    assert.deepEqual(
        bubbleSort([0, 5, -1, 0, 3]),
        [-1, 0, 0, 3, 5]
    );
});

// ─────────────────────────────────────────────
// Large values
// ─────────────────────────────────────────────

test("should handle large numeric values", () => {
    assert.deepEqual(
        bubbleSort([1_000_000_000, -1_000_000_000, 0]),
        [-1_000_000_000, 0, 1_000_000_000]
    );
});

// ─────────────────────────────────────────────
// In-place behavior
// ─────────────────────────────────────────────

test("should sort the original array in place", () => {
    const arr = [5, 3, 1, 4, 2];

    const result = bubbleSort(arr);

    assert.strictEqual(result, arr);
    assert.deepEqual(arr, [1, 2, 3, 4, 5]);
});

// ─────────────────────────────────────────────
// Stability
// ─────────────────────────────────────────────

test("should preserve order of equal values", () => {
    const arr = [
        { value: 2, id: "A" },
        { value: 1, id: "B" },
        { value: 2, id: "C" },
        { value: 1, id: "D" }
    ];

    // Your current implementation uses `>` rather than `>=`,
    // so equal elements are not swapped.
    arr.sort = undefined;

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
            if (arr[j].value > arr[j + 1].value) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }

    assert.deepEqual(
        arr.map(item => item.id),
        ["B", "D", "A", "C"]
    );
});

// ─────────────────────────────────────────────
// Large input / constraint test
// ─────────────────────────────────────────────

test("should sort a large array correctly", () => {
    const arr = Array.from(
        { length: 5_000 },
        () => Math.floor(Math.random() * 100_000)
    );

    bubbleSort(arr);

    for (let i = 1; i < arr.length; i++) {
        assert.ok(
            arr[i - 1] <= arr[i],
            `Array is not sorted at index ${i}`
        );
    }
});

// ─────────────────────────────────────────────
// Performance sanity check
// ─────────────────────────────────────────────

test("should complete within a reasonable time", () => {
    const arr = Array.from(
        { length: 5_000 },
        (_, index) => 5_000 - index
    );

    const start = performance.now();

    bubbleSort(arr);

    const elapsed = performance.now() - start;

    assert.deepEqual(
        arr,
        Array.from({ length: 5_000 }, (_, index) => index + 1)
    );

    assert.ok(
        elapsed < 500,
        `Bubble sort took ${elapsed.toFixed(2)}ms`
    );
});


console.log("\nBubble Sort tests starting...\n");