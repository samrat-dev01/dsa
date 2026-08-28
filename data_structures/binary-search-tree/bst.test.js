import assert from "node:assert/strict";
import test from "node:test";
import { BinarySearchTree } from "./bst.js";

/*
Tree used in most tests:

            10
           /  \
          5    20
         / \   / \
        2   7 15 30
*/

function createTree() {
    const tree = new BinarySearchTree();

    [
        10,
        5,
        20,
        2,
        7,
        15,
        30
    ].forEach(value => tree.insert(value));

    return tree;
}

/* ==================================================
   1. INITIAL STATE
================================================== */

test("1. Initial state", () => {
    const tree = new BinarySearchTree();

    assert.equal(tree.root, null);
});

/* ==================================================
   2. INSERT ROOT
================================================== */

test("2. Insert root", () => {
    const tree = new BinarySearchTree();

    tree.insert(10);

    assert.equal(tree.root.value, 10);
    assert.equal(tree.root.left, null);
    assert.equal(tree.root.right, null);
});

/* ==================================================
   3. INSERT LEFT AND RIGHT
================================================== */

test("3. Insert left and right children", () => {
    const tree = new BinarySearchTree();

    tree.insert(10);
    tree.insert(5);
    tree.insert(20);

    assert.equal(tree.root.value, 10);
    assert.equal(tree.root.left.value, 5);
    assert.equal(tree.root.right.value, 20);
});

/* ==================================================
   4. INSERT COMPLETE TREE
================================================== */

test("4. Insert complete tree", () => {
    const tree = createTree();

    assert.equal(tree.root.value, 10);

    assert.equal(tree.root.left.value, 5);
    assert.equal(tree.root.right.value, 20);

    assert.equal(tree.root.left.left.value, 2);
    assert.equal(tree.root.left.right.value, 7);

    assert.equal(tree.root.right.left.value, 15);
    assert.equal(tree.root.right.right.value, 30);
});

/* ==================================================
   5. FIND EXISTING VALUES
================================================== */

test("5. Find existing values", () => {
    const tree = createTree();

    assert.equal(tree.find(10).value, 10);
    assert.equal(tree.find(5).value, 5);
    assert.equal(tree.find(20).value, 20);
    assert.equal(tree.find(2).value, 2);
    assert.equal(tree.find(7).value, 7);
    assert.equal(tree.find(15).value, 15);
    assert.equal(tree.find(30).value, 30);
});

/* ==================================================
   6. FIND UNKNOWN VALUE
================================================== */

test("6. Find unknown value", () => {
    const tree = createTree();

    assert.equal(tree.find(999), undefined);
    assert.equal(tree.find(1), undefined);
    assert.equal(tree.find(100), undefined);
});

/* ==================================================
   7. CONTAINS
================================================== */

test("7. Contains existing and missing values", () => {
    const tree = createTree();

    assert.equal(tree.contains(10), true);
    assert.equal(tree.contains(5), true);
    assert.equal(tree.contains(30), true);

    assert.equal(tree.contains(999), false);
    assert.equal(tree.contains(1), false);
});

/* ==================================================
   8. MIN
================================================== */

test("8. Minimum value", () => {
    const tree = createTree();

    assert.equal(tree.min(), 2);
});

/* ==================================================
   9. MAX
================================================== */

test("9. Maximum value", () => {
    const tree = createTree();

    assert.equal(tree.max(), 30);
});

/* ==================================================
   10. IN-ORDER
================================================== */

test("10. In-order traversal", () => {
    const tree = createTree();

    assert.deepEqual(
        tree.inOrder(),
        [2, 5, 7, 10, 15, 20, 30]
    );
});

/* ==================================================
   11. PRE-ORDER
================================================== */

test("11. Pre-order traversal", () => {
    const tree = createTree();

    assert.deepEqual(
        tree.preOrder(),
        [10, 5, 2, 7, 20, 15, 30]
    );
});

/* ==================================================
   12. POST-ORDER
================================================== */

test("12. Post-order traversal", () => {
    const tree = createTree();

    assert.deepEqual(
        tree.postOrder(),
        [2, 7, 5, 15, 30, 20, 10]
    );
});

/* ==================================================
   13. LEVEL-ORDER
================================================== */

test("13. Level-order traversal", () => {
    const tree = createTree();

    assert.deepEqual(
        tree.levelOrder(),
        [10, 5, 20, 2, 7, 15, 30]
    );
});

/* ==================================================
   14. REMOVE LEAF
================================================== */

