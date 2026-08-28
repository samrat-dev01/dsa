export class TrieNode {
    children = new Map();
    isEnd = false;
}

export class Trie {
    /** @type {TrieNode} */
    root = new TrieNode();


    /**
     * 
     * @param {string} str 
     */
    insert(str) {
        let current = this.root;

        if (str === "") {
            current.isEnd = true;
            return;
        }

        for (let i = 0; i < str.length; i++) {
            const ch = str[i];

            if (current.children.has(ch)) {
                current = current.children.get(ch);
            } else {
                const node = new TrieNode();
                current.children.set(ch, node)
                current = node;
            }

            if (i === str.length - 1) {
                current.isEnd = true
            }
        }
    }

    /**
     *  @param {string} str
     */
    search(str) {
        let current = this.root

        for (let i = 0; i < str.length; i++) {
            const ch = str[i];
            current = current.children.get(ch);
            if (!current) return false
        }

        return current.isEnd
    }

    /**
     *  @param {string} str
     */
    startsWith(str) {
        let current = this.root

        for (let i = 0; i < str.length; i++) {
            const ch = str[i];
            current = current.children.get(ch);
            if (!current) return false;
        }

        return true
    }

    /**
     *  @param {string} str
     */
    delete(str) {
        let current = this.root;
        const path = [];

        if (str === "") {
            if (!current.isEnd) return false;

            current.isEnd = false;
            return true;
        }

        for (let i = 0; i < str.length; i++) {
            const ch = str[i];

            current = current.children.get(ch);

            if (!current) return false;

            path.push({
                node: current,
                char: ch
            })
        }

        if (!current.isEnd) return false;

        current.isEnd = false;

        for (let i = path.length - 1; i >= 0; i--) {
            const { node, char } = path[i];

            // Stop if another word ends here
            if (node.isEnd) break;

            // Stop if another word uses this node
            if (node.children.size > 0) break;

            // Find the parent
            const parent = i === 0
                ? this.root
                : path[i - 1].node;

            // Remove this character from the parent
            parent.children.delete(char);
        }

        return true

    }
}