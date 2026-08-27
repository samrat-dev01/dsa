export class DequeNode {
    value;
    /** @type {DequeNode} */
    prev = null;
    /** @type {DequeNode} */
    next = null;

    constructor(value) {
        this.value = value;
    }
}

export class Deque {
    /** @type {DequeNode} */
    head = null;
    /** @type {DequeNode} */
    tail = null;

    size = 0;

    addFront(value) {
        const node = new DequeNode(value);
        if (!this.head) {
            this.head = node;
            this.tail = node
        } else {
            node.next = this.head;
            this.head.prev = node
            this.head = node
        }
        this.size++
    }

    addRear(value) {
        const node = new DequeNode(value);

        if (!this.tail) {
            this.tail = node;
            this.head = node
        } else {
            node.prev = this.tail;
            this.tail.next = node;
            this.tail = node
        }

        this.size++
    }

    removeFront() {
        if (!this.head) return undefined;

        const value = this.head.value;

        this.head = this.head.next;

        // if head exists -> set head.prev = null
        if (this.head) {
            this.head.prev = null;
        }
        // head is not exist so, tail also should not exist 
        else {
            this.tail = null
        }

        this.size--

        return value
    }

    removeRear() {
        if (!this.tail) return undefined;

        const value = this.tail.value;

        this.tail = this.tail.prev

        // if tail exists -> set tail.next = null
        if (this.tail) {
            this.tail.next = null
        }
        // tail not exists so, head also should not exist
        else {
            this.head = null
        }

        this.size--

        return value
    }


    peekFront() {
        return this.head?.value;
    }

    peekRear() {
        return this.tail?.value
    }

    isEmpty() {
        return this.size === 0
    }

    clear() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
}