test("14. Remove leaf node", () => {
    const tree = createTree();

    tree.remove(2);

    assert.equal(tree.contains(2), false);

    assert.deepEqual(
        tree.inOrder(),
        [5, 7, 10, 15, 20, 30]
    );

    assert.equal(tree.root.left.left, null);
});

/* ==================================================
   15. REMOVE LEAF FROM RIGHT
================================================== */

test("15. Remove right leaf node", () => {
    const tree = createTree();

    tree.remove(30);

    assert.equal(tree.contains(30), false);

    assert.deepEqual(
        tree.inOrder(),
        [2, 5, 7, 10, 15, 20]
    );
});

/* ==================================================
   16. REMOVE NODE WITH ONE CHILD
================================================== */

test("16. Remove node with one child", () => {
    const tree = new BinarySearchTree();

    /*
          10
         /
        5
       /
      2
    */

    tree.insert(10);
    tree.insert(5);
    tree.insert(2);

    tree.remove(5);

    assert.equal(tree.root.left.value, 2);

    assert.deepEqual(
        tree.inOrder(),
        [2, 10]
    );
});

/* ==================================================
   17. REMOVE ROOT WITH ONE CHILD
================================================== */

test("17. Remove root with one child", () => {
    const tree = new BinarySearchTree();

    tree.insert(10);
    tree.insert(5);

    tree.remove(10);

    assert.equal(tree.root.value, 5);
    assert.equal(tree.root.left, null);
    assert.equal(tree.root.right, null);
});

/* ==================================================
   18. REMOVE NODE WITH TWO CHILDREN
================================================== */

test("18. Remove node with two children", () => {
    const tree = createTree();

    tree.remove(20);

    assert.equal(tree.contains(20), false);

    assert.deepEqual(
        tree.inOrder(),
        [2, 5, 7, 10, 15, 30]
    );
});

/* ==================================================
   19. REMOVE ROOT WITH TWO CHILDREN
================================================== */

test("19. Remove root with two children", () => {
    const tree = createTree();

    tree.remove(10);

    assert.equal(tree.contains(10), false);

    assert.deepEqual(
        tree.inOrder(),
        [2, 5, 7, 15, 20, 30]
    );
});

/* ==================================================
   20. REMOVE NODE WHOSE SUCCESSOR HAS RIGHT CHILD
================================================== */

test("20. Remove node with successor having right child", () => {
    const tree = new BinarySearchTree();

    /*
              10
             /  \
            5    20
                /  \
               15   30
                 \
                  17
    */

    tree.insert(10);
    tree.insert(5);
    tree.insert(20);
    tree.insert(15);
    tree.insert(30);
    tree.insert(17);

    tree.remove(20);

    assert.equal(tree.contains(20), false);

    assert.deepEqual(
        tree.inOrder(),
        [5, 10, 15, 17, 30]
    );
});

/* ==================================================
   21. REMOVE ONLY NODE
================================================== */

test("21. Remove only node", () => {
    const tree = new BinarySearchTree();

    tree.insert(10);

    tree.remove(10);

    assert.equal(tree.root, null);
});

/* ==================================================
   22. REMOVE NON-EXISTING VALUE
================================================== */

test("22. Remove non-existing value", () => {
    const tree = createTree();

    tree.remove(999);

    assert.deepEqual(
        tree.inOrder(),
        [2, 5, 7, 10, 15, 20, 30]
    );
});

/* ==================================================
   23. REMOVE SAME VALUE TWICE
================================================== */

test("23. Remove same value twice", () => {
    const tree = createTree();

    tree.remove(7);
    tree.remove(7);

    assert.equal(tree.contains(7), false);

    assert.deepEqual(
        tree.inOrder(),
        [2, 5, 10, 15, 20, 30]
    );
});

/* ==================================================
   24. TREE STRUCTURE AFTER REMOVAL
================================================== */

test("24. Tree structure remains valid after removals", () => {
    const tree = createTree();

    tree.remove(2);
    tree.remove(30);
    tree.remove(20);

    assert.deepEqual(
        tree.inOrder(),
        [5, 7, 10, 15]
    );

    assert.equal(tree.min(), 5);
    assert.equal(tree.max(), 15);
});

/* ==================================================
   25. EMPTY TREE TRAVERSALS
================================================== */

test("25. Empty tree traversals", () => {
    const tree = new BinarySearchTree();

    assert.deepEqual(tree.inOrder(), []);
    assert.deepEqual(tree.preOrder(), []);
    assert.deepEqual(tree.postOrder(), []);
    assert.deepEqual(tree.levelOrder(), []);
});


console.log("\nBinary Search Tree tests starting...\n");