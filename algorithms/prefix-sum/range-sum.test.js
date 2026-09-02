import test from "node:test";
import assert from "node:assert/strict";

import { rangeSum } from "./range-sum.js";

test("rangeSum", async (t) => {

    // ─────────────────────────────────────────────
    // Basic correctness
    // ─────────────────────────────────────────────

    await t.test("should calculate sum of a middle range", () => {
        assert.equal(
            rangeSum([2, 4, 1, 7, 3], 1, 3),
            12
        );
    });

    await t.test("should calculate sum of the entire array", () => {
        assert.equal(
            rangeSum([2, 4, 1, 7, 3], 0, 4),
            17
        );
    });

    await t.test("should calculate sum of first range", () => {
        assert.equal(
            rangeSum([2, 4, 1, 7, 3], 0, 2),
            7
        );
    });

    await t.test("should calculate sum of last range", () => {
        assert.equal(
            rangeSum([2, 4, 1, 7, 3], 2, 4),
            11
        );
    });

    // ─────────────────────────────────────────────
    // Single element ranges
    // ─────────────────────────────────────────────

    await t.test("should handle a single element range", () => {
        assert.equal(
            rangeSum([10, 20, 30, 40], 2, 2),
            30
        );
    });

    await t.test("should handle first element", () => {
        assert.equal(
            rangeSum([10, 20, 30], 0, 0),
            10
        );
    });

    await t.test("should handle last element", () => {
        assert.equal(
            rangeSum([10, 20, 30], 2, 2),
            30
        );
    });

    // ─────────────────────────────────────────────
    // Boundary cases
    // ─────────────────────────────────────────────

    await t.test("should handle two elements", () => {
        assert.equal(
            rangeSum([5, 10], 0, 1),
            15
        );
    });

    await t.test("should handle a single-element array", () => {
        assert.equal(
            rangeSum([10], 0, 0),
            10
        );
    });

    // ─────────────────────────────────────────────
    // Zero values
    // ─────────────────────────────────────────────

    await t.test("should handle zeros", () => {
        assert.equal(
            rangeSum([0, 0, 0, 0], 0, 3),
            0
        );
    });

    await t.test("should handle zeros inside the range", () => {
        assert.equal(
            rangeSum([5, 0, 10, 0, 5], 1, 3),
            10
        );
    });

    // ─────────────────────────────────────────────
    // Negative numbers
    // ─────────────────────────────────────────────

    await t.test("should handle negative numbers", () => {
        assert.equal(
            rangeSum([-5, 10, -3, 7], 0, 3),
            9
        );
    });

    await t.test("should handle a range containing negative numbers", () => {
        assert.equal(
            rangeSum([10, -5, -2, 8], 1, 3),
            1
        );
    });

    await t.test("should handle all negative numbers", () => {
        assert.equal(
            rangeSum([-5, -10, -15], 0, 2),
            -30
        );
    });

    // ─────────────────────────────────────────────
    // Duplicate values
    // ─────────────────────────────────────────────

    await t.test("should handle duplicate values", () => {
        assert.equal(
            rangeSum([5, 5, 5, 5], 1, 3),
            15
        );
    });

    // ─────────────────────────────────────────────
    // Larger values
    // ─────────────────────────────────────────────

    await t.test("should handle large values", () => {
        assert.equal(
            rangeSum([100000, 200000, 300000], 0, 2),
            600000
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
            rangeSum(arr, 0, 99_999),
            100_000
        );
    });

    await t.test("should handle a large middle range", () => {
        const arr = Array.from(
            { length: 100_000 },
            () => 1
        );

        assert.equal(
            rangeSum(arr, 25_000, 74_999),
            50_000
        );
    });

    // ─────────────────────────────────────────────
    // Input immutability
    // ─────────────────────────────────────────────

    await t.test("should not modify the input array", () => {
        const arr = [2, 4, 1, 7, 3];
        const original = [...arr];

        rangeSum(arr, 1, 3);

        assert.deepEqual(arr, original);
    });
});

console.log("\nRange Sum tests starting...\n");