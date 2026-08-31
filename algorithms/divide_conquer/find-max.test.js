import test from "node:test";
import assert from "node:assert/strict";

import { findMax } from "./find-max.js";

// ─────────────────────────────────────────────
// Basic correctness
// ─────────────────────────────────────────────

test("findMax", async (t) => {

    await t.test("should find maximum in a normal array", () => {
        assert.equal(
            findMax([8, 3, 9, 23, 2, 5, 7]),
            23
        );
    });

    await t.test("should find maximum at the beginning", () => {
        assert.equal(
            findMax([100, 2, 3, 4, 5]),
            100
        );
    });

    await t.test("should find maximum at the end", () => {
        assert.equal(
            findMax([1, 2, 3, 4, 100]),
            100
        );
    });

    await t.test("should find maximum in the middle", () => {
        assert.equal(
            findMax([1, 2, 100, 3, 4]),
            100
        );
    });

    // ─────────────────────────────────────────────
    // Boundary cases
    // ─────────────────────────────────────────────

    await t.test("should handle empty array", () => {
        assert.equal(
            findMax([]),
            undefined
        );
    });

    await t.test("should handle single-element array", () => {
        assert.equal(
            findMax([42]),
            42
        );
    });

    await t.test("should handle two elements", () => {
        assert.equal(
            findMax([10, 20]),
            20
        );
    });

    await t.test("should handle two elements when first is greater", () => {
        assert.equal(
            findMax([20, 10]),
            20
        );
    });

    // ─────────────────────────────────────────────
    // Negative numbers
    // ─────────────────────────────────────────────

    await t.test("should handle all negative numbers", () => {
        assert.equal(
            findMax([-10, -5, -20, -3, -8]),
            -3
        );
    });

    await t.test("should handle negative and positive numbers", () => {
        assert.equal(
            findMax([-10, 5, -2, 20, -7]),
            20
        );
    });

    await t.test("should handle zero", () => {
        assert.equal(
            findMax([-10, -5, 0, -2]),
            0
        );
    });

    // ─────────────────────────────────────────────
    // Duplicate values
    // ─────────────────────────────────────────────

    await t.test("should handle duplicate maximum values", () => {
        assert.equal(
            findMax([5, 10, 3, 10, 2]),
            10
        );
    });

    await t.test("should handle all identical values", () => {
        assert.equal(
            findMax([7, 7, 7, 7]),
            7
        );
    });

    // ─────────────────────────────────────────────
    // Odd / Even length
    // ─────────────────────────────────────────────

    await t.test("should handle odd-length array", () => {
        assert.equal(
            findMax([3, 7, 2, 9, 4]),
            9
        );
    });

    await t.test("should handle even-length array", () => {
        assert.equal(
            findMax([3, 7, 2, 9, 4, 6]),
            9
        );
    });

    // ─────────────────────────────────────────────
    // Sorted / Reverse sorted
    // ─────────────────────────────────────────────

    await t.test("should handle sorted array", () => {
        assert.equal(
            findMax([1, 2, 3, 4, 5, 6]),
            6
        );
    });

    await t.test("should handle reverse sorted array", () => {
        assert.equal(
            findMax([6, 5, 4, 3, 2, 1]),
            6
        );
    });

    // ─────────────────────────────────────────────
    // Custom range
    // ─────────────────────────────────────────────

    await t.test("should find maximum within a custom range", () => {
        assert.equal(
            findMax([10, 20, 30, 40, 50], 1, 3),
            40
        );
    });

    await t.test("should handle a single-element custom range", () => {
        assert.equal(
            findMax([10, 20, 30, 40, 50], 2, 2),
            30
        );
    });

    // ─────────────────────────────────────────────
    // Large input
    // ─────────────────────────────────────────────

    await t.test("should handle a large array", () => {
        const arr = Array.from(
            { length: 100_000 },
            (_, index) => index
        );

        assert.equal(
            findMax(arr),
            99_999
        );
    });

    // ─────────────────────────────────────────────
    // Mutation
    // ─────────────────────────────────────────────

    await t.test("should not mutate the input array", () => {
        const arr = [8, 3, 9, 2, 5];
        const original = [...arr];

        findMax(arr);

        assert.deepEqual(arr, original);
    });
});

console.log("\nFind Max tests starting...\n");