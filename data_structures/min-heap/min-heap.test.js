import assert from "node:assert/strict";
import test from "node:test";
import { MinHeap } from "./min-heap.js";

test("1. Initial state", () => {
    const heap = new MinHeap();

    assert.equal(heap.size(), 0);
    assert.equal(heap.peek(), undefined);
    assert.equal(heap.isEmpty(), true);
});

test("2. Insert first value", () => {
    const heap = new MinHeap();

    heap.insert(10);

    assert.equal(heap.peek(), 10);
    assert.equal(heap.size(), 1);
});

test("3. Insert smaller value bubbles up", () => {
    const heap = new MinHeap();

    heap.insert(10);
    heap.insert(5);

    assert.equal(heap.peek(), 5);
    assert.equal(heap.size(), 2);
});

test("4. Insert multiple values", () => {
    const heap = new MinHeap();

    heap.insert(10);
    heap.insert(5);
    heap.insert(20);
    heap.insert(2);
    heap.insert(8);

    assert.equal(heap.peek(), 2);
    assert.equal(heap.size(), 5);
});

test("5. Insert values requiring multiple heapify-up operations", () => {
    const heap = new MinHeap();

    heap.insert(50);
    heap.insert(40);
    heap.insert(30);
    heap.insert(20);
    heap.insert(10);
    heap.insert(5);
    heap.insert(1);

    assert.equal(heap.peek(), 1);
});

test("6. Duplicate values", () => {
    const heap = new MinHeap();

    heap.insert(10);
    heap.insert(10);
    heap.insert(10);

    assert.equal(heap.size(), 3);
    assert.equal(heap.peek(), 10);
});

test("7. Negative values", () => {
    const heap = new MinHeap();

    heap.insert(-10);
    heap.insert(-5);
    heap.insert(-20);
    heap.insert(0);

    assert.equal(heap.peek(), -20);
});

test("8. Zero value", () => {
    const heap = new MinHeap();

    heap.insert(5);
    heap.insert(0);
    heap.insert(10);

    assert.equal(heap.peek(), 0);
});

test("9. isEmpty after insertion", () => {
    const heap = new MinHeap();

    heap.insert(10);

    assert.equal(heap.isEmpty(), false);
});

test("10. Peek does not remove element", () => {
    const heap = new MinHeap();

    heap.insert(5);
    heap.insert(10);
    heap.insert(2);

    assert.equal(heap.peek(), 2);
    assert.equal(heap.peek(), 2);
    assert.equal(heap.size(), 3);
});

test("11. Extract minimum", () => {
    const heap = new MinHeap();

    heap.insert(10);
    heap.insert(5);
    heap.insert(20);
    heap.insert(2);

    assert.equal(heap.extractMin(), 2);
    assert.equal(heap.peek(), 5);
    assert.equal(heap.size(), 3);
});

test("12. Extract minimum repeatedly", () => {
    const heap = new MinHeap();

    heap.insert(10);
    heap.insert(5);
    heap.insert(20);
    heap.insert(2);
    heap.insert(8);

    assert.equal(heap.extractMin(), 2);
    assert.equal(heap.extractMin(), 5);
    assert.equal(heap.extractMin(), 8);
    assert.equal(heap.extractMin(), 10);
    assert.equal(heap.extractMin(), 20);
});

test("13. Extract from empty heap", () => {
    const heap = new MinHeap();

    assert.equal(heap.extractMin(), undefined);
    assert.equal(heap.size(), 0);
});

test("14. Extract only element", () => {
    const heap = new MinHeap();

    heap.insert(10);

    assert.equal(heap.extractMin(), 10);
    assert.equal(heap.size(), 0);
    assert.equal(heap.peek(), undefined);
    assert.equal(heap.isEmpty(), true);
});

test("15. Delete existing value", () => {
    const heap = new MinHeap();

    heap.insert(10);
    heap.insert(5);
    heap.insert(20);
    heap.insert(2);

    assert.equal(heap.delete(10), true);
    assert.equal(heap.size(), 3);
    assert.equal(heap.peek(), 2);
});

test("16. Delete missing value", () => {
    const heap = new MinHeap();

    heap.insert(10);
    heap.insert(5);

    assert.equal(heap.delete(100), false);
    assert.equal(heap.size(), 2);
});

test("17. Delete last element", () => {
    const heap = new MinHeap();

    heap.insert(10);
    heap.insert(5);
    heap.insert(20);

    assert.equal(heap.delete(20), true);
    assert.equal(heap.size(), 2);
    assert.equal(heap.peek(), 5);
});

test("18. Delete minimum value", () => {
    const heap = new MinHeap();

    heap.insert(10);
    heap.insert(5);
    heap.insert(20);
    heap.insert(2);

    assert.equal(heap.delete(2), true);
    assert.equal(heap.peek(), 5);
});

test("19. Delete same value twice", () => {
    const heap = new MinHeap();

    heap.insert(10);
    heap.insert(5);

    assert.equal(heap.delete(5), true);
    assert.equal(heap.delete(5), false);
    assert.equal(heap.size(), 1);
});

test("20. Delete duplicate values one at a time", () => {
    const heap = new MinHeap();

    heap.insert(5);
    heap.insert(5);
    heap.insert(10);

    assert.equal(heap.delete(5), true);
    assert.equal(heap.size(), 2);
    assert.equal(heap.delete(5), true);
    assert.equal(heap.size(), 1);
    assert.equal(heap.peek(), 10);
});

test("21. Build heap from unsorted array", () => {
    const heap = new MinHeap();

    heap.buildHeap([10, 5, 30, 2, 8, 15, 1]);

    assert.equal(heap.peek(), 1);
    assert.equal(heap.size(), 7);
});

test("22. Build heap with empty array", () => {
    const heap = new MinHeap();

    heap.buildHeap([]);

    assert.equal(heap.size(), 0);
    assert.equal(heap.peek(), undefined);
    assert.equal(heap.isEmpty(), true);
});

test("23. Build heap with one value", () => {
    const heap = new MinHeap();

    heap.buildHeap([42]);

    assert.equal(heap.peek(), 42);
    assert.equal(heap.size(), 1);
});

test("24. Build heap and extract everything in sorted order", () => {
    const heap = new MinHeap();

    heap.buildHeap([10, 3, 7, 1, 8, 2, 5]);

    assert.equal(heap.extractMin(), 1);
    assert.equal(heap.extractMin(), 2);
    assert.equal(heap.extractMin(), 3);
    assert.equal(heap.extractMin(), 5);
    assert.equal(heap.extractMin(), 7);
    assert.equal(heap.extractMin(), 8);
    assert.equal(heap.extractMin(), 10);
});

test("25. Heap remains valid after mixed operations", () => {
    const heap = new MinHeap();

    heap.insert(10);
    heap.insert(4);
    heap.insert(15);
    heap.insert(2);
    heap.insert(8);

    assert.equal(heap.extractMin(), 2);

    heap.insert(1);

    assert.equal(heap.delete(10), true);
    assert.equal(heap.peek(), 1);

    assert.equal(heap.extractMin(), 1);
    assert.equal(heap.extractMin(), 4);
    assert.equal(heap.extractMin(), 8);
    assert.equal(heap.extractMin(), 15);

    assert.equal(heap.isEmpty(), true);
});

console.log("\nMin Heap tests starting...\n");