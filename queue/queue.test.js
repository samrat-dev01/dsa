// queue.test.js

import test from "node:test";
import assert from "node:assert/strict";
import { Queue } from "./queue.js";


test("Queue - initial state", () => {
  const queue = new Queue();

  assert.equal(queue.isEmpty(), true);
  assert.equal(queue.size(), 0);
  assert.equal(queue.peek(), undefined);
  assert.equal(queue.dequeue(), undefined);
});

test("Queue - enqueue one element", () => {
  const queue = new Queue();

  queue.enqueue(10);

  assert.equal(queue.peek(), 10);
  assert.equal(queue.size(), 1);
  assert.equal(queue.isEmpty(), false);
});

test("Queue - enqueue multiple elements", () => {
  const queue = new Queue();

  queue.enqueue(10);
  queue.enqueue(20);
  queue.enqueue(30);

  assert.equal(queue.peek(), 10);
  assert.equal(queue.size(), 3);
  assert.equal(queue.isEmpty(), false);
});

test("Queue - dequeue removes the front element", () => {
  const queue = new Queue();

  queue.enqueue(10);
  queue.enqueue(20);
  queue.enqueue(30);

  assert.equal(queue.dequeue(), 10);
  assert.equal(queue.peek(), 20);
  assert.equal(queue.size(), 2);

  assert.equal(queue.dequeue(), 20);
  assert.equal(queue.peek(), 30);
  assert.equal(queue.size(), 1);

  assert.equal(queue.dequeue(), 30);
  assert.equal(queue.peek(), undefined);
  assert.equal(queue.size(), 0);
  assert.equal(queue.isEmpty(), true);
});

test("Queue - FIFO order", () => {
  const queue = new Queue();

  queue.enqueue("A");
  queue.enqueue("B");
  queue.enqueue("C");
  queue.enqueue("D");

  assert.equal(queue.dequeue(), "A");
  assert.equal(queue.dequeue(), "B");
  assert.equal(queue.dequeue(), "C");
  assert.equal(queue.dequeue(), "D");

  assert.equal(queue.isEmpty(), true);
  assert.equal(queue.size(), 0);
});

test("Queue - peek does not remove element", () => {
  const queue = new Queue();

  queue.enqueue(10);
  queue.enqueue(20);

  assert.equal(queue.peek(), 10);
  assert.equal(queue.peek(), 10);

  assert.equal(queue.size(), 2);
  assert.equal(queue.dequeue(), 10);
});

test("Queue - dequeue on empty queue", () => {
  const queue = new Queue();

  assert.equal(queue.dequeue(), undefined);
  assert.equal(queue.dequeue(), undefined);

  assert.equal(queue.isEmpty(), true);
  assert.equal(queue.size(), 0);
});

test("Queue - peek on empty queue", () => {
  const queue = new Queue();

  assert.equal(queue.peek(), undefined);

  queue.enqueue(100);

  assert.equal(queue.dequeue(), 100);
  assert.equal(queue.peek(), undefined);
});

test("Queue - mixed enqueue and dequeue operations", () => {
  const queue = new Queue();

  queue.enqueue(10);
  queue.enqueue(20);
  queue.enqueue(30);

  assert.equal(queue.dequeue(), 10);

  queue.enqueue(40);
  queue.enqueue(50);

  assert.equal(queue.peek(), 20);
  assert.equal(queue.size(), 4);

  assert.equal(queue.dequeue(), 20);
  assert.equal(queue.dequeue(), 30);
  assert.equal(queue.dequeue(), 40);

  assert.equal(queue.peek(), 50);
  assert.equal(queue.size(), 1);

  assert.equal(queue.dequeue(), 50);

  assert.equal(queue.isEmpty(), true);
  assert.equal(queue.size(), 0);
});

test("Queue - works with different data types", () => {
  const queue = new Queue();

  const obj = { id: 1 };
  const arr = [1, 2, 3];

  queue.enqueue(10);
  queue.enqueue("hello");
  queue.enqueue(true);
  queue.enqueue(null);
  queue.enqueue(obj);
  queue.enqueue(arr);

  assert.equal(queue.dequeue(), 10);
  assert.equal(queue.dequeue(), "hello");
  assert.equal(queue.dequeue(), true);
  assert.equal(queue.dequeue(), null);
  assert.equal(queue.dequeue(), obj);
  assert.equal(queue.dequeue(), arr);

  assert.equal(queue.isEmpty(), true);
});

test("Queue - enqueue after becoming empty", () => {
  const queue = new Queue();

  queue.enqueue(10);
  queue.enqueue(20);

  assert.equal(queue.dequeue(), 10);
  assert.equal(queue.dequeue(), 20);

  assert.equal(queue.isEmpty(), true);
  assert.equal(queue.size(), 0);

  queue.enqueue(30);

  assert.equal(queue.isEmpty(), false);
  assert.equal(queue.size(), 1);
  assert.equal(queue.peek(), 30);
  assert.equal(queue.dequeue(), 30);
  assert.equal(queue.isEmpty(), true);
});

test("Queue - large number of elements", () => {
  const queue = new Queue();

  for (let i = 0; i < 1000; i++) {
    queue.enqueue(i);
  }

  assert.equal(queue.size(), 1000);

  for (let i = 0; i < 1000; i++) {
    assert.equal(queue.dequeue(), i);
  }

  assert.equal(queue.size(), 0);
  assert.equal(queue.isEmpty(), true);
});

console.log("\nQueue tests starting...\n");