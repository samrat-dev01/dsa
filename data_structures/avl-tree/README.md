# AVL Tree (Self-Balancing BST) — Implementation Notes

A BST that automatically stays balanced: after every `insert`/`remove`, each node's **balance factor** (left subtree height − right subtree height) is checked, and **rotations** are applied to restore it to `-1`, `0`, or `1`. This guarantees O(log n) height at all times — unlike a plain BST, which can degrade to O(n) on sorted input.

```javascript
export class AVLNode {
  value;
  left = null;
  right = null;
  height = 1;   // every node tracks its own subtree height
}

export class AVLTree {
  root = null;
}
```

**Definitions used throughout:**
- **Height** of a `null` node = `0`. Height of a leaf = `1`. Height of any other node = `1 + max(height(left), height(right))`.
- **Balance factor** = `height(left) − height(right)`.
  - `> 1` → left-heavy, needs a rotation.
  - `< -1` → right-heavy, needs a rotation.
  - `-1, 0, 1` → balanced, no action needed.

---

## 1. `getHeight(node)` / `getBalanceFactor(node)` — the null-safe helpers

```javascript
getHeight(node) {
  if (!node) return 0;
  return node.height;
}

getBalanceFactor(node) {
  if (!node) return 0;
  return this.getHeight(node.left) - this.getHeight(node.right);
}
```

Both explicitly handle `null` as their first check, returning `0` — this is what lets every other method call `getHeight(node.left)` freely without first checking whether `node.left` actually exists. It also correctly represents "a missing subtree has height 0," which is the base case the whole height formula depends on.

**Complexity:** O(1) each — heights are precomputed and stored on every node, never recalculated from scratch by walking the subtree.

---

## 2. `rightRotate(node)` / `leftRotate(node)` — the rebalancing primitives

These are the mechanical heart of the whole class — every rebalance, whether triggered by `insert` or `remove`, boils down to one or two calls to these.

### `rightRotate(node)` — fixes a left-heavy imbalance

```javascript
rightRotate(node) {
  const newRoot = node.left;
  const movedSubTree = newRoot.right;

  newRoot.right = node;
  node.left = movedSubTree;

  node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  newRoot.height = 1 + Math.max(this.getHeight(newRoot.left), this.getHeight(newRoot.right));

  return newRoot;
}
```

```
Before:                          After rightRotate(node):
        node                             newRoot
       /    \                           /       \
   newRoot   T3         ──▶            L        node
   /    \                                       /    \
  L   movedSubTree                       movedSubTree  T3
```

`node`'s left child (`newRoot`) becomes the new subtree root. `node` itself drops down to become `newRoot`'s right child. The one tricky part: `newRoot` already had a right child (`movedSubTree`) — that subtree's values are all *greater* than `newRoot` but *less* than `node`, so it has to be relocated to become `node`'s new left child (the only slot where it still satisfies BST ordering).

### `leftRotate(node)` — the mirror image, fixes a right-heavy imbalance

```javascript
leftRotate(node) {
  const newRoot = node.right;
  const movedSubTree = newRoot.left;

  newRoot.left = node;
  node.right = movedSubTree;

  node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  newRoot.height = 1 + Math.max(this.getHeight(newRoot.left), this.getHeight(newRoot.right));

  return newRoot;
}
```

```
Before:                          After leftRotate(node):
      node                              newRoot
     /    \                            /       \
   T1    newRoot        ──▶          node        R
         /    \                     /    \
   movedSubTree  R              T1   movedSubTree
```

### ⚠️ A subtle mistake worth guarding against: whose children do you measure?
Both height recalculations at the end **must** be based on each node's *own, already-updated* children — `node.height` from `node.left`/`node.right` (which now point to the post-rotation subtrees), and separately, `newRoot.height` from `newRoot.left`/`newRoot.right` (its own post-rotation subtrees, **not** `node`'s). It's an easy slip to accidentally reuse `node.left`/`node.right` for both height calculations (copy-pasting the first line and only half-updating the variable names) — that would silently compute a wrong height for the new subtree root, which then poisons every balance-factor check further up the tree on later operations. Since `node` and `newRoot` end up with two genuinely different sets of children after the swap, each one's height must be computed from **its own** children, independently.

**Complexity:** O(1) — a rotation only touches a constant number of pointers and recomputes two heights, regardless of subtree size.

---

