import test from "node:test";
import assert from "node:assert/strict";
import { AVLTree } from "./avl-tree.js";

function createTree(values) {
    const tree = new AVLTree();

    for (const value of values) {
        tree.insert(value);
    }

    return tree;
}

function getBalance(node) {
    if (!node) return 0;

    const leftHeight = node.left ? node.left.height : 0;
    const rightHeight = node.right ? node.right.height : 0;

    return leftHeight - rightHeight;
}

function assertBalanced(node) {
    if (!node) return;

    const balance = getBalance(node);

    assert.ok(
        balance >= -1 && balance <= 1,
        `Node ${node.value} is unbalanced: ${balance}`
    );

    assertBalanced(node.left);
    assertBalanced(node.right);
}

function assertBST(node, min = -Infinity, max = Infinity) {
    if (!node) return;

    assert.ok(
        node.value > min && node.value < max,
        `BST property violated at ${node.value}`
    );

    assertBST(node.left, min, node.value);
    assertBST(node.right, node.value, max);
}


// ============================================================
// INITIAL STATE
// ============================================================

test("1. Initial state", () => {
    const tree = new AVLTree();

    assert.equal(tree.root, null);
    assert.equal(tree.find(10), undefined);
    assert.equal(tree.contains(10), false);
    assert.equal(tree.min(), undefined);
    assert.equal(tree.max(), undefined);

    assert.deepEqual(tree.inOrder(), []);
    assert.deepEqual(tree.preOrder(), []);
    assert.deepEqual(tree.postOrder(), []);
    assert.deepEqual(tree.levelOrder(), []);
});


// ============================================================
// BASIC INSERTION
// ============================================================

test("2. Insert root", () => {
    const tree = new AVLTree();

    tree.insert(10);

    assert.equal(tree.root.value, 10);
    assert.equal(tree.root.left, null);
    assert.equal(tree.root.right, null);
    assert.equal(tree.root.height, 1);
});

test("3. Insert multiple values", () => {
    const tree = createTree([20, 10, 30]);

    assert.deepEqual(tree.inOrder(), [10, 20, 30]);
    assert.equal(tree.root.value, 20);
});

test("4. Duplicate values should not be inserted", () => {
    const tree = new AVLTree();

    tree.insert(10);
    tree.insert(10);
    tree.insert(10);

    assert.deepEqual(tree.inOrder(), [10]);
    assert.equal(tree.root.value, 10);
});


// ============================================================
// LL ROTATION
// ============================================================

test("5. LL rotation", () => {
    const tree = createTree([30, 20, 10]);

    assert.equal(tree.root.value, 20);
    assert.equal(tree.root.left.value, 10);
    assert.equal(tree.root.right.value, 30);

    assert.deepEqual(tree.inOrder(), [10, 20, 30]);

    assertBalanced(tree.root);
    assertBST(tree.root);
});


// ============================================================
// RR ROTATION
// ============================================================

test("6. RR rotation", () => {
    const tree = createTree([10, 20, 30]);

    assert.equal(tree.root.value, 20);
    assert.equal(tree.root.left.value, 10);
    assert.equal(tree.root.right.value, 30);

    assert.deepEqual(tree.inOrder(), [10, 20, 30]);

    assertBalanced(tree.root);
    assertBST(tree.root);
});


// ============================================================
// LR ROTATION
// ============================================================

test("7. LR rotation", () => {
    const tree = createTree([30, 10, 20]);

    assert.equal(tree.root.value, 20);
    assert.equal(tree.root.left.value, 10);
    assert.equal(tree.root.right.value, 30);

    assert.deepEqual(tree.inOrder(), [10, 20, 30]);

    assertBalanced(tree.root);
    assertBST(tree.root);
});


// ============================================================
// RL ROTATION
// ============================================================

