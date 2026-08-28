import test from "node:test";
import assert from "node:assert/strict";
import { DoublyLinkedList } from "./doubly-linked-list.js";

test("new list should be empty", () => {
    const list = new DoublyLinkedList();

    assert.equal(list.size, 0);
    assert.equal(list.head, null);
    assert.equal(list.tail, null);
});

test("append to empty list", () => {
    const list = new DoublyLinkedList();

    list.append(10);

    assert.equal(list.size, 1);
    assert.equal(list.head.value, 10);
    assert.equal(list.tail.value, 10);

    assert.equal(list.head.prev, null);
    assert.equal(list.head.next, null);
    assert.equal(list.tail.prev, null);
    assert.equal(list.tail.next, null);
});

test("append multiple values", () => {
    const list = new DoublyLinkedList();

    list.append(10);
    list.append(20);
    list.append(30);

    assert.equal(list.size, 3);
    assert.equal(list.head.value, 10);
    assert.equal(list.tail.value, 30);

    assert.equal(list.head.next.value, 20);
    assert.equal(list.head.next.next.value, 30);

    assert.equal(list.tail.prev.value, 20);
    assert.equal(list.tail.prev.prev.value, 10);
});

test("append should maintain bidirectional links", () => {
    const list = new DoublyLinkedList();

    list.append(10);
    list.append(20);
    list.append(30);

    const first = list.head;
    const second = first.next;
    const third = list.tail;

    assert.equal(first.prev, null);
    assert.equal(first.next, second);

    assert.equal(second.prev, first);
    assert.equal(second.next, third);

    assert.equal(third.prev, second);
    assert.equal(third.next, null);
});

test("prepend to empty list", () => {
    const list = new DoublyLinkedList();

    list.prepend(10);

    assert.equal(list.size, 1);
    assert.equal(list.head.value, 10);
    assert.equal(list.tail.value, 10);

    assert.equal(list.head.prev, null);
    assert.equal(list.head.next, null);
});

test("prepend multiple values", () => {
    const list = new DoublyLinkedList();

    list.prepend(30);
    list.prepend(20);
    list.prepend(10);

    assert.equal(list.size, 3);
    assert.equal(list.head.value, 10);
    assert.equal(list.tail.value, 30);

    assert.equal(list.head.next.value, 20);
    assert.equal(list.tail.prev.value, 20);
});

test("get should return correct node", () => {
    const list = new DoublyLinkedList();

    list.append(10);
    list.append(20);
    list.append(30);
    list.append(40);

    assert.equal(list.get(0).value, 10);
    assert.equal(list.get(1).value, 20);
    assert.equal(list.get(2).value, 30);
    assert.equal(list.get(3).value, 40);
});

test("get should handle invalid indexes", () => {
    const list = new DoublyLinkedList();

    list.append(10);
    list.append(20);

    assert.equal(list.get(-1), undefined);
    assert.equal(list.get(2), undefined);
    assert.equal(list.get(100), undefined);
});

test("find should return node when value exists", () => {
    const list = new DoublyLinkedList();

    list.append(10);
    list.append(20);
    list.append(30);

    const node = list.find(20);

    assert.ok(node);
    assert.equal(node.value, 20);
});

test("find should return undefined when value does not exist", () => {
    const list = new DoublyLinkedList();

    list.append(10);
    list.append(20);

    assert.equal(list.find(99), undefined);
});

test("remove head", () => {
    const list = new DoublyLinkedList();

    list.append(10);
    list.append(20);
    list.append(30);

    const removed = list.remove(0);

    assert.equal(removed.value, 10);
    assert.equal(list.size, 2);
    assert.equal(list.head.value, 20);
    assert.equal(list.tail.value, 30);

    assert.equal(list.head.prev, null);
    assert.equal(list.head.next.value, 30);
});

test("remove tail", () => {
    const list = new DoublyLinkedList();

    list.append(10);
    list.append(20);
    list.append(30);

    const removed = list.remove(2);

    assert.equal(removed.value, 30);
    assert.equal(list.size, 2);
    assert.equal(list.head.value, 10);
    assert.equal(list.tail.value, 20);

    assert.equal(list.tail.next, null);
    assert.equal(list.tail.prev.value, 10);
});

test("remove middle node", () => {
    const list = new DoublyLinkedList();

    list.append(10);
    list.append(20);
    list.append(30);

    const removed = list.remove(1);

    assert.equal(removed.value, 20);
    assert.equal(list.size, 2);

    assert.equal(list.head.value, 10);
    assert.equal(list.tail.value, 30);

    assert.equal(list.head.next, list.tail);
    assert.equal(list.tail.prev, list.head);
});

