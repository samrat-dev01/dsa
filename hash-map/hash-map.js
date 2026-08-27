
export function getHash(key, size = 5) {
    const str = String(key);
    let result = 0;

    for (const ch of str) {
        result = (result * 31 + ch.charCodeAt(0)) % size;
    }

    return result;
}

export class HashMap {
    #bucket = [];
    #mapSize = 5;
    #size = 0;

    constructor(mapSize = 5) {
        this.#mapSize = mapSize
        this.#bucket = Array.from({ length: mapSize })
    }

    size() { return this.#size }

    #getHash(key) {
        return getHash(key, this.#mapSize)
    }

    has(key) {
        const hash = this.#getHash(key);

        if (!this.#bucket[hash]) return false;

        const entries = this.#bucket[hash];

        for (let item of entries) {
            if (item[0] === key) {
                return true
            }
        }

        return false
    }

    get(key) {
        const hash = this.#getHash(key);

        if (!this.#bucket[hash]) return undefined;

        const entries = this.#bucket[hash];

        for (let item of entries) {
            if (item[0] === key) {
                return item[1]
            }
        }

        return undefined
    }

    set(key, value) {
        const hash = this.#getHash(key);

        if (!this.#bucket[hash]) {
            this.#bucket[hash] = [[key, value]]
            this.#size++
        } else {
            const entries = this.#bucket[hash]

            let found = false;

            for (let i = 0; i < entries.length; i++) {
                const item = entries[i]
                if (item[0] === key) {
                    this.#bucket[hash][i] = [key, value];
                    found = true
                    break
                }
            }

            if (!found) {
                this.#bucket[hash].push([key, value])
                this.#size++
            }
        }
    }

    delete(key) {
        const hash = this.#getHash(key);
        const entries = this.#bucket[hash] || [];

        for (let i = 0; i < entries.length; i++) {
            const item = entries[i]

            if (item[0] === key) {
                this.#bucket[hash].splice(i, 1);
                if (this.#bucket[hash].length === 0) this.#bucket[hash] = undefined
                this.#size--
                return true
            }
        }

        return false
    }

    clear() {
        this.#bucket = Array.from({ length: this.#mapSize })
        this.#size = 0
    }
}