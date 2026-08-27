export class Stack {
  #container = [];
  #top = 0;

  constructor() {}

  push(item) {
    this.#container.push(item);
    this.#top++;
  }

  pop() {
    if (this.#top == 0) return undefined;
    const last = this.#container[this.#top - 1];
    this.#container.length = this.#top - 1;
    this.#top--;
    return last;
  }

  peek() {
    return this.#container[this.#top - 1];
  }

  isEmpty() {
    return this.#top === 0;
  }

  size() {
    return this.#top;
  }
}