test("remove only node", () => {
    const list = new DoublyLinkedList();

    list.append(10);

    const removed = list.remove(0);

    assert.equal(removed.value, 10);
    assert.equal(list.size, 0);
    assert.equal(list.head, null);
    assert.equal(list.tail, null);
});

test("remove invalid index", () => {
    const list = new DoublyLinkedList();

    list.append(10);
    list.append(20);

    assert.equal(list.remove(-1), undefined);
    assert.equal(list.remove(2), undefined);

    assert.equal(list.size, 2);
});

test("removed node should be disconnected", () => {
    const list = new DoublyLinkedList();

    list.append(10);
    list.append(20);
    list.append(30);

    const removed = list.remove(1);

    assert.equal(removed.prev, null);
    assert.equal(removed.next, null);
});

test("insertAt beginning", () => {
    const list = new DoublyLinkedList();

    list.append(20);
    list.append(30);

    assert.equal(list.insertAt(0, 10), true);

    assert.equal(list.size, 3);
    assert.equal(list.head.value, 10);
    assert.equal(list.head.next.value, 20);
    assert.equal(list.head.prev, null);

    assert.equal(list.head.next.prev, list.head);
});

test("insertAt middle", () => {
    const list = new DoublyLinkedList();

    list.append(10);
    list.append(20);
    list.append(40);

    assert.equal(list.insertAt(2, 30), true);

    assert.equal(list.size, 4);

    assert.equal(list.get(0).value, 10);
    assert.equal(list.get(1).value, 20);
    assert.equal(list.get(2).value, 30);
    assert.equal(list.get(3).value, 40);

    const node20 = list.get(1);
    const node30 = list.get(2);
    const node40 = list.get(3);

    assert.equal(node20.next, node30);
    assert.equal(node30.prev, node20);

    assert.equal(node30.next, node40);
    assert.equal(node40.prev, node30);
});

test("insertAt end", () => {
    const list = new DoublyLinkedList();

    list.append(10);
    list.append(20);

    assert.equal(list.insertAt(2, 30), true);

    assert.equal(list.size, 3);
    assert.equal(list.tail.value, 30);
    assert.equal(list.tail.prev.value, 20);
    assert.equal(list.tail.next, null);
});

test("insertAt invalid index", () => {
    const list = new DoublyLinkedList();

    list.append(10);
    list.append(20);

    assert.equal(list.insertAt(-1, 5), false);
    assert.equal(list.insertAt(3, 30), false);

    assert.equal(list.size, 2);
});

test("reverse multiple nodes", () => {
    const list = new DoublyLinkedList();

    list.append(10);
    list.append(20);
    list.append(30);
    list.append(40);

    list.reverse();

    assert.equal(list.head.value, 40);
    assert.equal(list.tail.value, 10);

    assert.equal(list.head.next.value, 30);
    assert.equal(list.head.prev, null);

    assert.equal(list.tail.prev.value, 20);
    assert.equal(list.tail.next, null);

    assert.equal(list.get(0).value, 40);
    assert.equal(list.get(1).value, 30);
    assert.equal(list.get(2).value, 20);
    assert.equal(list.get(3).value, 10);
});

test("reverse single node", () => {
    const list = new DoublyLinkedList();

    list.append(10);

    list.reverse();

    assert.equal(list.head.value, 10);
    assert.equal(list.tail.value, 10);
    assert.equal(list.head.prev, null);
    assert.equal(list.head.next, null);
});

test("reverse empty list", () => {
    const list = new DoublyLinkedList();

    list.reverse();

    assert.equal(list.size, 0);
    assert.equal(list.head, null);
    assert.equal(list.tail, null);
});

test("clear should empty the list", () => {
    const list = new DoublyLinkedList();

    list.append(10);
    list.append(20);
    list.append(30);

    list.clear();

    assert.equal(list.size, 0);
    assert.equal(list.head, null);
    assert.equal(list.tail, null);
});

test("operations after clear should work", () => {
    const list = new DoublyLinkedList();

    list.append(10);
    list.append(20);

    list.clear();

    list.append(30);

    assert.equal(list.size, 1);
    assert.equal(list.head.value, 30);
    assert.equal(list.tail.value, 30);
    assert.equal(list.head.prev, null);
    assert.equal(list.head.next, null);
});


console.log("\nDoubly LinkedList tests starting...\n");