import test from "node:test";
import assert from "node:assert/strict";
import { Stack } from "./stack.js";


// ========================================
// INITIAL STATE
// ========================================


test("Stack - initial state", () => {
  const stack = new Stack();

  assert.equal(stack.isEmpty(), true);
  assert.equal(stack.size(), 0);
  assert.equal(stack.peek(), undefined);
  assert.equal(stack.pop(), undefined);
});


// ========================================
// PUSH
// ========================================

test("Stack - push one element", () => {
  const stack = new Stack();

  stack.push(10);

  assert.equal(stack.size(), 1);
  assert.equal(stack.isEmpty(), false);
  assert.equal(stack.peek(), 10);
});


test("Stack - push multiple elements", () => {
  const stack = new Stack();

  stack.push(10);
  stack.push(20);
  stack.push(30);

  assert.equal(stack.size(), 3);
  assert.equal(stack.peek(), 30);
  assert.equal(stack.isEmpty(), false);
});


// ========================================
// POP
// ========================================

test("Stack - pop returns the top element", () => {
  const stack = new Stack();

  stack.push(10);
  stack.push(20);
  stack.push(30);

  assert.equal(stack.pop(), 30);
  assert.equal(stack.size(), 2);

  assert.equal(stack.pop(), 20);
  assert.equal(stack.size(), 1);

  assert.equal(stack.pop(), 10);
  assert.equal(stack.size(), 0);

  assert.equal(stack.isEmpty(), true);
});


test("Stack - pop on empty stack returns undefined", () => {
  const stack = new Stack();

  assert.equal(stack.pop(), undefined);
  assert.equal(stack.size(), 0);
  assert.equal(stack.isEmpty(), true);
});


// ========================================
// PEEK
// ========================================

test("Stack - peek returns top element without removing it", () => {
  const stack = new Stack();

  stack.push(10);
  stack.push(20);
  stack.push(30);

  assert.equal(stack.peek(), 30);
  assert.equal(stack.peek(), 30);

  assert.equal(stack.size(), 3);
});


test("Stack - peek changes after pop", () => {
  const stack = new Stack();

  stack.push(10);
  stack.push(20);
  stack.push(30);

  assert.equal(stack.peek(), 30);

  stack.pop();

  assert.equal(stack.peek(), 20);

  stack.pop();

  assert.equal(stack.peek(), 10);

  stack.pop();

  assert.equal(stack.peek(), undefined);
});


// ========================================
// LIFO
// ========================================

test("Stack - follows LIFO order", () => {
  const stack = new Stack();

  stack.push("A");
  stack.push("B");
  stack.push("C");
  stack.push("D");

  assert.equal(stack.pop(), "D");
  assert.equal(stack.pop(), "C");
  assert.equal(stack.pop(), "B");
  assert.equal(stack.pop(), "A");

  assert.equal(stack.isEmpty(), true);
});


// ========================================
// MIXED OPERATIONS
// ========================================

test("Stack - mixed push and pop operations", () => {
  const stack = new Stack();

  stack.push(10);
  stack.push(20);
  stack.push(30);

  assert.equal(stack.pop(), 30);

  stack.push(40);
  stack.push(50);

  assert.equal(stack.peek(), 50);
  assert.equal(stack.size(), 4);

  assert.equal(stack.pop(), 50);
  assert.equal(stack.pop(), 40);
  assert.equal(stack.pop(), 20);

  assert.equal(stack.peek(), 10);
  assert.equal(stack.size(), 1);

  assert.equal(stack.pop(), 10);

  assert.equal(stack.isEmpty(), true);
  assert.equal(stack.size(), 0);
});


// ========================================
// EMPTY STACK
// ========================================

test("Stack - operations after becoming empty", () => {
  const stack = new Stack();

  stack.push(10);
  stack.push(20);

  stack.pop();
  stack.pop();

  assert.equal(stack.isEmpty(), true);
  assert.equal(stack.size(), 0);
  assert.equal(stack.peek(), undefined);
  assert.equal(stack.pop(), undefined);
});


// ========================================
// PUSH AFTER EMPTY
// ========================================

test("Stack - push after becoming empty", () => {
  const stack = new Stack();

  stack.push(10);
  stack.pop();

  assert.equal(stack.isEmpty(), true);

  stack.push(20);

  assert.equal(stack.isEmpty(), false);
  assert.equal(stack.size(), 1);
  assert.equal(stack.peek(), 20);
  assert.equal(stack.pop(), 20);
});


// ========================================
// DIFFERENT DATA TYPES
// ========================================

test("Stack - supports different data types", () => {
  const stack = new Stack();

  const object = { id: 1 };
  const array = [1, 2, 3];

  stack.push(10);
  stack.push("hello");
  stack.push(true);
  stack.push(null);
  stack.push(object);
  stack.push(array);

  assert.deepEqual(stack.pop(), array);
  assert.deepEqual(stack.pop(), object);
  assert.equal(stack.pop(), null);
  assert.equal(stack.pop(), true);
  assert.equal(stack.pop(), "hello");
  assert.equal(stack.pop(), 10);

  assert.equal(stack.isEmpty(), true);
});


// ========================================
// SIZE
// ========================================

test("Stack - size is updated correctly", () => {
  const stack = new Stack();

  assert.equal(stack.size(), 0);

  stack.push(10);
  assert.equal(stack.size(), 1);

  stack.push(20);
  assert.equal(stack.size(), 2);

  stack.push(30);
  assert.equal(stack.size(), 3);

  stack.pop();
  assert.equal(stack.size(), 2);

  stack.pop();
  assert.equal(stack.size(), 1);

  stack.pop();
  assert.equal(stack.size(), 0);
});


// ========================================
// LARGE INPUT
// ========================================

test("Stack - handles large number of elements", () => {
  const stack = new Stack();

  for (let i = 0; i < 1000; i++) {
    stack.push(i);
  }

  assert.equal(stack.size(), 1000);
  assert.equal(stack.peek(), 999);

  for (let i = 999; i >= 0; i--) {
    assert.equal(stack.pop(), i);
  }

  assert.equal(stack.size(), 0);
  assert.equal(stack.isEmpty(), true);
});

console.log("\nStack tests starting...\n");