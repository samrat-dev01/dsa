import assert from "node:assert/strict";
import test from "node:test";

import { minimumTime } from "./minimum-time.js";

// ─────────────────────────────────────────────
// Basic correctness
// ─────────────────────────────────────────────

test("minimumTime", async (t) => {
    await t.test("basic case", () => {
        assert.equal(
            minimumTime([2, 3, 7], 10),
            12
        );
    });

    await t.test("single machine", () => {
        assert.equal(
            minimumTime([5], 10),
            50
        );
    });

    await t.test("target of one", () => {
        assert.equal(
            minimumTime([2, 3, 7], 1),
            2
        );
    });

    await t.test("all machines have the same speed", () => {
        assert.equal(
            minimumTime([2, 2, 2], 10),
            8
        );
    });

    await t.test("one machine is much faster", () => {
        assert.equal(
            minimumTime([1, 100, 100], 10),
            10
        );
    });

    // ─────────────────────────────────────────────
    // Boundary cases
    // ─────────────────────────────────────────────

    await t.test("target is zero", () => {
        assert.equal(
            minimumTime([2, 3, 7], 0),
            0
        );
    });

    await t.test("single machine with target of one", () => {
        assert.equal(
            minimumTime([10], 1),
            10
        );
    });

    await t.test("single machine with larger target", () => {
        assert.equal(
            minimumTime([10], 100),
            1000
        );
    });

    // ─────────────────────────────────────────────
    // Machine speed variations
    // ─────────────────────────────────────────────

    await t.test("should handle slow machines", () => {
        assert.equal(
            minimumTime([10, 20, 30], 10),
            60
        );
    });

    await t.test("should handle duplicate machine speeds", () => {
        assert.equal(
            minimumTime([2, 2, 3], 10),
            8
        );
    });

    await t.test("should handle one extremely fast machine", () => {
        assert.equal(
            minimumTime([1, 1000, 1000], 100),
            100
        );
    });

    await t.test("should handle machines with very different speeds", () => {
        assert.equal(
            minimumTime([1, 10, 100], 50),
            46
        );
    });

    // ─────────────────────────────────────────────
    // Exact production boundaries
    // ─────────────────────────────────────────────

    await t.test("should handle target exactly reached", () => {
        assert.equal(
            minimumTime([2, 3], 5),
            6
        );
    });

    await t.test("should handle target not exactly reached at previous second", () => {
        assert.equal(
            minimumTime([2, 3], 6),
            8
        );
    });

    await t.test("should return the first time that reaches the target", () => {
        assert.equal(
            minimumTime([2, 3, 7], 10),
            12
        );
    });

    // ─────────────────────────────────────────────
    // Larger targets
    // ─────────────────────────────────────────────

    await t.test("should handle a larger target", () => {
        assert.equal(
            minimumTime([2, 3, 7], 100),
            104
        );
    });

    await t.test("should handle a very large target", () => {
        assert.equal(
            minimumTime([2, 3], 1000),
            1200
        );
    });

    // ─────────────────────────────────────────────
    // Monotonicity
    // ─────────────────────────────────────────────

    await t.test("should find the minimum valid time", () => {
        const result = minimumTime([2, 3, 7], 10);

        assert.equal(result, 12);

        // 11 seconds produces:
        // floor(11 / 2) + floor(11 / 3) + floor(11 / 7)
        // = 5 + 3 + 1
        // = 9
        //
        // Therefore 11 seconds is insufficient.

        const producedBeforeAnswer =
            Math.floor(11 / 2) +
            Math.floor(11 / 3) +
            Math.floor(11 / 7);

        assert.equal(producedBeforeAnswer, 9);
    });

    // ─────────────────────────────────────────────
    // Large input / constraint test
    // ─────────────────────────────────────────────

    await t.test("should handle many machines", () => {
        const machines = Array.from(
            { length: 1_000 },
            (_, index) => index + 1
        );

        const result = minimumTime(machines, 1_000);

        assert.ok(result > 0);
    });

    await t.test("should handle a large target efficiently", () => {
        const result = minimumTime([2, 3, 5, 7], 1_000_000);

        assert.ok(result > 0);
    });

    // ─────────────────────────────────────────────
    // Performance sanity check
    // ─────────────────────────────────────────────

    await t.test("should solve large input efficiently", () => {
        const machines = Array.from(
            { length: 1_000 },
            (_, index) => index + 1
        );

        const target = 1_000_000;

        const start = performance.now();

        const result = minimumTime(machines, target);

        const elapsed = performance.now() - start;

        assert.ok(result > 0);

        // Performance sanity check.
        // This does NOT mathematically prove O(n log answer).
        assert.ok(
            elapsed < 100,
            `minimumTime took ${elapsed.toFixed(2)}ms`
        );
    });

    // ─────────────────────────────────────────────
    // Result validation
    // ─────────────────────────────────────────────

    await t.test("returned time should actually produce the target", () => {
        const machines = [2, 3, 7];
        const target = 10;

        const result = minimumTime(machines, target);

        const produced =
            Math.floor(result / 2) +
            Math.floor(result / 3) +
            Math.floor(result / 7);

        assert.ok(produced >= target);
    });

    await t.test("one second before the result should be insufficient", () => {
        const machines = [2, 3, 7];
        const target = 10;

        const result = minimumTime(machines, target);

        const produced =
            Math.floor((result - 1) / 2) +
            Math.floor((result - 1) / 3) +
            Math.floor((result - 1) / 7);

        assert.ok(produced < target);
    });


});

console.log("\nMinimum Time tests starting...\n");