test("8. RL rotation", () => {
    const tree = createTree([10, 30, 20]);

    assert.equal(tree.root.value, 20);
    assert.equal(tree.root.left.value, 10);
    assert.equal(tree.root.right.value, 30);

    assert.deepEqual(tree.inOrder(), [10, 20, 30]);

    assertBalanced(tree.root);
    assertBST(tree.root);
});


// ============================================================
// SEARCH
// ============================================================

test("9. Find existing values", () => {
    const tree = createTree([50, 30, 70, 20, 40, 60, 80]);

    assert.equal(tree.find(50).value, 50);
    assert.equal(tree.find(30).value, 30);
    assert.equal(tree.find(70).value, 70);
    assert.equal(tree.find(20).value, 20);
    assert.equal(tree.find(80).value, 80);
});

test("10. Find missing value", () => {
    const tree = createTree([50, 30, 70]);

    assert.equal(tree.find(100), undefined);
    assert.equal(tree.find(1), undefined);
});

test("11. Contains existing and missing values", () => {
    const tree = createTree([50, 30, 70]);

    assert.equal(tree.contains(50), true);
    assert.equal(tree.contains(30), true);
    assert.equal(tree.contains(70), true);

    assert.equal(tree.contains(100), false);
    assert.equal(tree.contains(1), false);
});


// ============================================================
// MIN / MAX
// ============================================================

test("12. Minimum value", () => {
    const tree = createTree([50, 30, 70, 20, 40, 60, 80]);

    assert.equal(tree.min(), 20);
});

test("13. Maximum value", () => {
    const tree = createTree([50, 30, 70, 20, 40, 60, 80]);

    assert.equal(tree.max(), 80);
});

test("14. Min and max with single node", () => {
    const tree = new AVLTree();

    tree.insert(100);

    assert.equal(tree.min(), 100);
    assert.equal(tree.max(), 100);
});


// ============================================================
// TRAVERSALS
// ============================================================

test("15. In-order traversal", () => {
    const tree = createTree([
        50,
        30,
        70,
        20,
        40,
        60,
        80,
    ]);

    assert.deepEqual(
        tree.inOrder(),
        [20, 30, 40, 50, 60, 70, 80]
    );
});

test("16. Pre-order traversal", () => {
    const tree = createTree([
        50,
        30,
        70,
        20,
        40,
        60,
        80,
    ]);

    assert.deepEqual(
        tree.preOrder(),
        [50, 30, 20, 40, 70, 60, 80]
    );
});

test("17. Post-order traversal", () => {
    const tree = createTree([
        50,
        30,
        70,
        20,
        40,
        60,
        80,
    ]);

    assert.deepEqual(
        tree.postOrder(),
        [20, 40, 30, 60, 80, 70, 50]
    );
});

test("18. Level-order traversal", () => {
    const tree = createTree([
        50,
        30,
        70,
        20,
        40,
        60,
        80,
    ]);

    assert.deepEqual(
        tree.levelOrder(),
        [50, 30, 70, 20, 40, 60, 80]
    );
});


// ============================================================
// REMOVE LEAF
// ============================================================

test("19. Remove leaf node", () => {
    const tree = createTree([
        50,
        30,
        70,
        20,
        40,
    ]);

    tree.remove(20);

    assert.equal(tree.contains(20), false);
    assert.deepEqual(
        tree.inOrder(),
        [30, 40, 50, 70]
    );

    assertBalanced(tree.root);
    assertBST(tree.root);
});


// ============================================================
// REMOVE ONE CHILD
// ============================================================

test("20. Remove node with one child", () => {
    const tree = createTree([
        50,
        30,
        70,
        20,
    ]);

    tree.remove(30);

    assert.equal(tree.contains(30), false);
    assert.equal(tree.contains(20), true);

    assertBalanced(tree.root);
    assertBST(tree.root);
});


// ============================================================
// REMOVE TWO CHILDREN
// ============================================================

