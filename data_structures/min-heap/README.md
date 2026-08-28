# MinHeap (Array-Backed Binary Heap) — Implementation Notes

A binary heap stored in a **flat array**, not as linked nodes — the tree structure is entirely implicit, derived from index arithmetic. The **min-heap property**: every parent's value is ≤ both its children's values (so the smallest element in the whole structure is always at index `0`).

```javascript
export class MinHeap {
  #bucket = [];
}
```

### The array ↔ tree mapping (the foundation everything else builds on)

```
Array:  [ 3, 8, 5, 12, 10, 6, 9 ]
Index:    0  1  2   3   4  5  6

As a tree:
                3(0)
              /      \
           8(1)        5(2)
          /   \        /   \
      12(3)  10(4)   6(5)  9(6)

For any index i:
  parent(i) = floor((i - 1) / 2)
  leftChild(i)  = 2*i + 1
  rightChild(i) = 2*i + 2

Check: parent of index 4 (value 10) = floor((4-1)/2) = floor(1.5) = 1 → index 1 (value 8) ✓
       children of index 1 (value 8) = 2*1+1=3, 2*1+2=4 → indices 3,4 (values 12,10) ✓
```

Every method in this file is really just "walk up or down this implicit tree using those three formulas, swapping elements to restore the min-heap property."

---

## 1. `size()` / `isEmpty()` / `peek()` — trivial accessors

```javascript
size() { return this.#bucket.length; }
isEmpty() { return this.#bucket.length === 0; }
peek() { return this.#bucket?.[0]; }
```

`peek()` returns the current minimum without removing it — always at index `0`, since the min-heap property guarantees nothing can be smaller than the root.

### Edge case handled
**Empty heap** — `this.#bucket[0]` on an empty array is simply `undefined` (out-of-range array access in JS doesn't throw, it just returns `undefined`), so `peek()` on an empty heap correctly returns `undefined` with no special-casing needed. The `?.` in `this.#bucket?.[0]` is a bit of defensive belt-and-braces styling — `#bucket` itself is always an array (initialized as `[]`, and `buildHeap` always reassigns it to another array via `Array.from`), so it can never actually be `null`/`undefined` for the `?.` to meaningfully guard against; the real "is it empty" protection comes from indexing past the array's length, not from the optional chain.

**Complexity:** O(1) for all three.

---

## 2. `insert(value)` — add a value, then "bubble up"

```javascript
insert(value) {
  this.#bucket.push(value);
  let insertedIdx = this.size() - 1;
  this.#heapifyUp(insertedIdx);
}
```

### How it works
Appending to the **end** of the array is the only way to add a node while keeping the tree "complete" (no gaps) — but the new value might be smaller than its ancestors, violating the min-heap property. `#heapifyUp` fixes that by repeatedly swapping the new value with its parent until it either reaches the root or finds a parent smaller than (or equal to) itself.

```javascript
#heapifyUp(index) {
  let parentIdx = Math.floor((index - 1) / 2);

  while (index > 0 && this.#bucket[parentIdx] > this.#bucket[index]) {
    [this.#bucket[parentIdx], this.#bucket[index]] =
      [this.#bucket[index], this.#bucket[parentIdx]];

    index = parentIdx;
    parentIdx = Math.floor((index - 1) / 2);
  }
}
```

```
insert(4) into: [8, 10, 5]      (tree: 8 at root, 10 and 5 as children)

Array after push: [8, 10, 5, 4]     insertedIdx = 3

Step 1: parentIdx = floor((3-1)/2) = 1  → bucket[1]=10, bucket[3]=4
  10 > 4 → SWAP    → [8, 4, 5, 10]
  index = 1

Step 2: parentIdx = floor((1-1)/2) = 0  → bucket[0]=8, bucket[1]=4
  8 > 4 → SWAP    → [4, 8, 5, 10]
  index = 0

Step 3: index === 0 → loop condition `index > 0` fails → STOP

Final: [4, 8, 5, 10]

As a tree:
        4
       / \
      8   5
     /
   10
```

### Edge cases handled
**a) Inserting into an empty heap** — after `push`, `insertedIdx = 0`; `#heapifyUp(0)`'s `while (index > 0 && ...)` is false immediately (since `index === 0`), so the loop body never runs — correctly a no-op, the single element is already a trivially valid heap.
**b) The new value is already ≥ its parent** — the comparison `this.#bucket[parentIdx] > this.#bucket[index]` is false on the first check, loop exits immediately without any swaps.

