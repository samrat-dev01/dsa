# Binary Search Tree (BST) — Implementation Notes

An unbalanced BST: every node's left subtree holds smaller values, every right subtree holds larger values. No self-balancing (no AVL/Red-Black rotations) — tree shape depends entirely on insertion order.

```javascript
export class TreeNode {
  value;
  left = null;
  right = null;
}

export class BinarySearchTree {
  root = null;
}
```

**Reference tree used throughout this doc** (built by inserting `50, 30, 70, 20, 40, 60, 80` in that order):

```
                 50
               /    \
             30       70
            /  \      /  \
          20    40  60    80
```

---

## 1. `insert(value)` — add a value, returns `true`/`false`

```javascript
insert(value) {
  const node = new TreeNode(value);

  if (!this.root) {
    this.root = node;
    return true;
  }

  let current = this.root;

  while (current != null) {
    if (value === current.value) return false;

    if (value < current.value) {
      if (!current.left) { current.left = node; return true; }
      current = current.left;
    } else {
      if (!current.right) { current.right = node; return true; }
      current = current.right;
    }
  }
}
```

### How it works
Starting at `root`, repeatedly compare the new value against the current node: go **left** if smaller, **right** if larger. The moment you find an empty spot (`!current.left` or `!current.right`), attach the new node there, and return `true` — a signal the insert actually happened.

```
insert(35) into the reference tree — where does it land?

        50
       /
     30                35 < 50 → go left
    /  \
  20    40             35 < 30? NO (35 > 30) → go right
                        30.right = 40, which exists → step into it
                        35 < 40 → go left
                        40.left is empty → attach here! return true

Result:
        50
       /
     30
    /  \
  20    40
        /
      35
```

### Edge cases handled

**a) Inserting into an empty tree** — `!this.root` is true, the new node becomes `root` directly, returns `true` immediately without entering the loop at all.

**b) Inserting a duplicate value** — `if (value === current.value) return false;` — nothing is added, and the caller gets an explicit signal that the insert was a no-op, distinguishable from a successful insert.

```javascript
bst.insert(30);        // true  — new value added
bst.insert(30);        // false — already existed, nothing changed
```

**c) Every code path returns explicitly** — the loop always either finds an empty slot (`return true`) or a duplicate (`return false`); since `current` is only ever reassigned to an existing child, there's no way to fall out of the loop without hitting one of those two returns first.

**Complexity:** O(h), where h = tree height. Balanced ≈ O(log n); degenerate (sorted-insert) tree ≈ O(n) — see the closing note.

---

## 2. `find(value)` / `contains(value)` — search

```javascript
find(value) {
  let current = this.root;

  while (current != null) {
    if (current.value === value) return current;
    if (value < current.value) current = current.left;
    else current = current.right;
  }

  return undefined;
}

contains(value) {
  return this.find(value) !== undefined;
}
```

### How it works
At each node, either you've found the value, or the BST ordering tells you unambiguously which single subtree could possibly contain it — no need to ever check both sides.

```
find(60) on the reference tree:

        50               60 > 50 → go right
       /  \
     30    70            60 < 70 → go left
          /  \
        60    80         60 === 60 → FOUND, return this node
```

### Edge cases handled

**a) Value not in the tree** — the loop walks off the tree (`current` becomes `null` once it steps past a leaf's empty child side) and exits, falling through to `return undefined`.

**b) Empty tree** — `current = this.root` is `null`, `while (current != null)` is false immediately, same "not found" path.

**c) `contains()` re-runs the full search** — a thin wrapper around `find()`, converting a node-or-`undefined` result into a clean boolean. Simple and correct, though it means calling both back-to-back on the same value duplicates the traversal.

**Complexity:** O(h).

---

## 3. `min()` / `max()` — extremes

```javascript
min() {
  if (!this.root) return undefined;
  let current = this.root;
  while (current.left !== null) current = current.left;
  return current.value;
}
```
`max()` mirrors this, following `.right` instead of `.left`.

### How it works
BST ordering guarantees the smallest value is reached by going **left, left, left...** until there's nowhere left to go; largest is the same, rightward.

```
min() on the reference tree:            max() on the reference tree:

        50                                       50
       /                                            \
     30           ──▶ 30.left=20, 20.left=null      70
    /                    STOP → return 20              \
  20 ◀── answer                                          80 ◀── answer
                                                      80.right=null → STOP
```

### Edge cases handled
**Empty tree** — both check `!this.root` up front and return `undefined` immediately, avoiding a crash from reading `.left`/`.right` off a nonexistent root.

**Complexity:** O(h).

---

## 4. `remove(value)` — three deletion cases, consistent `true`/`false` return

```javascript
remove(value) {
  let parent = null;
  let current = this.root;

  if (!this.root) return false;

  while (current !== null) {
    if (current.value === value) {
      // ...three branches, detailed below...
      return true;
    }
    parent = current;
    if (value < current.value) current = current.left;
    else current = current.right;
  }

  return false;
}
```

