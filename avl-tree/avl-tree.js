export class AVLNode {
    value;
    /** @type {AVLNode} */
    left = null;
    /** @type {AVLNode} */
    right = null;
    height = 1

    constructor(val) {
        this.value = val
    }
}

export class AVLTree {
    /** @type {AVLNode} */
    root = null;

    constructor() { }

    getHeight(node) {
        if (!node) return 0
        return node.height
    }

    getBalanceFactor(node) {
        if (!node) return 0;
        return this.getHeight(node.left) - this.getHeight(node.right)
    }

    rightRotate(node) {
        const newRoot = node.left;
        const movedSubTree = newRoot.right;

        newRoot.right = node;
        node.left = movedSubTree;

        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right))
        newRoot.height = 1 + Math.max(this.getHeight(newRoot.left), this.getHeight(newRoot.right))

        return newRoot
    }

    leftRotate(node) {
        const newRoot = node.right;
        const movedSubTree = newRoot.left;

        newRoot.left = node;
        node.right = movedSubTree;

        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right))
        newRoot.height = 1 + Math.max(this.getHeight(newRoot.left), this.getHeight(newRoot.right))

        return newRoot
    }

    insert(value) {
        this.root = this.#insert(this.root, value);
    }

    #insert(node, value) {
        if (!node) {
            return new AVLNode(value);
        }

        if (value < node.value) {
            node.left = this.#insert(node.left, value);
        } else if (value > node.value) {
            node.right = this.#insert(node.right, value);
        } else {
            return node;
        }

        node.height =
            1 + Math.max(
                this.getHeight(node.left),
                this.getHeight(node.right)
            );

        const balance = this.getBalanceFactor(node);

        if (balance > 1 && value < node.left.value) {
            return this.rightRotate(node);
        }

        if (balance < -1 && value > node.right.value) {
            return this.leftRotate(node);
        }

        if (balance > 1 && value > node.left.value) {
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }

        if (balance < -1 && value < node.right.value) {
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }

    find(value) {
        let current = this.root;

        while (current !== null) {
            if (value === current.value) {
                return current;
            }

            if (value < current.value) {
                current = current.left;
            } else {
                current = current.right;
            }
        }

        return undefined;
    }

    contains(value) {
        return this.find(value) !== undefined;
    }

    min() {
        if (!this.root) return undefined;
        let current = this.root;
        while (current.left !== null) {
            current = current.left;
        }
        return current.value;
    }

    max() {
        if (!this.root) return undefined;
        let current = this.root;
        while (current.right !== null) {
            current = current.right;
        }
        return current.value;
    }

    inOrder() {
        const result = [];
        function traverse(node) {
            if (!node) return;
            traverse(node.left);
            result.push(node.value);
            traverse(node.right);
        }
        traverse(this.root);
        return result;
    }

    preOrder() {
        const result = [];
        function traverse(node) {
            if (!node) return;
            result.push(node.value);
            traverse(node.left);
            traverse(node.right);
        }
        traverse(this.root);
        return result;
    }

    postOrder() {
        const result = [];
        function traverse(node) {
            if (!node) return;
            traverse(node.left);
            traverse(node.right);
            result.push(node.value);
        }
        traverse(this.root);
        return result;
    }

    levelOrder() {
        const result = [];
        const queue = [];

        if (!this.root) return result;

        queue.push(this.root);
        let head = 0;

        while (head < queue.length) {
            const node = queue[head++];
            result.push(node.value);

            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }

        return result;
    }

    remove(value) {
        this.root = this.#remove(this.root, value);
    }

    #remove(node, value) {
        if (!node) {
            return null;
        }

        if (value < node.value) {
            node.left = this.#remove(node.left, value);
        } else if (value > node.value) {
            node.right = this.#remove(node.right, value);
        } else {
            if (!node.left && !node.right) {
                return null;
            }

            if (!node.left) {
                return node.right;
            }

            if (!node.right) {
                return node.left;
            }

            let successor = node.right;

            while (successor.left) {
                successor = successor.left;
            }

            node.value = successor.value;

            node.right = this.#remove(
                node.right,
                successor.value
            );
        }

        node.height =
            1 + Math.max(
                this.getHeight(node.left),
                this.getHeight(node.right)
            );

        const balance = this.getBalanceFactor(node);

        if (balance > 1 && this.getBalanceFactor(node.left) >= 0) {
            return this.rightRotate(node);
        }

        if (balance > 1 && this.getBalanceFactor(node.left) < 0) {
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }

        if (balance < -1 && this.getBalanceFactor(node.right) <= 0) {
            return this.leftRotate(node);
        }

        if (balance < -1 && this.getBalanceFactor(node.right) > 0) {
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }
}