**Complexity:** O(log n) — the heap's height is always ⌊log₂ n⌋ for a complete binary tree, and bubbling up touches at most one node per level.

---

## 3. `extractMin()` — remove and return the smallest value

```javascript
extractMin() {
  if (this.#bucket.length === 0) return undefined;
  if (this.#bucket.length === 1) return this.#bucket.shift();

  const min = this.#bucket[0];
  this.#bucket[0] = this.#bucket.pop();
  this.#heapifyDown(0);

  return min;
}
```

### How it works — the classic "swap root with last, then sift down" pattern
You can't just delete index `0` outright (that would leave a hole and break the array's "complete tree" shape). Instead: save the root's value to return later, move the **last** element into the root position (this preserves completeness — the tree shrinks from its only valid removal point, the last leaf), then let `#heapifyDown` sink that relocated value to wherever it actually belongs.

```javascript
#heapifyDown(index) {
  while (true) {
    const leftIdx = 2 * index + 1;
    const rightIdx = 2 * index + 2;
    let smallestIdx = index;

    if (leftIdx < this.#bucket.length && this.#bucket[leftIdx] < this.#bucket[smallestIdx]) {
      smallestIdx = leftIdx;
    }
    if (rightIdx < this.#bucket.length && this.#bucket[rightIdx] < this.#bucket[smallestIdx]) {
      smallestIdx = rightIdx;
    }

    if (smallestIdx === index) break;

    [this.#bucket[index], this.#bucket[smallestIdx]] =
      [this.#bucket[smallestIdx], this.#bucket[index]];

    index = smallestIdx;
  }
}
```

```
extractMin() on: [4, 8, 5, 10, 9]

min = 4 (saved to return later)
pop() removes 9 (last element), bucket[0] = 9

Array now: [9, 8, 5, 10]    ← relocated value 9 sitting at the root

heapifyDown(0):
  left=1(8), right=2(5). smallest of {9,8,5} is 5 (index 2) → SWAP
    → [5, 8, 9, 10]         index becomes 2

  left=2*2+1=5 (out of bounds, length=4) → skip
  right=2*2+2=6 (out of bounds) → skip
  smallestIdx stays = index(2) → BREAK

Final heap: [5, 8, 9, 10]     returned min = 4
```

### ⚠️ Why the single-element case NEEDS its own special branch
This is the subtlest thing in the whole file. Trace what would happen **without** the `if (length === 1) return this.#bucket.shift();` special case, on a heap of exactly one element `[7]`:
```
const min = this.#bucket[0];        // min = 7
this.#bucket[0] = this.#bucket.pop(); // pop() removes the ONLY element (array → []),
                                       //   returns 7, then bucket[0] = 7 puts it
                                       //   right back in! Array is now [7] again — UNCHANGED.
```
Without the special case, extracting the only element from a single-element heap would silently **fail to shrink the heap at all** — `pop()` and the immediate reassignment to `bucket[0]` cancel each other out when there's only one slot. The explicit `length === 1` branch sidesteps this entirely by using `.shift()` instead, which correctly empties the array. This is a real, easy-to-miss trap in the "swap root with last" pattern, and the code correctly guards against it.

### Edge cases handled
**a) Empty heap** — `length === 0` guard, returns `undefined` immediately.
**b) Single-element heap** — see above; explicitly handled via `.shift()` rather than the general swap-and-sink logic, which would silently do nothing.
**c) Two-element heap** — general path: `pop()` removes the second element (array → length 1), `bucket[0]` is overwritten with that same value (a harmless no-op reassignment onto the only remaining slot), then `#heapifyDown(0)` runs but has no children to compare against (`leftIdx = 1` is already `≥ length`), so it breaks on the first iteration — correctly leaves a valid single-element heap.

**Complexity:** O(log n) — dominated by `#heapifyDown`, which touches at most one node per level.

---

## 4. `buildHeap(values)` — construct a heap from an existing array in O(n)