Three outcomes, all clean booleans: empty tree → `false`, value not found → `false`, value found and removed → `true`. Both "nothing to remove" scenarios collapse to the same falsy signal, so `bst.remove(x) === false` reliably means "nothing changed," regardless of *why*.

---

### Case A: removing a leaf (no children)

```javascript
if (current.left === null && current.right === null) {
  if (parent === null) this.root = null;
  else if (parent.left === current) parent.left = null;
  else parent.right = null;
}
```

Disconnect it from its parent — nothing to reattach. `parent === null` specifically means the leaf being removed *is* the entire tree (the only node).

```
remove(20)  — 20 is a leaf

        50                         50
       /  \                       /  \
     30    70        ──▶        30    70
    /  \   /  \                   \   /  \
  20  40 60   80                  40 60   80
   ▲
 leaf, parent=30, parent.left===20 → parent.left = null
```

---

### Case B: removing a node with exactly one child

```javascript
else if (current.left || current.right) {
  const child = current.left || current.right;
  if (parent === null) this.root = child;
  else if (parent.left === current) parent.left = child;
  else parent.right = child;
}
```

The single child takes the removed node's place — "promote it up one level." Ordering is automatically preserved, since everything under that child was already correctly positioned relative to the removed node's value.

```
Suppose 60 has a single left child, 55:

        70                         70
       /  \                       /  \
     60    80         ──▶       55    80
    /
  55

remove(60): current.left=55, current.right=null → child=55
  parent=70, parent.left===current(60) → parent.left = 55
```

---

### Case C: removing a node with two children — copy-successor-up

```javascript
else if (current.left && current.right) {
  let successorParent = current;
  let successor = current.right;

  while (successor.left !== null) {
    successorParent = successor;
    successor = successor.left;
  }

  current.value = successor.value;

  if (successorParent.left === successor) {
    successorParent.left = successor.right;
  } else {
    successorParent.right = successor.right;
  }
}
```

**Strategy:** you can't unlink a two-children node directly — both subtrees would need a new home. Instead, find the **in-order successor** (smallest value in the right subtree: go right once, then left as far as possible), **copy that value up** into the node being "removed," then delete the successor node instead — which is guaranteed to have *at most one child* (only ever a possible right child, since the search loop only stops at a node with no left child), reducing this down to something like Case A or B, just further down the tree.

#### Sub-case C1: the successor is the node's immediate right child
```
remove(30) — 30 has two children (20 and 40); 40 has no left child

        30                              successor = current.right = 40
       /  \                             40.left === null → loop doesn't run
     20    40                           successorParent stays = current (30)

Step 1: current.value = successor.value    → the "30" node's value becomes 40
Step 2: successorParent.left(20) === successor(40)? NO
        → else branch: successorParent.right = successor.right (null)

Result:
        40   ← same node object, value overwritten
       /
     20
```

#### Sub-case C2: the successor is deeper in the right subtree
```
remove(50) — the ROOT, with two children (30 and 70)

successor search: start at current.right = 70
  70.left = 60, not null → successorParent = 70, successor = 60
  60.left = null → STOP

successor = 60, successorParent = 70   (successorParent ≠ current this time!)

Step 1: current.value = successor.value     → root's value becomes 60
Step 2: successorParent.left(70.left) === successor(60)? YES
        → successorParent.left = successor.right (null)

Before:                          After:
        50                              60   ← same root node, value overwritten
       /  \                            /  \
     30    70                        30    70
          /  \                            /  \
        60    80                      null    80
```
This is why the code tracks a *separate* `successorParent` variable rather than assuming the successor's parent is always `current` — the successor can be arbitrarily deep down the right subtree's left spine.

### Edge cases handled (full `remove` summary)

**a) Removing from an empty tree** — `!this.root` guard, `return false`.
**b) Removing a value that isn't present** — loop walks off the tree, `return false`.
**c) Removing the only node in the tree** — Case A, `parent === null` branch, `this.root = null`.
**d) Removing the root when it has one child** — Case B, `parent === null` branch, `this.root = child`.
**e) Removing the root when it has two children** — Case C; the value is copied in place, so `this.root` never needs reassignment — it's still the same node object, just holding a new value.
**f) Successor is the immediate right child** — Sub-case C1; no special-casing needed, `successorParent` naturally stays equal to `current`.
**g) Successor is deep in the right subtree** — Sub-case C2; `successorParent` correctly tracks the real parent as the loop descends.

**Complexity:** O(h) to locate the node, plus up to another O(h) for the successor search — still O(h) overall (not O(h²)), since the successor search only descends, never revisiting the already-traversed path to `current`.

---

## 5. Traversals — `inOrder`, `preOrder`, `postOrder`

Same recursive shape, differing only in *when* the current node's value gets pushed relative to recursing into its children:

```javascript
inOrder()   { /* left, VALUE, right */ }
preOrder()  { /* VALUE, left, right */ }
postOrder() { /* left, right, VALUE */ }
```

```
Reference tree:
                 50
               /    \
             30       70
            /  \      /  \
          20    40  60    80

inOrder   (left, node, right):  [20, 30, 40, 50, 60, 70, 80]   ← SORTED! (defining BST property)
preOrder  (node, left, right):  [50, 30, 20, 40, 70, 60, 80]   ← root first; useful for cloning/serializing tree shape
postOrder (left, right, node):  [20, 40, 30, 60, 80, 70, 50]   ← root last; useful for safe bottom-up deletion
```

### Why `inOrder` always produces sorted output
Falls directly out of the BST invariant (left < node < right) combined with recursing left-fully before visiting the node before recursing right-fully — at every node, everything smaller has already been emitted, and everything larger is guaranteed to come after. This is the most practically distinctive traversal for a BST specifically.

### Edge cases handled
**Empty tree** — every traversal's inner `traverse(node)` starts with `if (!node) return;`, so calling any of them on an empty tree returns `[]` immediately, never pushing anything.

**Complexity:** O(n) for all three — every node visited exactly once, regardless of tree shape.

---

## 6. `levelOrder()` — breadth-first traversal, O(n)

```javascript
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
```

### How it works
Visits the tree **level by level** using a queue (first-in-first-out), rather than depth-first via recursion. Push the root, then repeatedly: read the node at the front (tracked via the `head` index), record its value, push its children onto the back.

```
                 50
               /    \
             30       70
            /  \      /  \
          20    40  60    80

queue=[50], head=0        → read 50 (head→1), result=[50], push 30,70 → queue=[50,30,70]
head=1                    → read 30 (head→2), result=[50,30], push 20,40 → queue=[50,30,70,20,40]
head=2                    → read 70 (head→3), result=[50,30,70], push 60,80 → queue=[...,60,80]
head=3                    → read 20 (leaf, nothing pushed) → result=[50,30,70,20]
... continues until head === queue.length

Final: [50, 30, 70, 20, 40, 60, 80]   ← top-to-bottom, left-to-right within each level
```

### Why `head` instead of `queue.shift()`
`Array.prototype.shift()` removes the *first* element of a plain array, which forces every remaining element to be re-indexed — an O(n) operation on every call, making a naive shift-based BFS **O(n²)** overall. Using a `head` index pointer that just walks forward through the same array (never physically removing anything) keeps every "dequeue" step O(1), so the whole traversal stays genuinely **O(n)**. The old array entries before `head` are simply never looked at again — cheap to leave behind, unlike the cost of physically shifting them out.

### Edge cases handled
**a) Empty tree** — `if (!this.root) return result;` returns `[]` before ever touching `queue`.
**b) Leaf nodes** — `if (node.left)` / `if (node.right)` are both false, so nothing is pushed for a leaf; the loop naturally shrinks toward completion as `head` catches up to `queue.length`.

**Complexity:** O(n) — genuinely, with the index-pointer approach.

---

## Summary table

| Method | Time Complexity | Handles empty tree? | Notes |
|---|---|---|---|
| `insert` | O(h) | ✅ (becomes root, `true`) | `true`/`false` signals success vs. duplicate |
| `find` / `contains` | O(h) | ✅ (loop skipped) | |
| `min` / `max` | O(h) | ✅ → `undefined` | |
| `remove` | O(h) | ✅ → `false` | consistent `false` for both "empty" and "not found" |
| `inOrder` | O(n) | ✅ → `[]` | produces SORTED output for a BST |
| `preOrder` | O(n) | ✅ → `[]` | root-first; good for cloning tree shape |
| `postOrder` | O(n) | ✅ → `[]` | root-last; good for safe bottom-up deletion |
| `levelOrder` | O(n) | ✅ → `[]` | index-pointer queue, no `shift()` penalty |

*(h = tree height, n = number of nodes. Balanced ⇒ h ≈ log₂(n); degenerate ⇒ h can be as bad as n.)*

## Core invariants to remember when debugging this BST

> **1. Left < Node < Right, always, at every single node — not just at the root.** Every method here (`insert`, `find`, `remove`'s successor search) leans on this holding recursively at every level.

> **2. This tree does NOT self-balance.** Insertion order determines shape. Inserting already-sorted data (e.g. `1, 2, 3, 4, 5` in order) degrades the tree into a straight line (every node only has a right child), turning every O(h) operation into O(n) — matching a linked list's worst-case performance. Guaranteed O(log n) would require a self-balancing variant (AVL, Red-Black tree).

> **3. Two-children removal never actually deletes the target node object** — it copies a value into it from elsewhere (the successor) and deletes that simpler node instead. If any external code held a direct reference to "the node with value X" before a two-children removal elsewhere in the tree, that reference's `.value` could silently change without warning, since the underlying object is reused rather than replaced.