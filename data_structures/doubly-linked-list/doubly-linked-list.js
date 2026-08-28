export class DoublyLinkedNode {
    /** @type { DoublyLinkedNode } */
    prev = null;
    value;
    /** @type { DoublyLinkedNode } */
    next = null;

    constructor(val) {
        this.value = val
    }
}

export class DoublyLinkedList {
    /** @type {DoublyLinkedNode} */
    head = null;
    /** @type {DoublyLinkedNode} */
    tail = null;

    size = 0;

    append(value) {
        const node = new DoublyLinkedNode(value);

        if (!this.head) this.head = node;

        if (!this.tail) this.tail = node;
        else {
            this.tail.next = node; // 10.next => 20
            node.prev = this.tail // 20.prev => 10
            this.tail = node // 10 => 20
        }

        this.size++
    }

    prepend(value) {
        const node = new DoublyLinkedNode(value);

        if (this.head) {
            node.next = this.head;
            this.head.prev = node;
            this.head = node
        } else {
            this.head = node;
            this.tail = node;
        }

        this.size++
    }

    get(index) {
        if (index < 0 || index >= this.size) return undefined;

        /** @type {DoublyLinkedNode} */
        let current

        if (index < this.size / 2) {
            // Start at index 0
            current = this.head;
            let step = 0;

            while (index > step) {
                current = current.next;
                step++;
            }
        } else {
            // Start at index size - 1
            current = this.tail;
            let step = this.size - 1;

            while (index < step) {
                current = current.prev;
                step--;
            }
        }

        return current
    }

    find(value) {
        let current = this.head;

        let step = 0;
        while (this.size > step) {
            step++
            if (current.value === value) {
                return current
            }
            current = current.next
        }

        return undefined
    }

    remove(index) {
        if (index < 0 || index >= this.size) return undefined;

        const current = this.get(index);

        // Only node
        if (this.size === 1) {
            this.head = null;
            this.tail = null;
        }

        // Remove head
        else if (current === this.head) {
            this.head = current.next;
            this.head.prev = null;
        }

        // Remove tail
        else if (current === this.tail) {
            this.tail = current.prev;
            this.tail.next = null;
        }

        // Remove middle
        else {
            current.prev.next = current.next;
            current.next.prev = current.prev;
        }

        this.size--;

        // Disconnect removed node
        current.prev = null;
        current.next = null;

        return current;
    }

    insertAt(index, value) {
        if (index < 0 || index > this.size) return false;

        if (index === 0) {
            this.prepend(value)
            return true
        }
        if (index === this.size) {
            this.append(value)
            return true
        }

        const node = new DoublyLinkedNode(value);
        const current = this.get(index - 1);

        // 10 ⇄ 20 ⇄ 40
        //         ↑
        //     insert 30
        node.next = current.next // 30.next => 40
        node.prev = current // 30.prev => 20
        current.next.prev = node // 40.prev => 30
        current.next = node; // 20.next => 30

        this.size++

        return true
    }

    reverse() {
        let current = this.head;

        let step = 0;
        while (this.size > step) {
            // Current node before reversing:
            //
            // prev ← current → next
            //
            // Example:
            // null ← 10 → 20

            // Save the original next node.
            // We need this to move forward after changing current.next.
            const next = current.next; // 20

            // Save the original previous node.
            // We need this because current.prev is about to be changed.
            const prev = current.prev; // null

            // Reverse the forward direction.
            // The old previous node becomes the new next node.
            //
            // 10.next: null → becomes null
            // 20.next: 10
            current.next = prev;

            // Reverse the backward direction.
            // The old next node becomes the new previous node.
            //
            // 10.prev: null → 20
            current.prev = next;

            // Move to the ORIGINAL next node.
            // We use the saved `next` because current.next has already changed.
            current = next;

            step++;
        }

        // Finally, swap head and tail because the entire list is reversed.
        //
        // Before:
        // head → 10 ⇄ 20 ⇄ 30 ⇄ 40 ← tail
        //
        // After:
        // head → 40 ⇄ 30 ⇄ 20 ⇄ 10 ← tail
        [this.head, this.tail] = [this.tail, this.head];
    }

    clear() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
}