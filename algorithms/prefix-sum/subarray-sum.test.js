import test from "node:test";
import assert from "node:assert/strict";

import { subarraySum } from "./subarray-sum.js";

test("subarraySum", async (t) => {

    // ─────────────────────────────────────────────
    // Basic correctness
    // ─────────────────────────────────────────────

    await t.test("should count subarrays with sum equal to k", () => {
        assert.equal(
            subarraySum([1, 2, 3], 3),
            2
        );
    });

    await t.test("should find a single matching subarray", () => {
        assert.equal(
            subarraySum([1, 2, 3], 6),
            1
        );
    });

    await t.test("should return zero when no subarray matches", () => {
        assert.equal(
            subarraySum([1, 2, 3], 10),
            0
        );
    });

    // ─────────────────────────────────────────────
    // Boundary cases
    // ─────────────────────────────────────────────

    await t.test("should handle empty array", () => {
        assert.equal(
            subarraySum([], 5),
            0
        );
    });

    await t.test("should handle a single element when it matches", () => {
        assert.equal(
            subarraySum([5], 5),
            1
        );
    });

    await t.test("should handle a single element when it does not match", () => {
        assert.equal(
            subarraySum([5], 3),
            0
        );
    });

    // ─────────────────────────────────────────────
    // Multiple matching subarrays
    // ─────────────────────────────────────────────

    await t.test("should count multiple matching subarrays", () => {
        assert.equal(
            subarraySum([1, 1, 1], 2),
            2
        );
    });

    await t.test("should count overlapping subarrays", () => {
        assert.equal(
            subarraySum([1, 2, 1], 3),
            2
        );
    });

    await t.test("should count the entire array as a valid subarray", () => {
        assert.equal(
            subarraySum([1, 2, 3], 6),
            1
        );
    });

    // ─────────────────────────────────────────────
    // Zero
    // ─────────────────────────────────────────────

    await t.test("should handle k equal to zero", () => {
        assert.equal(
            subarraySum([1, -1, 2], 0),
            1
        );
    });

    await t.test("should count multiple zero-sum subarrays", () => {
        assert.equal(
            subarraySum([0, 0, 0], 0),
            6
        );
    });

    await t.test("should handle zero values", () => {
        assert.equal(
            subarraySum([0, 1, 0], 1),
            4
        );
    });

    // ─────────────────────────────────────────────
    // Negative numbers
    // ─────────────────────────────────────────────

    await t.test("should handle negative numbers", () => {
        assert.equal(
            subarraySum([1, -1, 2], 2),
            2
        );
    });

    await t.test("should handle all negative numbers", () => {
        assert.equal(
            subarraySum([-1, -2, -3], -3),
            2
        );
    });

    await t.test("should handle positive and negative numbers together", () => {
        assert.equal(
            subarraySum([3, 4, -7, 1, 3, 3, 1, -4], 7),
            4
        );
    });

    // ─────────────────────────────────────────────
    // Duplicate prefix sums
    // ─────────────────────────────────────────────

    await t.test("should handle repeated prefix sums", () => {
        assert.equal(
            subarraySum([1, -1, 1, -1], 0),
            4
        );
    });

    await t.test("should use prefix frequency to count multiple matches", () => {
        assert.equal(
            subarraySum([0, 0, 0, 0], 0),
            10
        );
    });

    // ─────────────────────────────────────────────
    // Duplicate values
    // ─────────────────────────────────────────────

    await t.test("should handle duplicate positive values", () => {
        assert.equal(
            subarraySum([2, 2, 2], 4),
            2
        );
    });

    await t.test("should handle duplicate negative values", () => {
        assert.equal(
            subarraySum([-2, -2, -2], -4),
            2
        );
    });

    // ─────────────────────────────────────────────
    // Larger values
    // ─────────────────────────────────────────────

    await t.test("should handle large values", () => {
        assert.equal(
            subarraySum([100, 200, 300], 500),
            1
        );
    });

    await t.test("should handle a large target", () => {
        assert.equal(
            subarraySum([1000, 2000, 3000], 6000),
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
            subarraySum(arr, 100_000),
            1
        );
    });

    await t.test("should handle many matching subarrays", () => {
        const arr = Array.from(
            { length: 1_000 },
            () => 0
        );

        assert.equal(
            subarraySum(arr, 0),
            500_500
        );
    });

    // ─────────────────────────────────────────────
    // Input immutability
    // ─────────────────────────────────────────────

    await t.test("should not modify the input array", () => {
        const arr = [1, 2, 1, -1, 2];
        const original = [...arr];

        subarraySum(arr, 3);

        assert.deepEqual(arr, original);
    });
});

console.log("\nSubarray Sum tests starting...\n");