## 3. `insert(value)` — public wrapper around a recursive helper

```javascript
insert(value) {
  this.root = this.#insert(this.root, value);
}
```

The pattern used throughout this class: the public method kicks off a **private recursive helper** that takes a subtree root and returns the (possibly rebalanced) new subtree root. The caller always reassigns the result back — `this.root = this.#insert(this.root, value)` — because a rotation may change *which node* is the root of that subtree (or the whole tree).

### `#insert(node, value)` — recursive insert + rebalance

```javascript
#insert(node, value) {
  if (!node) return new AVLNode(value);

  if (value < node.value) {
    node.left = this.#insert(node.left, value);
  } else if (value > node.value) {
    node.right = this.#insert(node.right, value);
  } else {
    return node;
  }

  node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));

  const balance = this.getBalanceFactor(node);

  if (balance > 1 && value < node.left.value) return this.rightRotate(node);              // LL
  if (balance < -1 && value > node.right.value) return this.leftRotate(node);             // RR
  if (balance > 1 && value > node.left.value) {                                            // LR
    node.left = this.leftRotate(node.left);
    return this.rightRotate(node);
  }
  if (balance < -1 && value < node.right.value) {                                          // RL
    node.right = this.rightRotate(node.right);
    return this.leftRotate(node);
  }

  return node;
}
```

### How it works
1. **Standard BST insert**, recursively — go left or right based on comparison, and at the base case (`!node`), create the new node.
2. **On the way back up the recursion**, recompute `node.height` (since a descendant was just added, this node's height might have grown).
3. **Check this node's balance factor.** If it's out of range, figure out *which* of the four classic shapes caused it, using the **just-inserted `value`** compared against `node.left.value` / `node.right.value` to tell which side of the child the new node landed on.

### Why comparing `value` against the child works here (but won't work for `remove`)
During `insert`, there's exactly **one** value that was just added, and you know what it is — so comparing it against `node.left.value` tells you unambiguously whether the insertion happened in the left child's *left* subtree (an "LL" shape) or its *right* subtree (an "LR" shape). This shortcut is only valid because insert always deals with a single, known value. (Contrast this with `remove()`'s rebalancing below, which uses a different technique entirely, because there's no single "value" to compare against after a deletion.)

### Worked example — LL case (single rotation)
```
insert(30), insert(20), insert(10)  — three insertions in decreasing order

After inserting 30 and 20:
        30 (h2, balance=1)
       /
     20 (h1)

Inserting 10:
  10 < 30 → recurse left into 20
  10 < 20 → recurse left into null → create new node 10

  Back at 20: height = 1+max(1,0) = 2. balance = 1-0 = 1. Not >1. Return 20 (h2).
  Back at 30: node.left = 20 (h2 now). height = 1+max(2,0) = 3. balance = 2-0 = 2.

  balance>1 AND value(10) < node.left.value(20) → LL CASE → rightRotate(30)

rightRotate(30):
  newRoot = 30.left = 20
  movedSubTree = 20.right = null
  20.right = 30 ;  30.left = null
  30.height = 1+max(0,0) = 1
  20.height = 1+max(h(10)=1, h(30)=1) = 2

Result — perfectly balanced:
        20 (h2)
       /   \
     10     30
   (h1)    (h1)
```

### Worked example — LR case (double rotation)
```
insert(30), insert(10), insert(20)

After inserting 30 and 10:
        30 (h2, balance=1)
       /
     10 (h1)

Inserting 20:
  20 < 30 → recurse left into 10
  20 > 10 → recurse right into null → create new node 20

  Back at 10: height = 1+max(0,1) = 2. balance = 0-1 = -1. Not <-1. Return 10 (h2).
  Back at 30: node.left = 10 (h2 now). height = 1+max(2,0) = 3. balance = 2-0 = 2.

  balance>1 AND value(20) < node.left.value(10)?  20<10 is FALSE → not LL
  balance>1 AND value(20) > node.left.value(10)?  20>10 is TRUE  → LR CASE

  Step 1: node.left = leftRotate(node.left = 10)

    leftRotate(10): newRoot=10.right=20, movedSubTree=20.left=null
      20.left=10 ; 10.right=null
      10.height=1+max(0,0)=1
      20.height=1+max(h(10)=1,h(null)=0)=2

    node.left is now: 20(h2), with left=10(h1), right=null

  Step 2: rightRotate(node = 30)

    rightRotate(30): newRoot=30.left=20, movedSubTree=20.right=null
      20.right=30 ; 30.left=null
      30.height=1+max(0,0)=1
      20.height=1+max(h(10)=1,h(30)=1)=2

Result — perfectly balanced:
        20 (h2)
       /   \
     10     30
   (h1)    (h1)
```

The **RR** and **RL** cases are exact mirror images of LL and LR (insert descending values / ascending-then-descending values on the right side instead) — same logic, opposite direction.

### Edge cases handled

**a) Inserting into an empty tree** — `!node` base case creates a fresh `AVLNode` with `height = 1` (its class field default); no rotation possible or needed for a single node (its balance factor is trivially `0`).

