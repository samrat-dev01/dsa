export class QueueNode {
    value;
    /** @type {QueueNode} */
    next;

    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

export class LinkedQueue {
    /** @type {QueueNode} */
    front = null;

    /** @type {QueueNode} */
    rear = null;

    size = 0;

    enqueue(val) {
        const node = new QueueNode(val);

        if (!this.front) this.front = node;

        if (!this.rear) {
            this.rear = node;
        } else {
            this.rear.next = node;
            this.rear = node;
        }

        this.size++
    }

    dequeue() {
        if (!this.front) return undefined;

        const value = this.front.value;

        this.front = this.front.next;

        if (!this.front) this.rear = null;

        this.size--;

        return value
    }

    peek() {
        return this.front?.value
    }

    isEmpty() {
        return this.size === 0
    }
}