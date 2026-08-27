import test from "node:test";
import assert from "node:assert/strict";
import { LinkedStack } from "./linked-stack.js";

test("new stack should be empty", () => {
    const stack = new LinkedStack();

    assert.equal(stack.head, null);
    assert.equal(stack.size, 0);
});

test("push into empty stack", () => {
    const stack = new LinkedStack();

    stack.push(10);

    assert.equal(stack.head.value, 10);
    assert.equal(stack.head.next, null);
    assert.equal(stack.size, 1);
});

test("push multiple values", () => {
    const stack = new LinkedStack();

    stack.push(10);
    stack.push(20);
    stack.push(30);

    assert.equal(stack.size, 3);
    assert.equal(stack.head.value, 30);
    assert.equal(stack.head.next.value, 20);
    assert.equal(stack.head.next.next.value, 10);
    assert.equal(stack.head.next.next.next, null);
});

test("push should follow LIFO order", () => {
    const stack = new LinkedStack();

    stack.push(10);
    stack.push(20);
    stack.push(30);

    assert.equal(stack.pop(), 30);
    assert.equal(stack.pop(), 20);
    assert.equal(stack.pop(), 10);
});

test("pop should remove top element", () => {
    const stack = new LinkedStack();

    stack.push(10);
    stack.push(20);
    stack.push(30);

    const value = stack.pop();

    assert.equal(value, 30);
    assert.equal(stack.head.value, 20);
    assert.equal(stack.size, 2);
});

test("pop from empty stack should return undefined", () => {
    const stack = new LinkedStack();

    assert.equal(stack.pop(), undefined);
    assert.equal(stack.size, 0);
    assert.equal(stack.head, null);
});

test("pop last element", () => {
    const stack = new LinkedStack();

    stack.push(10);

    assert.equal(stack.pop(), 10);
    assert.equal(stack.head, null);
    assert.equal(stack.size, 0);
});

test("peek should return top value without removing it", () => {
    const stack = new LinkedStack();

    stack.push(10);
    stack.push(20);
    stack.push(30);

    assert.equal(stack.peek(), 30);

    assert.equal(stack.head.value, 30);
    assert.equal(stack.size, 3);
});

test("peek on empty stack should return undefined", () => {
    const stack = new LinkedStack();

    assert.equal(stack.peek(), undefined);
    assert.equal(stack.size, 0);
});

test("isEmpty should return true for empty stack", () => {
    const stack = new LinkedStack();

    assert.equal(stack.isEmpty(), true);
});

test("isEmpty should return false when stack has elements", () => {
    const stack = new LinkedStack();

    stack.push(10);

    assert.equal(stack.isEmpty(), false);
});

test("isEmpty should become true after removing all elements", () => {
    const stack = new LinkedStack();

    stack.push(10);
    stack.push(20);

    stack.pop();
    stack.pop();

    assert.equal(stack.isEmpty(), true);
    assert.equal(stack.size, 0);
    assert.equal(stack.head, null);
});

test("push after pop should work", () => {
    const stack = new LinkedStack();

    stack.push(10);
    stack.push(20);

    assert.equal(stack.pop(), 20);

    stack.push(30);

    assert.equal(stack.head.value, 30);
    assert.equal(stack.head.next.value, 10);
    assert.equal(stack.size, 2);
});

test("stack should maintain correct links", () => {
    const stack = new LinkedStack();

    stack.push(10);
    stack.push(20);
    stack.push(30);

    const first = stack.head;
    const second = first.next;
    const third = second.next;

    assert.equal(first.value, 30);
    assert.equal(second.value, 20);
    assert.equal(third.value, 10);

    assert.equal(first.next, second);
    assert.equal(second.next, third);
    assert.equal(third.next, null);
});


console.log("\nLinked Stack tests starting...\n");
