export class MyNode {
  value = null;
  next = null;

  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

export class LinkedList {
  head = null;
  tail = null;
  size = 0;

  append(value) {
    const node = new MyNode(value);

    if (!this.head) this.head = node;

    if (!this.tail) this.tail = node;
    else {
      this.tail.next = node; // connect new node to tail.next 
      this.tail = node; // then set the node as tail
    }

    this.size++;
  }

  prepend(value) {
    const node = new MyNode(value);
    if (this.head) node.next = this.head;
    this.head = node;
    if (!this.tail) this.tail = node;
    this.size++;
  }

  get(index) {
    if (index < 0) return undefined;
    if (index >= this.size) return undefined;

    let current = this.head;
    let step = 0;

    while (index > step) {
      current = current?.next;
      step++;
    }

    return current?.value;
  }

  find(value) {
    let current = this.head;

    while (current != null) {
      if (current.value === value) {
        return current;
      }
      current = current.next;
    }
  }

  remove(index) {
    if (index < 0) return;
    if (index >= this.size) return;

    if (index === 0) {
      this.head = this.head.next || null;
      if (this.size == 1) this.tail = null;
      this.size--;
      return;
    }

    let previous = this.head;
    let step = 0;

    while (index - 1 > step) {
      previous = previous.next;
      step++;
    }

    let current = previous.next;
    previous.next = current.next;

    if (current == this.tail) {
      this.tail = previous;
    }

    this.size--;

    return;
  }
}