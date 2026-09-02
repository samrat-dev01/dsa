import test from "node:test";
import assert from "node:assert/strict";

import { ListNode } from "../../data_structures/linked-list/linked-list.js";
import { findCycleStart } from "./find-cycle-start.js";

function createList(values) {
    if (values.length === 0) return null;

    const nodes = values.map(value => new ListNode(value));

    for (let i = 0; i < nodes.length - 1; i++) {
        nodes[i].next = nodes[i + 1];
    }

    return nodes[0];
}

function createCyclicList(values, cycleStartIndex) {
    const head = createList(values);

    if (!head) return null;

    let cycleStart = head;
    for (let i = 0; i < cycleStartIndex; i++) {
        cycleStart = cycleStart.next;
    }

    let tail = head;
    while (tail.next) {
        tail = tail.next;
    }

    tail.next = cycleStart;

    return {
        head,
        cycleStart,
    };
}

test("returns null for empty list", () => {
    assert.equal(findCycleStart(null), null);
});

test("returns null for single node without cycle", () => {
    const head = new ListNode(1);

    assert.equal(findCycleStart(head), null);
});

test("returns null when list has no cycle", () => {
    const head = createList([1, 2, 3, 4, 5]);

    assert.equal(findCycleStart(head), null);
});

test("finds cycle when node points to itself", () => {
    const head = new ListNode(1);
    head.next = head;

    assert.strictEqual(findCycleStart(head), head);
});

test("finds cycle starting at head", () => {
    const { head, cycleStart } = createCyclicList(
        [1, 2, 3, 4, 5],
        0
    );

    assert.strictEqual(findCycleStart(head), cycleStart);
});

test("finds cycle starting in the middle", () => {
    const { head, cycleStart } = createCyclicList(
        [1, 2, 3, 4, 5],
        2
    );

    assert.strictEqual(findCycleStart(head), cycleStart);
});

test("finds cycle starting near the tail", () => {
    const { head, cycleStart } = createCyclicList(
        [1, 2, 3, 4, 5, 6],
        4
    );

    assert.strictEqual(findCycleStart(head), cycleStart);
});

test("finds cycle containing all nodes except the head", () => {
    const { head, cycleStart } = createCyclicList(
        [1, 2, 3, 4, 5, 6, 7],
        1
    );

    assert.strictEqual(findCycleStart(head), cycleStart);
});

test("returns the actual cycle-start node, not just the value", () => {
    const { head, cycleStart } = createCyclicList(
        [10, 20, 30, 40],
        2
    );

    const result = findCycleStart(head);

    assert.strictEqual(result, cycleStart);
    assert.equal(result.value, 30);
});

test("handles a long cycle", () => {
    const values = Array.from({ length: 100 }, (_, i) => i);

    const { head, cycleStart } = createCyclicList(values, 37);

    assert.strictEqual(findCycleStart(head), cycleStart);
});