```javascript
buildHeap(values) {
  this.#bucket = Array.from(values);

  const lastParentIdx = Math.floor(this.#bucket.length / 2) - 1;

  for (let i = lastParentIdx; i >= 0; i--) {
    this.#heapifyDown(i);
  }
}
```

### How it works — Floyd's build-heap algorithm
Rather than inserting values one at a time (which would cost O(n log n) total, via `n` calls to `insert`), this takes a smarter route: copy the raw array in as-is (arbitrary, unsorted order), then run `#heapifyDown` starting from the **last node that actually has any children** (`lastParentIdx`), walking backward to the root. Every leaf node is trivially already a valid 1-element "heap" on its own, so there's no need to process them individually — only internal nodes need sifting.

```
buildHeap([9, 4, 7, 1, 8, 5])

Array indices:  0  1  2  3  4  5
Values:         9  4  7  1  8  5

lastParentIdx = floor(6/2) - 1 = 3 - 1 = 2   (index 2 is the last node with a child)

As a tree before any heapify:
              9(0)
            /      \
          4(1)       7(2)
         /    \      /
       1(3)   8(4)  5(5)

i=2: heapifyDown(2) → node 7, child 5(idx5). 5<7 → swap
              9
            /   \
          4       5
         / \      /
       1   8    7

i=1: heapifyDown(1) → node 4, children 1(idx3),8(idx4). smallest=1<4 → swap
              9
            /   \
          1       5
         / \      /
       4   8    7

i=0: heapifyDown(0) → node 9, children 1(idx1),5(idx2). smallest=1<9 → swap with idx1
              1
            /   \
          9       5
         / \      /
       4   8    7
      then continue sifting the DISPLACED 9 further down:
      9 now at index1, children 4(idx3),8(idx4). smallest=4<9 → swap
              1
            /   \
          4       5
         / \      /
       9   8    7

Final heap array: [1, 4, 5, 9, 8, 7]     (valid min-heap ✓)
```

### Why this is O(n), not O(n log n)
It's tempting to assume "n calls to an O(log n) operation = O(n log n)," but that overcounts: **most nodes in a heap are near the bottom**, and a node at height `h` from the bottom only ever sifts down at most `h` levels — it can't travel further than the tree's remaining depth below it. Roughly half the nodes are leaves (0 possible sift distance), a quarter are one level up (at most 1 swap), an eighth are two levels up, and so on. Summing `(number of nodes at height h) × h` across all levels converges to O(n) overall, not O(n log n) — a classical result for bottom-up heap construction.

### Edge cases handled
**a) Empty array** — `lastParentIdx = floor(0/2) - 1 = -1`; the `for` loop (`i = -1; i >= 0; ...`) never runs, leaving `#bucket` as a valid empty heap.
**b) Single-element array** — `lastParentIdx = floor(1/2) - 1 = -1`; same as above, no heapify needed — one element is trivially already a valid heap.
**c) Doesn't mutate the caller's original array** — `Array.from(values)` makes a **shallow copy**, so heapifying (which reorders elements in place) never reorders the array the caller passed in.

**Complexity:** O(n) — see the explanation above; genuinely faster than `n` individual `insert()` calls would be.

---

## 5. `delete(value)` — remove an arbitrary value, not just the minimum

```javascript
delete(value) {
  let index = this.#bucket.indexOf(value);
  if (index == -1) return false;

  if (index === this.#bucket.length - 1) {
    this.#bucket.pop();
    return true;
  }

  const last = this.#bucket[this.#bucket.length - 1];
  this.#bucket[index] = last;
  this.#bucket.pop();

  const parentIdx = Math.floor((index - 1) / 2);

  if (index > 0 && this.#bucket[parentIdx] > this.#bucket[index]) {
    this.#heapifyUp(index);
  } else {
    this.#heapifyDown(index);
  }

  return true;
}
```

