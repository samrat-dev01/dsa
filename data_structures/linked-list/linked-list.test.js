import assert from 'node:assert/strict';
import test from 'node:test';

import { LinkedList, MyNode } from './linked-list.js';

function values(list) {
  const result = [];

  let current = list.head;

  while (current) {
    result.push(current.value);
    current = current.next;
  }

  return result;
}

function createList(items) {
  const list = new LinkedList();

  for (const item of items) {
    list.append(item);
  }

  return list;
}

/* =====================================================
   MyNode
===================================================== */

test('MyNode: creates a node with value and null next', () => {
  const node = new MyNode(10);

  assert.equal(node.value, 10);
  assert.equal(node.next, null);
});

test('MyNode: accepts next node', () => {
  const next = new MyNode(20);
  const node = new MyNode(10, next);

  assert.equal(node.value, 10);
  assert.equal(node.next, next);
});

/* =====================================================
   Empty list
===================================================== */

test('LinkedList: creates an empty list', () => {
  const list = new LinkedList();

  assert.equal(list.head, null);
  assert.equal(list.tail, null);
  assert.equal(list.size, 0);
});

test('LinkedList: get on empty list returns undefined', () => {
  const list = new LinkedList();

  assert.equal(list.get(0), undefined);
  assert.equal(list.get(-1), undefined);
});

test('LinkedList: find on empty list returns undefined', () => {
  const list = new LinkedList();

  assert.equal(list.find(10), undefined);
});

test('LinkedList: remove on empty list does nothing', () => {
  const list = new LinkedList();

  list.remove(0);

  assert.equal(list.head, null);
  assert.equal(list.tail, null);
  assert.equal(list.size, 0);
});

/* =====================================================
   Append
===================================================== */

test('append: adds first node correctly', () => {
  const list = new LinkedList();

  list.append(10);

  assert.equal(list.size, 1);
  assert.equal(list.head.value, 10);
  assert.equal(list.tail.value, 10);

  // First node must be both head and tail
  assert.equal(list.head, list.tail);

  // Last node must point to null
  assert.equal(list.tail.next, null);
});

test('append: adds multiple nodes in correct order', () => {
  const list = new LinkedList();

  list.append(10);
  list.append(20);
  list.append(30);

  assert.deepEqual(values(list), [10, 20, 30]);

  assert.equal(list.size, 3);
  assert.equal(list.head.value, 10);
  assert.equal(list.tail.value, 30);
});

test('append: maintains correct links', () => {
  const list = createList([10, 20, 30]);

  assert.equal(list.head.next.value, 20);
  assert.equal(list.head.next.next.value, 30);
  assert.equal(list.tail.next, null);
});

/* =====================================================
   Prepend
===================================================== */

test('prepend: adds first node correctly', () => {
  const list = new LinkedList();

  list.prepend(10);

  assert.equal(list.size, 1);
  assert.equal(list.head.value, 10);
  assert.equal(list.tail.value, 10);
  assert.equal(list.head, list.tail);
});

test('prepend: adds nodes to the beginning', () => {
  const list = new LinkedList();

  list.prepend(30);
  list.prepend(20);
  list.prepend(10);

  assert.deepEqual(values(list), [10, 20, 30]);

  assert.equal(list.head.value, 10);
  assert.equal(list.tail.value, 30);
  assert.equal(list.size, 3);
});

test('prepend: preserves existing head', () => {
  const list = createList([20, 30]);

  const oldHead = list.head;

  list.prepend(10);

  assert.equal(list.head.value, 10);
  assert.equal(list.head.next, oldHead);
});

/* =====================================================
   Append + Prepend
===================================================== */

test('mixed append and prepend operations', () => {
  const list = new LinkedList();

  list.append(20);
  list.append(30);
  list.prepend(10);
  list.prepend(5);

  assert.deepEqual(values(list), [5, 10, 20, 30]);

  assert.equal(list.size, 4);
  assert.equal(list.head.value, 5);
  assert.equal(list.tail.value, 30);
});

/* =====================================================
   Get
===================================================== */

test('get: returns value at index', () => {
  const list = createList([10, 20, 30, 40, 50]);

  assert.equal(list.get(0), 10);
  assert.equal(list.get(1), 20);
  assert.equal(list.get(2), 30);
  assert.equal(list.get(3), 40);
  assert.equal(list.get(4), 50);
});

test('get: negative index returns undefined', () => {
  const list = createList([10, 20, 30]);

  assert.equal(list.get(-1), undefined);
  assert.equal(list.get(-100), undefined);
});

test('get: index greater than size returns undefined', () => {
  const list = createList([10, 20, 30]);

  assert.equal(list.get(3), undefined);
  assert.equal(list.get(100), undefined);
});

