export class PriorityQueueNode {
    value;
    priority;

    constructor(value, priority) {
        this.value = value;
        this.priority = priority;
    }
}

export class PriorityQueue {
    heap = [];
    size = 0;
}