### How it works
1. **Locate the value** with `indexOf` (linear scan, strict `===` comparison — see edge cases below).
2. **If it's already the last element**, just `pop()` it — removing the very last leaf can never disturb the heap property anywhere else, so no heapify is needed at all.
3. **Otherwise**, overwrite the target slot with the **last** element's value, then shrink the array by popping that now-duplicated last slot. This is the same "swap with the last, then fix up" idea as `extractMin`, just applied at an arbitrary index instead of always the root.
4. **Decide which direction to sift**: the relocated value might now be *smaller* than its new parent (needs to move up) or *larger* than one of its new children (needs to move down) — but never both at once, since only this one slot's relationships changed. Check the parent comparison first; if it doesn't need to move up, `#heapifyDown` is called as the fallback — and if the value doesn't need to move down either, `#heapifyDown`'s own `if (smallestIdx === index) break;` check makes that call a harmless no-op.

```
delete(8) on: [1, 4, 5, 9, 8, 7]

indexOf(8) = 4          (not the last index, which is 5)

last = bucket[5] = 7
bucket[4] = 7            → [1, 4, 5, 9, 7, 7]
pop()                     → [1, 4, 5, 9, 7]      (length 5 now)

parentIdx of index4 = floor((4-1)/2) = 1  → bucket[1] = 4
index>0 AND bucket[1](4) > bucket[4](7)?  4 > 7 is FALSE
  → not moving up → call heapifyDown(4)

heapifyDown(4): leftIdx=9, rightIdx=10, both ≥ length(5) → no children to compare
  smallestIdx stays = index(4) → break immediately (no-op)

Final: [1, 4, 5, 9, 7]     valid heap, 8 successfully removed
```

### Edge cases handled

**a) Value not present** — `indexOf` returns `-1`, `delete` returns `false` immediately, nothing mutated.

**b) Deleting the last element in the array** — explicitly short-circuited with a plain `pop()`; skips the swap-and-heapify machinery entirely since it's provably unnecessary (removing a trailing leaf can't violate the heap property elsewhere).

**c) Deleting the root** (`index === 0`) — the `index > 0 && ...` check in the direction-decision step is `false` purely because `index === 0` (there's no parent to compare against for the root), so it always falls to the `else` branch, `#heapifyDown(0)` — which is exactly correct, since a root can only ever need to move *downward*, never up.

**d) Deleting a value that appears more than once** — `indexOf` finds only the **first** occurrence in array order (not necessarily "first" in any heap-meaningful sense, like shallowest) — only that one occurrence is removed; any duplicates elsewhere in the array are left untouched. This is expected/intended behavior for a value-based delete, just worth knowing if your heap can contain duplicate values.

**e) Deleting from a single-element heap** — `index === 0`, and since `length - 1 === 0` too, this is caught by the "deleting the last element" branch (`index === this.#bucket.length - 1`) before ever reaching the swap logic — correctly just pops the only element, no heapify attempted on an empty array.

**Complexity:** O(n) for the `indexOf` scan (a heap has no faster way to locate an arbitrary value — the ordering only guarantees the minimum is at the root, nothing about where any other value lives) + O(log n) for the subsequent heapify — O(n) overall, dominated by the search.

---

## Summary table

| Method | Time Complexity | Handles empty heap? | Notes |
|---|---|---|---|
| `size` / `isEmpty` / `peek` | O(1) | ✅ (`peek` → `undefined`) | |
| `insert` | O(log n) | ✅ (no-op heapifyUp) | |
| `extractMin` | O(1) empty/1-elem, O(log n) general | ✅ → `undefined` | 1-element case needs its own branch — see explanation above |
| `buildHeap` | O(n) | ✅ (loop skipped) | faster than n individual inserts |
| `delete` | O(n) — dominated by the search | ✅ (`indexOf` → `-1` → `false`) | only removes the first matching occurrence |

## Core invariants to remember when debugging this heap

> **1. The array must always represent a *complete* binary tree — no gaps.** Every insertion appends at the end (the only position that keeps completeness), and every removal relocates the *last* element into the vacated slot rather than leaving a hole, then re-sinks/re-bubbles it into place.

> **2. After a single swap-in, a relocated value can only need to move in ONE direction — up or down, never both.** This is why `delete()` can safely pick a direction with one `if/else` rather than always running both heapify functions "just in case."

> **3. `extractMin`'s "swap root with last, then pop" trick has a hidden self-overwrite trap when there's only one element** — `pop()` followed immediately by reassigning to the now-empty array's index `0` puts the same value right back. Any code using this exact pattern (swap-with-last-then-remove) needs to special-case the "only one element left" scenario, exactly as this file does.