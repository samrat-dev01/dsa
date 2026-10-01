import assert from "node:assert/strict";
import test from "node:test";
import { PriorityQueue, PriorityQueueNode } from "./priority-queue.js";

test("PriorityQueue starts empty", () => {
    const queue = new PriorityQueue();

    assert.equal(queue.isEmpty(), true);
    assert.equal(queue.size, 0);
    assert.equal(queue.peek(), undefined);
    assert.equal(queue.dequeue(), undefined);
});

test("enqueue creates and returns a priority queue node", () => {
    const queue = new PriorityQueue();
    const node = queue.enqueue("task", 3);

    assert.ok(node instanceof PriorityQueueNode);
    assert.equal(node.value, "task");
    assert.equal(node.priority, 3);
    assert.equal(queue.size, 1);
    assert.equal(queue.isEmpty(), false);
});

test("dequeue returns nodes in ascending priority order", () => {
    const queue = new PriorityQueue();
    queue.enqueue("low", 10);
    queue.enqueue("urgent", 1);
    queue.enqueue("normal", 5);

    assert.deepEqual(
        [queue.dequeue().value, queue.dequeue().value, queue.dequeue().value],
        ["urgent", "normal", "low"]
    );
    assert.equal(queue.dequeue(), undefined);
    assert.equal(queue.size, 0);
    assert.equal(queue.isEmpty(), true);
});

test("items with equal priorities are dequeued in insertion order", () => {
    const queue = new PriorityQueue();
    queue.enqueue("first", 2);
    queue.enqueue("second", 2);
    queue.enqueue("third", 2);

    assert.deepEqual(
        [queue.dequeue().value, queue.dequeue().value, queue.dequeue().value],
        ["first", "second", "third"]
    );
});

test("peek returns the next node without removing it", () => {
    const queue = new PriorityQueue();
    queue.enqueue("later", 4);
    queue.enqueue("next", 2);

    assert.equal(queue.peek().value, "next");
    assert.equal(queue.peek().value, "next");
    assert.equal(queue.size, 2);
});

test("queue remains valid after mixed enqueue and dequeue operations", () => {
    const queue = new PriorityQueue();
    queue.enqueue("five", 5);
    queue.enqueue("two", 2);
    assert.equal(queue.dequeue().value, "two");

    queue.enqueue("one", 1);
    queue.enqueue("three", 3);

    assert.deepEqual(
        [queue.dequeue().value, queue.dequeue().value, queue.dequeue().value],
        ["one", "three", "five"]
    );
    assert.equal(queue.isEmpty(), true);
});

test("enqueue rejects non-finite or non-numeric priorities", () => {
    const queue = new PriorityQueue();

    for (const priority of ["1", NaN, Infinity, -Infinity, undefined]) {
        assert.throws(() => queue.enqueue("task", priority), TypeError);
    }

    assert.equal(queue.size, 0);
});

test("supports negative and zero priorities", () => {
    const queue = new PriorityQueue();
    queue.enqueue("zero", 0);
    queue.enqueue("negative", -2);

    assert.equal(queue.dequeue().value, "negative");
    assert.equal(queue.dequeue().value, "zero");
});



console.log("\nPriority Queue tests starting...\n");