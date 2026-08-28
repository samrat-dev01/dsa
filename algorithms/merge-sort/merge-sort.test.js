import test from "node:test";
import assert from "node:assert/strict";
import { mergeSort } from "./merge-sort.js";

test("mergeSort - sorts a normal unsorted array", () => {
    const arr = [8, 3, 5, 1, 4, 2, 7, 6];

    const result = mergeSort(arr);

    assert.deepEqual(result, [1, 2, 3, 4, 5, 6, 7, 8]);
});

test("mergeSort - handles an empty array", () => {
    assert.deepEqual(mergeSort([]), []);
});

test("mergeSort - handles a single element", () => {
    assert.deepEqual(mergeSort([5]), [5]);
});

test("mergeSort - handles two elements", () => {
    assert.deepEqual(mergeSort([2, 1]), [1, 2]);
});

test("mergeSort - handles an already sorted array", () => {
    assert.deepEqual(
        mergeSort([1, 2, 3, 4, 5]),
        [1, 2, 3, 4, 5]
    );
});

test("mergeSort - handles a reverse sorted array", () => {
    assert.deepEqual(
        mergeSort([5, 4, 3, 2, 1]),
        [1, 2, 3, 4, 5]
    );
});

test("mergeSort - handles duplicate values", () => {
    assert.deepEqual(
        mergeSort([4, 2, 4, 1, 2, 1]),
        [1, 1, 2, 2, 4, 4]
    );
});

test("mergeSort - handles all identical values", () => {
    assert.deepEqual(
        mergeSort([7, 7, 7, 7]),
        [7, 7, 7, 7]
    );
});

test("mergeSort - handles negative numbers", () => {
    assert.deepEqual(
        mergeSort([3, -1, 5, -7, 2]),
        [-7, -1, 2, 3, 5]
    );
});

test("mergeSort - handles negative numbers and zero", () => {
    assert.deepEqual(
        mergeSort([0, -3, 5, -1, 0, 2]),
        [-3, -1, 0, 0, 2, 5]
    );
});

test("mergeSort - handles large safe integer values", () => {
    assert.deepEqual(
        mergeSort([
            Number.MAX_SAFE_INTEGER,
            -Number.MAX_SAFE_INTEGER,
            0,
            100,
            -100,
        ]),
        [
            -Number.MAX_SAFE_INTEGER,
            -100,
            0,
            100,
            Number.MAX_SAFE_INTEGER,
        ]
    );
});

test("mergeSort - does not mutate the original array", () => {
    const arr = [5, 2, 8, 1, 3];
    const original = [...arr];

    const result = mergeSort(arr);

    assert.deepEqual(arr, original);
    assert.notStrictEqual(result, arr);
});

test("mergeSort - handles an array with repeated minimum values", () => {
    assert.deepEqual(
        mergeSort([3, 1, 2, 1, 4, 1]),
        [1, 1, 1, 2, 3, 4]
    );
});

test("mergeSort - handles an array with repeated maximum values", () => {
    assert.deepEqual(
        mergeSort([5, 2, 5, 1, 5, 3]),
        [1, 2, 3, 5, 5, 5]
    );
});

test("mergeSort - handles uneven splits", () => {
    assert.deepEqual(
        mergeSort([10, 3, 7, 1, 8, 2, 5]),
        [1, 2, 3, 5, 7, 8, 10]
    );
});

test("mergeSort - handles a larger input", () => {
    const arr = Array.from({ length: 1000 }, () =>
        Math.floor(Math.random() * 10000)
    );

    const result = mergeSort(arr);

    for (let i = 1; i < result.length; i++) {
        assert.ok(
            result[i - 1] <= result[i],
            `Array is not sorted at index ${i}`
        );
    }
});


console.log("\nMerge Sort tests starting...\n");
