export class MinHeap {
    #bucket = [];

    constructor() { }

    size() {
        return this.#bucket.length
    }

    insert(value) {
        this.#bucket.push(value);
        let insertedIdx = this.size() - 1;
        this.#heapifyUp(insertedIdx)
    }

    peek() {
        return this.#bucket?.[0]
    }

    #heapifyUp(index) {
        let parentIdx = Math.floor((index - 1) / 2);

        while (index > 0 && this.#bucket[parentIdx] > this.#bucket[index]) {

            [
                this.#bucket[parentIdx],
                this.#bucket[index]
            ] = [
                    this.#bucket[index],
                    this.#bucket[parentIdx]
                ];

            index = parentIdx
            parentIdx = Math.floor((index - 1) / 2)

        }
    }

    #heapifyDown(index) {
        // Heapify down
        while (true) {
            const leftIdx = 2 * index + 1;
            const rightIdx = 2 * index + 2;

            let smallestIdx = index;

            if (
                leftIdx < this.#bucket.length &&
                this.#bucket[leftIdx] < this.#bucket[smallestIdx]
            ) {
                smallestIdx = leftIdx;
            }

            if (
                rightIdx < this.#bucket.length &&
                this.#bucket[rightIdx] < this.#bucket[smallestIdx]
            ) {
                smallestIdx = rightIdx;
            }

            // Already in correct position
            if (smallestIdx === index) break;

            [
                this.#bucket[index],
                this.#bucket[smallestIdx]
            ] = [
                    this.#bucket[smallestIdx],
                    this.#bucket[index]
                ];

            index = smallestIdx;
        }
    }

    extractMin() {
        if (this.#bucket.length === 0) return undefined;
        if (this.#bucket.length === 1) return this.#bucket.shift();

        const min = this.#bucket[0];
        // Move last element to root
        this.#bucket[0] = this.#bucket.pop();
        this.#heapifyDown(0)

        return min;
    }

    isEmpty() {
        return this.#bucket.length === 0
    }

    /**
     * 
     * @param {Array<any>} values 
     */
    buildHeap(values) {
        this.#bucket = Array.from(values);

        const lastParentIdx = Math.floor(this.#bucket.length / 2) - 1;

        for (let i = lastParentIdx; i >= 0; i--) {
            this.#heapifyDown(i)
        }
    }

    delete(value) {
        let index = this.#bucket.indexOf(value);
        if (index == -1) return false;

        if (index === this.#bucket.length - 1) {
            this.#bucket.pop()
            return true
        }

        const last = this.#bucket[this.#bucket.length - 1];
        this.#bucket[index] = last;
        this.#bucket.pop()

        const parentIdx = Math.floor((index - 1) / 2)

        if (index > 0 && this.#bucket[parentIdx] > this.#bucket[index]) {
            this.#heapifyUp(index)
        } else {
            this.#heapifyDown(index)
        }

        return true
    }
}