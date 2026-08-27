export class Queue {
  #container = [];
  #front = 0;
  #rear = 0;

  enqueue(el) {
    this.#container.push(el);
    this.#rear++;
  }

  dequeue() {
    if (this.#front === this.#rear) return undefined;
    return this.#container[this.#front++];
  }

  peek() {
    return this.#container[this.#front];
  }

  isEmpty() {
    return this.#front === this.#rear;
  }

  size() {
    return this.#rear - this.#front;
  }
}