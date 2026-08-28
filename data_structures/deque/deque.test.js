import { test } from "node:test";
import assert from "node:assert/strict";
import { Deque } from "./deque.js";

test("addFront should add element to the front", () => {
    const deque = new Deque();

    deque.addFront(10);
    deque.addFront(20);
    deque.addFront(30);

    assert.equal(deque.peekFront(), 30);
    assert.equal(deque.peekRear(), 10);
    assert.equal(deque.size, 3);
});

test("addRear should add element to the rear", () => {
    const deque = new Deque();

    deque.addRear(10);
    deque.addRear(20);
    deque.addRear(30);

    assert.equal(deque.peekFront(), 10);
    assert.equal(deque.peekRear(), 30);
    assert.equal(deque.size, 3);
});

test("should support adding from both ends", () => {
    const deque = new Deque();

    deque.addFront(20);
    deque.addFront(10);
    deque.addRear(30);
    deque.addRear(40);

    assert.equal(deque.peekFront(), 10);
    assert.equal(deque.peekRear(), 40);
    assert.equal(deque.size, 4);
});

test("removeFront should remove and return front element", () => {
    const deque = new Deque();

    deque.addRear(10);
    deque.addRear(20);
    deque.addRear(30);

    assert.equal(deque.removeFront(), 10);
    assert.equal(deque.peekFront(), 20);
    assert.equal(deque.peekRear(), 30);
    assert.equal(deque.size, 2);
});

test("removeRear should remove and return rear element", () => {
    const deque = new Deque();

    deque.addRear(10);
    deque.addRear(20);
    deque.addRear(30);

    assert.equal(deque.removeRear(), 30);
    assert.equal(deque.peekFront(), 10);
    assert.equal(deque.peekRear(), 20);
    assert.equal(deque.size, 2);
});

test("removeFront should handle single element", () => {
    const deque = new Deque();

    deque.addFront(10);

    assert.equal(deque.removeFront(), 10);
    assert.equal(deque.head, null);
    assert.equal(deque.tail, null);
    assert.equal(deque.size, 0);
});

test("removeRear should handle single element", () => {
    const deque = new Deque();

    deque.addRear(10);

    assert.equal(deque.removeRear(), 10);
    assert.equal(deque.head, null);
    assert.equal(deque.tail, null);
    assert.equal(deque.size, 0);
});

test("removeFront on empty deque should return undefined", () => {
    const deque = new Deque();

    assert.equal(deque.removeFront(), undefined);
    assert.equal(deque.size, 0);
});

test("removeRear on empty deque should return undefined", () => {
    const deque = new Deque();

    assert.equal(deque.removeRear(), undefined);
    assert.equal(deque.size, 0);
});

test("peekFront on empty deque should return undefined", () => {
    const deque = new Deque();

    assert.equal(deque.peekFront(), undefined);
});

test("peekRear on empty deque should return undefined", () => {
    const deque = new Deque();

    assert.equal(deque.peekRear(), undefined);
});

test("isEmpty should return correct result", () => {
    const deque = new Deque();

    assert.equal(deque.isEmpty(), true);

    deque.addFront(10);

    assert.equal(deque.isEmpty(), false);

    deque.removeFront();

    assert.equal(deque.isEmpty(), true);
});

test("clear should remove all elements", () => {
    const deque = new Deque();

    deque.addFront(10);
    deque.addRear(20);
    deque.addRear(30);

    deque.clear();

    assert.equal(deque.head, null);
    assert.equal(deque.tail, null);
    assert.equal(deque.size, 0);
    assert.equal(deque.isEmpty(), true);
    assert.equal(deque.peekFront(), undefined);
    assert.equal(deque.peekRear(), undefined);
});

test("should maintain prev and next pointers", () => {
    const deque = new Deque();

    deque.addRear(10);
    deque.addRear(20);
    deque.addRear(30);

    assert.equal(deque.head.value, 10);
    assert.equal(deque.head.prev, null);

    assert.equal(deque.head.next.value, 20);
    assert.equal(deque.head.next.prev.value, 10);

    assert.equal(deque.tail.value, 30);
    assert.equal(deque.tail.next, null);
    assert.equal(deque.tail.prev.value, 20);
});

test("should maintain pointers after removeFront", () => {
    const deque = new Deque();

    deque.addRear(10);
    deque.addRear(20);
    deque.addRear(30);

    deque.removeFront();

    assert.equal(deque.head.value, 20);
    assert.equal(deque.head.prev, null);
    assert.equal(deque.head.next.value, 30);
    assert.equal(deque.tail.value, 30);
    assert.equal(deque.tail.next, null);
});

test("should maintain pointers after removeRear", () => {
    const deque = new Deque();

    deque.addRear(10);
    deque.addRear(20);
    deque.addRear(30);

    deque.removeRear();

    assert.equal(deque.tail.value, 20);
    assert.equal(deque.tail.next, null);
    assert.equal(deque.tail.prev.value, 10);
    assert.equal(deque.head.value, 10);
    assert.equal(deque.head.prev, null);
});


console.log("\nDequeue tests starting...\n");