test("21. Remove node with two children", () => {
    const tree = createTree([
        50,
        30,
        70,
        20,
        40,
        60,
        80,
    ]);

    tree.remove(30);

    assert.equal(tree.contains(30), false);

    assert.deepEqual(
        tree.inOrder(),
        [20, 40, 50, 60, 70, 80]
    );

    assertBalanced(tree.root);
    assertBST(tree.root);
});


// ============================================================
// REMOVE ROOT
// ============================================================

test("22. Remove root", () => {
    const tree = createTree([
        50,
        30,
        70,
    ]);

    tree.remove(50);

    assert.equal(tree.contains(50), false);
    assert.deepEqual(
        tree.inOrder(),
        [30, 70]
    );

    assertBalanced(tree.root);
    assertBST(tree.root);
});


// ============================================================
// REMOVE ONLY NODE
// ============================================================

test("23. Remove only node", () => {
    const tree = new AVLTree();

    tree.insert(10);
    tree.remove(10);

    assert.equal(tree.root, null);
    assert.deepEqual(tree.inOrder(), []);
    assert.equal(tree.contains(10), false);
});


// ============================================================
// REMOVE MISSING VALUE
// ============================================================

test("24. Remove non-existing value", () => {
    const tree = createTree([
        50,
        30,
        70,
    ]);

    tree.remove(100);

    assert.deepEqual(
        tree.inOrder(),
        [30, 50, 70]
    );

    assertBalanced(tree.root);
    assertBST(tree.root);
});


// ============================================================
// REMOVE SAME VALUE TWICE
// ============================================================

test("25. Remove same value twice", () => {
    const tree = createTree([
        50,
        30,
        70,
    ]);

    tree.remove(30);

    assert.equal(tree.contains(30), false);

    tree.remove(30);

    assert.equal(tree.contains(30), false);

    assertBalanced(tree.root);
    assertBST(tree.root);
});


// ============================================================
// DELETION REBALANCING
// ============================================================

test("26. Deletion keeps tree balanced", () => {
    const tree = createTree([
        50,
        30,
        70,
        20,
        40,
        60,
        80,
        10,
        25,
        35,
        45,
    ]);

    tree.remove(80);
    assertBalanced(tree.root);
    assertBST(tree.root);

    tree.remove(70);
    assertBalanced(tree.root);
    assertBST(tree.root);

    tree.remove(60);
    assertBalanced(tree.root);
    assertBST(tree.root);
});


// ============================================================
// LARGE TREE
// ============================================================

test("27. Large insertion remains balanced", () => {
    const tree = new AVLTree();

    for (let i = 1; i <= 100; i++) {
        tree.insert(i);
    }

    assert.equal(tree.inOrder().length, 100);

    assert.deepEqual(
        tree.inOrder(),
        Array.from({ length: 100 }, (_, i) => i + 1)
    );

    assertBalanced(tree.root);
    assertBST(tree.root);
});


// ============================================================
// LARGE TREE DELETION
// ============================================================

test("28. Large deletion remains balanced", () => {
    const tree = new AVLTree();

    for (let i = 1; i <= 100; i++) {
        tree.insert(i);
    }

    for (let i = 1; i <= 50; i++) {
        tree.remove(i);

        assertBalanced(tree.root);
        assertBST(tree.root);
    }

    assert.deepEqual(
        tree.inOrder(),
        Array.from({ length: 50 }, (_, i) => i + 51)
    );
});


// ============================================================
// HEIGHT / BALANCE
// ============================================================

test("29. Root balance factor is valid", () => {
    const tree = createTree([
        30,
        20,
        10,
        40,
        50,
        25,
    ]);

    const balance = getBalance(tree.root);

    assert.ok(balance >= -1 && balance <= 1);
});

test("30. Every node remains balanced", () => {
    const tree = createTree([
        50,
        30,
        70,
        20,
        40,
        60,
        80,
        10,
        25,
        35,
        45,
        55,
        65,
        75,
        90,
    ]);

    assertBalanced(tree.root);
    assertBST(tree.root);
});

console.log("\nAVL Tree tests starting...\n");