
export function getHash(str, size = 5) {
    let result = 0;

    for (const ch of str) {
        result = (result * 31 + ch.charCodeAt(0)) % size;
    }

    return result;
}

export class HashTable {
    #bucket = [];
    #tableSize = 10;
    size = 0;

    constructor(tableSize = 10) {
        this.#tableSize = tableSize
        this.#bucket = Array.from({ length: tableSize })
    }

    #getHash(str = "") {
        return getHash(str, this.#tableSize)
    }

    get(key) {
        const hash = this.#getHash(key);
        const entries = this.#bucket[hash] || [];

        for (let item of entries) {
            if (item[0] === key) {
                return item[1]
            }
        }

        return undefined
    }

    has(key) {
        const hash = this.#getHash(key);
        const entries = this.#bucket[hash] || [];

        for (let item of entries) {
            if (item[0] === key) {
                return true
            }
        }

        return false
    }

    set(key, value) {
        const hash = this.#getHash(key);

        if (!this.#bucket[hash]) {
            this.#bucket[hash] = [[key, value]];
            this.size++
        } else {
            const existing = this.#bucket[hash] || [];
            let found = false;

            for (let index = 0; index < existing.length; index++) {
                const item = existing[index];

                if (item[0] === key) {
                    this.#bucket[hash][index] = [key, value];
                    found = true
                }
            }

            if (!found) {
                this.#bucket[hash].push([key, value])
                this.size++
            }
        }
    }

    delete(key) {
        const hash = this.#getHash(key);
        const entries = this.#bucket[hash] || [];

        for (let index = 0; index < entries.length; index++) {
            const item = entries[index];

            if (item[0] === key) {
                this.#bucket[hash].splice(index, 1)
                if (this.#bucket[hash].length === 0) this.#bucket[hash] = undefined
                this.size--
                return true
            }
        }

        return false
    }
}

