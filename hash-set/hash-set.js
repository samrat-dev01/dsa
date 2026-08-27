
export function getHash(key, size = 5) {
    const str = String(key);
    let result = 0;

    for (const ch of str) {
        result = (result * 31 + ch.charCodeAt(0)) % size;
    }

    return result;
}

export class HashSet {
    #bucket = [];
    #tableSize = 10;
    #size = 0;

    constructor(tableSize = 10) {
        this.#tableSize = tableSize
        this.#bucket = Array.from({ length: tableSize })
    }

    #getHash(str = "") {
        return getHash(str, this.#tableSize)
    }

    has(item) {
        const hash = this.#getHash(item);
        const entries = this.#bucket[hash] || [];

        for (const el of entries) {
            if (el === item) return true
        }

        return false
    }

    add(item) {
        const hash = this.#getHash(item);

        if (!this.#bucket[hash]) {
            this.#bucket[hash] = [item]
            this.#size++
        } else {
            const entries = this.#bucket[hash];

            for (const el of entries) {
                if (el === item) return
            }

            this.#bucket[hash].push(item)
            this.#size++
        }
    }

    delete(item) {
        const hash = this.#getHash(item);
        const entries = this.#bucket[hash] || [];

        for (let i = 0; i < entries.length; i++) {
            if (entries[i] === item) {
                this.#bucket[hash].splice(i, 1)
                if (this.#bucket[hash].length === 0) this.#bucket[hash] = undefined
                this.#size--
                return true
            }
        }

        return false
    }

    size() {
        return this.#size
    }

    clear() {
        this.#bucket = Array.from({ length: this.#tableSize });
        this.#size = 0
    }
}