**b) Inserting a duplicate value** — `else { return node; }` exits immediately without creating a new node, and — importantly — **without falling through** to the height/balance-check code below it, since duplicates can't have changed this node's height. Note there's no signal to the caller distinguishing "inserted" from "already existed" — `insert()`'s public wrapper doesn't return anything either way.

**c) Why at most one rotation event is ever needed per insert** — this is a classical AVL property, not just an implementation detail: inserting a single node can only increase the height of nodes along **one** root-to-leaf path, by at most `1`. The moment you fix the *lowest* unbalanced ancestor on that path with a rotation, that subtree's height returns to exactly what it was **before** the insertion — meaning every ancestor further up sees no height change at all, and their balance-factor checks will never trigger. The code doesn't "know" this explicitly (it still runs the same four `if` checks at every level on the way back up), but the checks above the fixed node simply never evaluate to true, because the underlying heights genuinely didn't change there.

**Complexity:** O(log n) — recursion depth equals tree height, which AVL guarantees stays O(log n), and each level does O(1) work.

---

## 4. `find(value)` / `contains(value)` / `min()` / `max()` — unchanged BST logic

```javascript
find(value) {
  let current = this.root;
  while (current !== null) {
    if (value === current.value) return current;
    current = value < current.value ? current.left : current.right;
  }
  return undefined;
}
```

These four are functionally identical to a plain BST's versions — the AVL balancing doesn't change *how* you search, only *how deep* you might have to go. The practical benefit: because the tree is guaranteed height-balanced, these are **always** O(log n) here — no degenerate-tree worst case like an unbalanced BST has.

### Edge cases handled
Same as a plain BST: empty tree → `find`/`min`/`max` all guard with `current !== null` / `!this.root` checks and return `undefined` cleanly; value not found → loop walks off the tree naturally.

**Complexity:** O(log n), guaranteed (not just average-case).

---

## 5. Traversals — `inOrder`, `preOrder`, `postOrder`, `levelOrder`

Identical recursive shape to the plain BST version — `inOrder` still produces sorted output (same reasoning: left-fully, then node, then right-fully, at every level), `preOrder` puts the root first, `postOrder` puts it last.

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

`levelOrder()` uses an index pointer (`head`) walking forward through the array instead of `Array.prototype.shift()`. `shift()` re-indexes every remaining element on each call — O(n) per call, making a shift-based BFS O(n²) overall. The index-pointer approach keeps each "dequeue" step O(1), so the whole traversal stays genuinely O(n).

### Edge cases handled
All four guard on an empty tree (`if (!node) return;` in the recursive traversals, `if (!this.root) return result;` in `levelOrder`) and correctly return `[]`.

**Complexity:** O(n) for all four — visits every node exactly once, regardless of shape (though shape barely varies here anyway, since AVL keeps it close to a perfect binary tree).

---

## 6. `remove(value)` — recursive delete + rebalance, with a DIFFERENT rotation-detection strategy than `insert`

```javascript
remove(value) {
  this.root = this.#remove(this.root, value);
}
```

### `#remove(node, value)` — find, delete, then rebalance on the way back up

