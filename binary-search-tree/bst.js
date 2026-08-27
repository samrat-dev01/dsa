export class TreeNode {
    value;
    /**
     * @type {TreeNode}
     */
    left = null;
    /**
     * @type {TreeNode}
     */
    right = null;

    constructor(value) {
        this.value = value
    }
}

export class BinarySearchTree {
    /**
     * @type {TreeNode}
     */
    root = null;

    constructor() { }

    insert(value) {
        const node = new TreeNode(value);

        if (!this.root) {
            this.root = node;
            return true
        };

        let current = this.root;

        while (current != null) {
            if (value === current.value) return false

            if (value < current.value) {
                if (!current.left) {
                    current.left = node;
                    return true
                }
                current = current.left
            } else {
                if (!current.right) {
                    current.right = node;
                    return true
                }
                current = current.right
            }
        }
    }

    find(value) {
        let current = this.root;

        while (current != null) {
            if (current.value === value) return current;

            if (value < current.value) current = current.left
            else current = current.right
        }

        return undefined
    }

    min() {
        if (!this.root) return undefined;
        let current = this.root;
        while (current.left !== null) {
            current = current.left
        }
        return current.value
    }

    max() {
        if (!this.root) return undefined;
        let current = this.root
        while (current.right !== null) {
            current = current.right
        }
        return current.value
    }

    remove(value) {
        let parent = null;
        let current = this.root;

        if (!this.root) return false

        while (current !== null) {
            if (current.value === value) {
                // remove leaf node - no children
                if (current.left === null && current.right === null) {
                    if (parent === null) {
                        this.root = null
                    } else if (parent.left === current) {
                        parent.left = null
                    } else {
                        parent.right = null
                    }
                }
                // remove - two children
                else if (current.left && current.right) {
                    let successorParent = current;
                    let successor = current.right;

                    while (successor.left !== null) {
                        successorParent = successor
                        successor = successor.left
                    }

                    current.value = successor.value;

                    if (successorParent.left === successor) {
                        successorParent.left = successor.right
                    } else {
                        successorParent.right = successor.right
                    }
                }
                // remove - one children
                else if (current.left || current.right) {
                    const child = current.left || current.right;
                    if (parent === null) this.root = child
                    else if (parent.left === current) {
                        parent.left = child
                    } else {
                        parent.right = child
                    }
                }

                return true
            }

            parent = current;
            if (value < current.value) {
                current = current.left;
            }
            else {
                current = current.right
            }
        }

        return false
    }

    contains(value) {
        return this.find(value) !== undefined
    }

    inOrder() {
        const result = [];

        function traverse(node) {
            if (!node) return
            traverse(node.left)
            result.push(node.value)
            traverse(node.right)
        }

        traverse(this.root);

        return result
    }

    preOrder() {
        const result = [];

        function traverse(node) {
            if (!node) return;
            result.push(node.value)
            traverse(node.left)
            traverse(node.right)
        }

        traverse(this.root)

        return result
    }

    postOrder() {
        const result = [];

        function traverse(node) {
            if (!node) return;
            traverse(node.left)
            traverse(node.right)
            result.push(node.value)
        }

        traverse(this.root)

        return result
    }

    levelOrder() {
        const result = []
        const queue = []

        if (!this.root) return result;

        queue.push(this.root)
        let head = 0;

        while (head < queue.length) {
            const node = queue[head++];
            result.push(node.value);

            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right)
        }

        return result
    }
}