test('get: empty list returns undefined', () => {
  const list = new LinkedList();

  assert.equal(list.get(0), undefined);
});

/* =====================================================
   Find
===================================================== */

test('find: returns matching node', () => {
  const list = createList([10, 20, 30, 40]);

  const node = list.find(30);

  assert.ok(node);
  assert.equal(node.value, 30);
});

test('find: returns undefined when value does not exist', () => {
  const list = createList([10, 20, 30]);

  assert.equal(list.find(999), undefined);
});

test('find: returns the first matching node', () => {
  const list = createList([10, 20, 30, 20, 40]);

  const node = list.find(20);

  assert.equal(node, list.head.next);
});

/* =====================================================
   Remove head
===================================================== */

test('remove: removes head node', () => {
  const list = createList([10, 20, 30, 40]);

  list.remove(0);

  assert.deepEqual(values(list), [20, 30, 40]);

  assert.equal(list.size, 3);
  assert.equal(list.head.value, 20);
  assert.equal(list.tail.value, 40);
});

test('remove: updates head when removing first node', () => {
  const list = createList([10, 20]);

  const oldHead = list.head;

  list.remove(0);

  assert.notEqual(list.head, oldHead);
  assert.equal(list.head.value, 20);
});

/* =====================================================
   Remove middle
===================================================== */

test('remove: removes middle node', () => {
  const list = createList([10, 20, 30, 40, 50]);

  list.remove(2);

  assert.deepEqual(values(list), [10, 20, 40, 50]);

  assert.equal(list.size, 4);
});

test('remove: correctly reconnects nodes after middle removal', () => {
  const list = createList([10, 20, 30, 40]);

  list.remove(1);

  assert.equal(list.head.value, 10);
  assert.equal(list.head.next.value, 30);
  assert.equal(list.head.next.next.value, 40);
});

/* =====================================================
   Remove tail
===================================================== */

test('remove: removes tail', () => {
  const list = createList([10, 20, 30, 40]);

  list.remove(3);

  assert.deepEqual(values(list), [10, 20, 30]);

  assert.equal(list.size, 3);
  assert.equal(list.tail.value, 30);
});

test('remove: tail.next remains null', () => {
  const list = createList([10, 20, 30]);

  list.remove(2);

  assert.equal(list.tail.next, null);
});

/* =====================================================
   Remove only node
===================================================== */

test('remove: removing only node makes list empty', () => {
  const list = createList([100]);

  list.remove(0);

  assert.deepEqual(values(list), []);

  assert.equal(list.size, 0);
  assert.equal(list.head, null);
  assert.equal(list.tail, null);
});

/* =====================================================
   Remove until empty
===================================================== */

test('remove: can remove all nodes one by one', () => {
  const list = createList([10, 20, 30]);

  list.remove(0);
  list.remove(0);
  list.remove(0);

  assert.equal(list.size, 0);
  assert.equal(list.head, null);
  assert.equal(list.tail, null);
});

/* =====================================================
   Invalid remove
===================================================== */

test('remove: negative index does nothing', () => {
  const list = createList([10, 20, 30]);

  list.remove(-1);

  assert.deepEqual(values(list), [10, 20, 30]);
  assert.equal(list.size, 3);
});

test('remove: index equal to size does nothing', () => {
  const list = createList([10, 20, 30]);

  list.remove(3);

  assert.deepEqual(values(list), [10, 20, 30]);
  assert.equal(list.size, 3);
});

test('remove: very large index does nothing', () => {
  const list = createList([10, 20, 30]);

  list.remove(1000);

  assert.deepEqual(values(list), [10, 20, 30]);
  assert.equal(list.size, 3);
});

/* =====================================================
   Link integrity
===================================================== */

test('link integrity: tail.next is always null', () => {
  const list = createList([10, 20, 30, 40]);

  assert.equal(list.tail.next, null);
});

test('link integrity: nodes are correctly connected', () => {
  const list = createList([10, 20, 30, 40]);

  assert.equal(list.head.value, 10);
  assert.equal(list.head.next.value, 20);
  assert.equal(list.head.next.next.value, 30);
  assert.equal(list.head.next.next.next.value, 40);
  assert.equal(list.head.next.next.next.next, null);
});

test('link integrity: removing node reconnects surrounding nodes', () => {
  const list = createList([10, 20, 30, 40]);

  list.remove(1);

  assert.equal(list.head.next.value, 30);
  assert.equal(list.head.next.next.value, 40);
  assert.equal(list.tail.value, 40);
  assert.equal(list.tail.next, null);
});

console.log("\nLinkedList tests starting...\n");
