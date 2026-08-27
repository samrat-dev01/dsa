export class StackNode {
    value;
    /** @type {StackNode} */
    next;

    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

export class LinkedStack {
    /** @type {StackNode} */
    head = null;
    size = 0;

    push(value) {
        const node = new StackNode(value)

        node.next = this.head;
        this.head = node

        this.size++
    }

    pop() {
        if (!this.head) return undefined;

        const value = this.head.value;

        this.head = this.head.next
        this.size--;

        return value
    }

    peek() {
        if (!this.head) return undefined;
        return this.head.value
    }

    isEmpty() {
        return this.size === 0
    }

    size() {
        return this.size
    }
}