import { test } from "node:test";
import assert from "node:assert/strict";
import { binarySearch } from "./binary-search.js";

// ─────────────────────────────────────────────
// Basic correctness
// ─────────────────────────────────────────────

test("should find target in the middle", () => {
    assert.equal(
        binarySearch([10, 20, 30, 40, 50], 30),
        2
    );
});

test("should find target at the beginning", () => {
    assert.equal(
        binarySearch([10, 20, 30, 40, 50], 10),
        0
    );
});

test("should find target at the end", () => {
    assert.equal(
        binarySearch([10, 20, 30, 40, 50], 50),
        4
    );
});

test("should return -1 when target does not exist", () => {
    assert.equal(
        binarySearch([10, 20, 30, 40, 50], 35),
        -1
    );
});

// ─────────────────────────────────────────────
// Boundary cases
// ─────────────────────────────────────────────

test("should handle empty array", () => {
    assert.equal(
        binarySearch([], 10),
        -1
    );
});

test("should handle single-element array when target exists", () => {
    assert.equal(
        binarySearch([10], 10),
        0
    );
});

test("should handle single-element array when target does not exist", () => {
    assert.equal(
        binarySearch([10], 20),
        -1
    );
});

test("should find target when array has two elements", () => {
    assert.equal(
        binarySearch([10, 20], 20),
        1
    );
});

test("should find first element in two-element array", () => {
    assert.equal(
        binarySearch([10, 20], 10),
        0
    );
});

// ─────────────────────────────────────────────
// Target outside the array range
// ─────────────────────────────────────────────

test("should return -1 when target is smaller than every element", () => {
    assert.equal(
        binarySearch([10, 20, 30, 40], 5),
        -1
    );
});

test("should return -1 when target is greater than every element", () => {
    assert.equal(
        binarySearch([10, 20, 30, 40], 50),
        -1
    );
});

// ─────────────────────────────────────────────
// Negative numbers
// ─────────────────────────────────────────────

test("should work with negative numbers", () => {
    assert.equal(
        binarySearch([-50, -30, -10, 0, 10, 20], -30),
        1
    );
});

test("should find zero", () => {
    assert.equal(
        binarySearch([-10, -5, 0, 5, 10], 0),
        2
    );
});

// ─────────────────────────────────────────────
// Duplicate values
// ─────────────────────────────────────────────

test("should find target when duplicates exist", () => {
    const arr = [10, 20, 20, 20, 30];

    const result = binarySearch(arr, 20);

    assert.ok(result >= 1 && result <= 3);
    assert.equal(arr[result], 20);
});

test("should find target when every element is the same", () => {
    const arr = [5, 5, 5, 5, 5];

    const result = binarySearch(arr, 5);

    assert.ok(result >= 0 && result < arr.length);
    assert.equal(arr[result], 5);
});

// ─────────────────────────────────────────────
// Different array sizes
// ─────────────────────────────────────────────

test("should work with odd-length array", () => {
    assert.equal(
        binarySearch([10, 20, 30, 40, 50], 40),
        3
    );
});

test("should work with even-length array", () => {
    assert.equal(
        binarySearch([10, 20, 30, 40, 50, 60], 40),
        3
    );
});

test("should work when target is exactly the middle element", () => {
    assert.equal(
        binarySearch([10, 20, 30, 40, 50], 30),
        2
    );
});

// ─────────────────────────────────────────────
// Large input / constraint test
// ─────────────────────────────────────────────

test("should handle a large sorted array", () => {
    const arr = Array.from(
        { length: 1_000_000 },
        (_, index) => index
    );

    assert.equal(
        binarySearch(arr, 999_999),
        999_999
    );
});

test("should handle a large array when target does not exist", () => {
    const arr = Array.from(
        { length: 1_000_000 },
        (_, index) => index
    );

    assert.equal(
        binarySearch(arr, 1_000_001),
        -1
    );
});

// ─────────────────────────────────────────────
// Performance sanity check
// ─────────────────────────────────────────────

test("should search large input efficiently", () => {
    const arr = Array.from(
        { length: 1_000_000 },
        (_, index) => index
    );

    const start = performance.now();

    const result = binarySearch(arr, 999_999);

    const elapsed = performance.now() - start;

    assert.equal(result, 999_999);

    // Performance sanity check.
    // This does NOT mathematically prove O(log n).
    assert.ok(
        elapsed < 100,
        `Binary search took ${elapsed.toFixed(2)}ms`
    );
});

// ─────────────────────────────────────────────
// Strict equality behavior
// ─────────────────────────────────────────────

test("should not match number with string", () => {
    assert.equal(
        binarySearch([1, 2, 3, 4, 5], "3"),
        -1
    );
});


console.log("\nBinary Search tests starting...\n");