```javascript
#remove(node, value) {
  if (!node) return null;

  if (value < node.value) {
    node.left = this.#remove(node.left, value);
  } else if (value > node.value) {
    node.right = this.#remove(node.right, value);
  } else {
    // Found the node
    if (!node.left && !node.right) return null;
    if (!node.left) return node.right;
    if (!node.right) return node.left;

    let successor = node.right;
    while (successor.left) successor = successor.left;

    node.value = successor.value;
    node.right = this.#remove(node.right, successor.value);
  }

  node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));

  const balance = this.getBalanceFactor(node);

  if (balance > 1 && this.getBalanceFactor(node.left) >= 0) return this.rightRotate(node);          // LL
  if (balance > 1 && this.getBalanceFactor(node.left) < 0) {                                          // LR
    node.left = this.leftRotate(node.left);
    return this.rightRotate(node);
  }
  if (balance < -1 && this.getBalanceFactor(node.right) <= 0) return this.leftRotate(node);          // RR
  if (balance < -1 && this.getBalanceFactor(node.right) > 0) {                                        // RL
    node.right = this.rightRotate(node.right);
    return this.leftRotate(node);
  }

  return node;
}
```

### How it works — three deletion shapes, same as a plain BST
1. **Navigate down** using standard BST comparisons until the target value is found.
2. **No children** (leaf) → return `null`, detaching it.
3. **One child** → return that child directly, promoting it into the removed node's spot.
4. **Two children** → find the in-order **successor** (smallest value in the right subtree), copy its value up into the current node, then **recursively delete the successor's value from the right subtree** — this recursive call is important: it doesn't just splice out a pointer manually (like a plain BST might), it re-runs the *entire* `#remove` logic — including rebalancing — on the right subtree, so if removing the successor unbalances anything down there, it gets fixed as part of the same call.
5. **On the way back up the recursion**, recompute height and check the balance factor — same as `insert` — but the *rotation type detection* works differently here (see below).

### Why `remove` can't use insert's "compare the value" trick
`insert` always deals with exactly one known value being added, so comparing it to `node.left.value` tells you which shape caused the imbalance. `remove` has no equivalent single reference point — especially in the two-children case, where the value that physically leaves the tree (the successor's original value) isn't even the value the caller asked to remove. Instead, `remove`'s rebalancing looks at **the balance factor of the taller child** to determine shape:

```
if (balance > 1 && getBalanceFactor(node.left) >= 0)  → LL  (left child is itself left-heavy or balanced)
if (balance > 1 && getBalanceFactor(node.left) < 0)   → LR  (left child is right-heavy)
if (balance < -1 && getBalanceFactor(node.right) <= 0) → RR  (right child is itself right-heavy or balanced)
if (balance < -1 && getBalanceFactor(node.right) > 0)  → RL  (right child is left-heavy)
```
This is the standard, correct technique for delete-triggered rebalancing in an AVL tree. **Note the asymmetry in the comparison operators** (`>= 0` vs `< 0` on the left side; `<= 0` vs `> 0` on the right side) — this isn't arbitrary, it's what makes the four conditions collectively exhaustive and non-overlapping for every possible balance factor value the taller child could have.

> **Why is it always safe to call `getBalanceFactor(node.left)` here without checking it's non-null first?** Because `balance > 1` mathematically implies `height(node.left) ≥ height(node.right) + 2 ≥ 2`, which means `node.left` can't possibly be `null` (a `null`'s height is `0`, which couldn't satisfy that inequality). The same reasoning applies symmetrically to `node.right` in the `balance < -1` branches.

### Worked example — a removal that triggers a rotation elsewhere in the tree
```
Starting tree (built by inserting 20, 10, 30, 5 in that order):

          20 (h3)
        /    \
      10(h2)  30(h1)
      /
    5(h1)

remove(30):

  #remove(root=20, 30): 30 > 20 → node.right = #remove(node.right=30, 30)
    #remove(node=30, 30): value matches, leaf (no children) → return null

  Back at 20: node.right = null now.
    height = 1 + max(h(left=10)=2, h(right=null)=0) = 3
    balance = 2 - 0 = 2      ← unbalanced! (triggered by removing a node on the OPPOSITE side)

    balance>1 AND getBalanceFactor(node.left = 10) ≥ 0 ?
      10 has left=5(h1), right=null(h0) → balance(10) = 1 - 0 = 1 ≥ 0 → YES → LL case

    rightRotate(20):
      newRoot = 20.left = 10
      movedSubTree = 10.right = null
      10.right = 20 ; 20.left = null
      20.height = 1+max(h(left=null)=0, h(right=null)=0) = 1
      10.height = 1+max(h(left=5)=1, h(right=20)=1) = 2

Result:
        10 (h2)
       /   \
     5      20
   (h1)    (h1)
```
Notice: the value removed (`30`) wasn't even on the side that ended up rotating — removing it shrank the right subtree, which made the *already-taller* left subtree tip the whole node out of balance. This is a good illustration of why `remove`'s rebalance check has to run at every level on the way back up, not just at the node where the value was found.

### Why removal can require MORE rotations than insertion, in the worst case
This is another classical AVL property: because a single deletion can reduce the height of a subtree by 1, and that reduction can — unlike insertion — continue propagating upward and cause imbalance at **every** ancestor level, not just the lowest one. Each `#remove` call independently checks and fixes balance at its own level as the recursion unwinds, so in the worst case, a single `remove()` call can perform a rotation at every level of the tree, up to O(log n) rotations total (compare to `insert()`, which — per the note in Section 3 — never needs more than one rotation event, ever).

### Edge cases handled

**a) Removing from an empty tree** — `!node` base case returns `null` immediately; `this.root = null` stays `null`, no crash.

