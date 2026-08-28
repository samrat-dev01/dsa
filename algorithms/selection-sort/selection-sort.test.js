import test from "node:test";
import assert from "node:assert/strict";
import { selectionSort } from "./selection-sort.js";


test("selectionSort - sorts a normal unsorted array", () => {
    const arr = [5, 3, 8, 1, 2];

    const result = selectionSort(arr);

    assert.deepEqual(result, [1, 2, 3, 5, 8]);
});

test("selectionSort - handles an empty array", () => {
    const arr = [];

    const result = selectionSort(arr);

    assert.deepEqual(result, []);
});

test("selectionSort - handles a single element", () => {
    const arr = [5];

    const result = selectionSort(arr);

    assert.deepEqual(result, [5]);
});

test("selectionSort - handles two elements", () => {
    const arr = [2, 1];

    const result = selectionSort(arr);

    assert.deepEqual(result, [1, 2]);
});

test("selectionSort - handles an already sorted array", () => {
    const arr = [1, 2, 3, 4, 5];

    const result = selectionSort(arr);

    assert.deepEqual(result, [1, 2, 3, 4, 5]);
});

test("selectionSort - handles a reverse sorted array", () => {
    const arr = [5, 4, 3, 2, 1];

    const result = selectionSort(arr);

    assert.deepEqual(result, [1, 2, 3, 4, 5]);
});

test("selectionSort - handles duplicate values", () => {
    const arr = [4, 2, 4, 1, 2];

    const result = selectionSort(arr);

    assert.deepEqual(result, [1, 2, 2, 4, 4]);
});

test("selectionSort - handles all identical values", () => {
    const arr = [7, 7, 7, 7];

    const result = selectionSort(arr);

    assert.deepEqual(result, [7, 7, 7, 7]);
});

test("selectionSort - handles negative numbers", () => {
    const arr = [3, -1, 5, -7, 2];

    const result = selectionSort(arr);

    assert.deepEqual(result, [-7, -1, 2, 3, 5]);
});

test("selectionSort - handles zero", () => {
    const arr = [3, 0, -2, 1, 0];

    const result = selectionSort(arr);

    assert.deepEqual(result, [-2, 0, 0, 1, 3]);
});

test("selectionSort - handles large positive and negative values", () => {
    const arr = [
        Number.MAX_SAFE_INTEGER,
        -Number.MAX_SAFE_INTEGER,
        0,
        100,
        -100,
    ];

    const result = selectionSort(arr);

    assert.deepEqual(result, [
        -Number.MAX_SAFE_INTEGER,
        -100,
        0,
        100,
        Number.MAX_SAFE_INTEGER,
    ]);
});

test("selectionSort - mutates the original array", () => {
    const arr = [3, 1, 2];

    const result = selectionSort(arr);

    assert.strictEqual(result, arr);
    assert.deepEqual(arr, [1, 2, 3]);
});

test("selectionSort - correctly handles minimum values already at the beginning", () => {
    const arr = [1, 5, 3, 4, 2];

    const result = selectionSort(arr);

    assert.deepEqual(result, [1, 2, 3, 4, 5]);
});

test("selectionSort - correctly handles minimum value at the end", () => {
    const arr = [5, 4, 3, 2, 1];

    const result = selectionSort(arr);

    assert.deepEqual(result, [1, 2, 3, 4, 5]);
});

test("selectionSort - correctly handles multiple minimum candidates", () => {
    const arr = [4, 1, 3, 1, 2];

    const result = selectionSort(arr);

    assert.deepEqual(result, [1, 1, 2, 3, 4]);
});


console.log("\nSelection Sort tests starting...\n");