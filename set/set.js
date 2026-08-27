export class Set {
    #container = [];
    #size = 0;

    has(value) {
        for (let val of this.#container) {
            if (val === value) return true
        }

        return false
    }

    add(value) {
        if (!this.has(value)) {
            this.#container.push(value)
            this.#size++
        }
    }

    delete(value) {
        let itemIdx = -1
        for (let i = 0; i < this.#container.length; i++) {
            const item = this.#container[i]
            if (item === value) {
                itemIdx = i;
                break;
            }
        }

        if (itemIdx != -1) {
            this.#container = [...this.#container.slice(0, itemIdx), ...this.#container.slice(itemIdx + 1)]
            this.#size--;
            return true
        }

        return false
    }

    size() {
        return this.#size
    }

    clear() {
        this.#container = []
        this.#size = 0
    }
}