**b) Removing a value that doesn't exist** — the recursive search eventually reaches a `null` child (the spot where the value *would* be if it existed), hits the `!node` base case, returns `null` — which gets reassigned to a field that was already `null`, a harmless no-op. Height/balance are still recomputed redundantly on the way back up every level of the search path, but since nothing structurally changed, those recomputed values match what was already there — wasted work, but not incorrect.

**c) Removing a leaf** — `!node.left && !node.right` → `return null`, detaching it directly.

**d) Removing a node with exactly one child** — `return node.right` (or `return node.left`) promotes the child directly into the removed node's position; no height update is needed on the *child* itself at this point, since its own internal structure wasn't touched — only recomputed one level up, for the node it now replaces.

**e) Removing a node with two children** — value is copied from the successor, then the successor's original position is cleaned up via a **recursive** `#remove` call on the right subtree (not manual pointer surgery) — this is what guarantees the right subtree stays properly AVL-balanced even after the successor is spliced out of it.

**f) A deletion can trigger rebalancing far from where the value was removed** — demonstrated in the worked example above: removing `30` (on the right) triggered a rotation centered on the root, driven entirely by the *already-existing* left-heaviness becoming newly out of tolerance.

**Complexity:** O(log n) to find and remove the node (recursion depth = tree height), plus O(log n) worst case for rotations along the way back up — still O(log n) overall, since it's the same recursive pass doing both, not two separate traversals.

---

## Summary table

| Method | Time Complexity | Handles empty tree? | Rebalance trigger detection |
|---|---|---|---|
| `insert` | O(log n) guaranteed | ✅ (becomes root) | compares inserted **value** vs. child's value |
| `find` / `contains` | O(log n) guaranteed | ✅ (loop skipped) | n/a |
| `min` / `max` | O(log n) guaranteed | ✅ → `undefined` | n/a |
| `remove` | O(log n) guaranteed | ✅ (no-op) | compares **balance factor** of the taller child |
| `inOrder` / `preOrder` / `postOrder` | O(n) | ✅ → `[]` | n/a |
| `levelOrder` | O(n) | ✅ → `[]` | n/a (index-pointer queue, no `shift()` penalty) |
| `rightRotate` / `leftRotate` | O(1) | n/a | n/a |

## Core invariants to remember when debugging this AVL tree

> **1. Height is always `1 + max(height(left), height(right))`, recomputed bottom-up after every structural change — never assumed or left stale.** Every recursive `#insert`/`#remove` call updates `node.height` on its way back up, *before* checking balance, because the balance check depends on having correct, current heights for both children.

> **2. A rotation's two height recalculations must each use that node's OWN post-rotation children** — `node`'s new height from `node`'s new `left`/`right`, and `newRoot`'s new height from `newRoot`'s new `left`/`right`, never mixed. This is the single easiest place to introduce a silent, hard-to-spot bug in rotation code, since after the pointer swap, `node` and `newRoot` no longer share the same children they had a moment ago.

> **3. `insert` and `remove` detect *which* rotation to apply using two genuinely different techniques** — `insert` compares the just-inserted value against a child's value (valid because there's exactly one known inserted value); `remove` compares the *balance factor* of the taller child (necessary because deletion has no single equivalent reference point, especially in the two-children/successor case). Don't try to port one technique into the other method — they're not interchangeable.

> **4. Insertion needs at most one rotation event per call; deletion can need one at every ancestor level.** This asymmetry is a fundamental property of AVL trees, not a quirk of this implementation — it's why `remove`'s worked example above shows a rotation happening at a node far from where the value was actually deleted.