import assert from "node:assert/strict";
import test from "node:test";
import { LinkedQueue } from "./linked-queue.js";

test("new queue should be empty", () => {
    const queue = new LinkedQueue();

    assert.equal(queue.front, null);
    assert.equal(queue.rear, null);
    assert.equal(queue.size, 0);
});

test("enqueue into empty queue", () => {
    const queue = new LinkedQueue();

    queue.enqueue(10);

    assert.equal(queue.front.value, 10);
    assert.equal(queue.rear.value, 10);
    assert.equal(queue.front, queue.rear);
    assert.equal(queue.size, 1);
});

test("enqueue multiple values", () => {
    const queue = new LinkedQueue();

    queue.enqueue(10);
    queue.enqueue(20);
    queue.enqueue(30);

    assert.equal(queue.size, 3);
    assert.equal(queue.front.value, 10);
    assert.equal(queue.rear.value, 30);

    assert.equal(queue.front.next.value, 20);
    assert.equal(queue.front.next.next.value, 30);
    assert.equal(queue.front.next.next.next, null);
});

test("enqueue should maintain correct rear pointer", () => {
    const queue = new LinkedQueue();

    queue.enqueue(10);
    queue.enqueue(20);
    queue.enqueue(30);

    assert.equal(queue.rear.value, 30);
    assert.equal(queue.rear.next, null);
});

test("dequeue should remove from front", () => {
    const queue = new LinkedQueue();

    queue.enqueue(10);
    queue.enqueue(20);
    queue.enqueue(30);

    assert.equal(queue.dequeue(), 10);
    assert.equal(queue.front.value, 20);
    assert.equal(queue.rear.value, 30);
    assert.equal(queue.size, 2);
});

test("dequeue should follow FIFO order", () => {
    const queue = new LinkedQueue();

    queue.enqueue(10);
    queue.enqueue(20);
    queue.enqueue(30);

    assert.equal(queue.dequeue(), 10);
    assert.equal(queue.dequeue(), 20);
    assert.equal(queue.dequeue(), 30);
});

test("dequeue from empty queue should return undefined", () => {
    const queue = new LinkedQueue();

    assert.equal(queue.dequeue(), undefined);
    assert.equal(queue.front, null);
    assert.equal(queue.rear, null);
    assert.equal(queue.size, 0);
});

test("dequeue last element should reset front and rear", () => {
    const queue = new LinkedQueue();

    queue.enqueue(10);

    assert.equal(queue.dequeue(), 10);

    assert.equal(queue.front, null);
    assert.equal(queue.rear, null);
    assert.equal(queue.size, 0);
});

test("peek should return front value without removing it", () => {
    const queue = new LinkedQueue();

    queue.enqueue(10);
    queue.enqueue(20);
    queue.enqueue(30);

    assert.equal(queue.peek(), 10);

    assert.equal(queue.front.value, 10);
    assert.equal(queue.rear.value, 30);
    assert.equal(queue.size, 3);
});

test("peek on empty queue should return undefined", () => {
    const queue = new LinkedQueue();

    assert.equal(queue.peek(), undefined);
    assert.equal(queue.size, 0);
});

test("isEmpty should return true for empty queue", () => {
    const queue = new LinkedQueue();

    assert.equal(queue.isEmpty(), true);
});

test("isEmpty should return false when queue has elements", () => {
    const queue = new LinkedQueue();

    queue.enqueue(10);

    assert.equal(queue.isEmpty(), false);
});

test("isEmpty should become true after removing all elements", () => {
    const queue = new LinkedQueue();

    queue.enqueue(10);
    queue.enqueue(20);

    queue.dequeue();
    queue.dequeue();

    assert.equal(queue.isEmpty(), true);
    assert.equal(queue.front, null);
    assert.equal(queue.rear, null);
    assert.equal(queue.size, 0);
});

test("enqueue after dequeue should work", () => {
    const queue = new LinkedQueue();

    queue.enqueue(10);
    queue.enqueue(20);

    assert.equal(queue.dequeue(), 10);

    queue.enqueue(30);

    assert.equal(queue.front.value, 20);
    assert.equal(queue.rear.value, 30);
    assert.equal(queue.size, 2);

    assert.equal(queue.dequeue(), 20);
    assert.equal(queue.dequeue(), 30);
});

test("enqueue after completely emptying queue should work", () => {
    const queue = new LinkedQueue();

    queue.enqueue(10);

    assert.equal(queue.dequeue(), 10);

    queue.enqueue(20);

    assert.equal(queue.front.value, 20);
    assert.equal(queue.rear.value, 20);
    assert.equal(queue.size, 1);
});

test("queue should maintain correct links", () => {
    const queue = new LinkedQueue();

    queue.enqueue(10);
    queue.enqueue(20);
    queue.enqueue(30);

    const first = queue.front;
    const second = first.next;
    const third = second.next;

    assert.equal(first.value, 10);
    assert.equal(second.value, 20);
    assert.equal(third.value, 30);

    assert.equal(first.next, second);
    assert.equal(second.next, third);
    assert.equal(third.next, null);

    assert.equal(queue.rear, third);
});


console.log("\nLinked Queue tests starting...\n");
