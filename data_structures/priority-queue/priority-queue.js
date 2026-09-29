export class PriorityQueueNode {
    value;
    priority;
    order;

    constructor(value, priority, order = 0) {
        this.value = value;
        this.priority = priority;
        this.order = order;
    }
}

export class PriorityQueue {
    heap = [];
    size = 0;
    #nextOrder = 0;

    /** Add an item. Lower numeric priorities are dequeued first. */
    enqueue(value, priority) {
        if (typeof priority !== "number" || !Number.isFinite(priority)) {
            throw new TypeError("Priority must be a finite number");
        }

        const node = new PriorityQueueNode(value, priority, this.#nextOrder++);
        this.heap.push(node);
        this.size++;
        this.#heapifyUp(this.size - 1);
        return node;
    }

    /** Remove and return the highest-priority node, or undefined when empty. */
    dequeue() {
        if (this.size === 0) return undefined;

        const first = this.heap[0];
        const last = this.heap.pop();
        this.size--;

        if (this.size > 0) {
            this.heap[0] = last;
            this.#heapifyDown(0);
        }

        return first;
    }

    peek() {
        return this.heap[0];
    }

    isEmpty() {
        return this.size === 0;
    }

    #hasHigherPriority(first, second) {
        return first.priority < second.priority ||
            (first.priority === second.priority && first.order < second.order);
    }

    #heapifyUp(index) {
        while (index > 0) {
            const parent = Math.floor((index - 1) / 2);
            if (!this.#hasHigherPriority(this.heap[index], this.heap[parent])) break;

            [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
            index = parent;
        }
    }

    #heapifyDown(index) {
        while (true) {
            const left = index * 2 + 1;
            const right = index * 2 + 2;
            let highest = index;

            if (left < this.size && this.#hasHigherPriority(this.heap[left], this.heap[highest])) {
                highest = left;
            }
            if (right < this.size && this.#hasHigherPriority(this.heap[right], this.heap[highest])) {
                highest = right;
            }
            if (highest === index) break;

            [this.heap[index], this.heap[highest]] = [this.heap[highest], this.heap[index]];
            index = highest;
        }
    }
}