# Doubly Linked List — Implementation Notes

Like the singly linked list, but every node also keeps a `prev` pointer — enabling O(1) backward traversal, O(1) removal once you have a node reference, and a `get()` that can start from whichever end is closer to the target index.

```javascript
export class DoublyLinkedNode {
  prev = null;
  value;
  next = null;
}

export class DoublyLinkedList {
  head = null;
  tail = null;
  size = 0;
}
```

```
head                                          tail
 │                                              │
 ▼                                              ▼
[null|10|•]⇄[•|20|•]⇄[•|30|•]⇄[•|40|null]
     ↑↓          ↑↓         ↑↓
   prev/next   prev/next  prev/next

Each node points BOTH forward (next) and backward (prev) — the ⇄ symbol
represents that two-way link throughout these diagrams.
```

---

## 1. `DoublyLinkedNode` — the building block

```javascript
new DoublyLinkedNode(val)
```
Three slots: `prev` (previous node or `null`), `value`, `next` (following node or `null`). Compared to the singly linked version's `ListNode`, this is the one structural addition that makes everything else in this file possible.

```
     ┌──────┬───────┬──────┐
◀────│ prev │ value │ next │────▶
     └──────┴───────┴──────┘
```

---

## 2. `append(value)` — add to the end

```javascript
append(value) {
  const node = new DoublyLinkedNode(value);

  if (!this.head) this.head = node;

  if (!this.tail) this.tail = node;
  else {
    this.tail.next = node;
    node.prev = this.tail;
    this.tail = node;
  }

  this.size++;
}
```

### How it works
Same "if head is empty, if tail is empty, else link+advance" structure as the singly linked version — but the `else` branch now does **two** pointer assignments instead of one, because the link has to be wired in both directions.

```
Before:
head                tail
 │                    │
 ▼                    ▼
[10]⇄[20]

append(30)

Step 1: tail.next = new node        20.next → 30
Step 2: node.prev = old tail        30.prev → 20
Step 3: tail = new node              tail now = 30

After:
head                     tail
 │                         │
 ▼                         ▼
[10]⇄[20]⇄[30]
```

### Edge cases handled
**Appending to an empty list** — same pattern as before: both `!head` and `!tail` are true simultaneously, so the single new node becomes head *and* tail (with `prev`/`next` both staying `null`, since the node's own defaults handle that).

**Complexity:** O(1).

---

## 3. `prepend(value)` — add to the front

```javascript
prepend(value) {
  const node = new DoublyLinkedNode(value);

  if (this.head) {
    node.next = this.head;
    this.head.prev = node;
    this.head = node;
  } else {
    this.head = node;
    this.tail = node;
  }

  this.size++;
}
```

### How it works
**If the list already has a head**, wire the new node in front (`node.next = head`, and — the extra step doubly linked lists need — `head.prev = node`, so the *old* head can now walk backward to the new one), then move `head` forward.
**If the list is empty**, the new node becomes both head and tail directly (an explicit `else`, functionally the same outcome as `append`'s two-`if` version, just written differently here).

```
Before:
head             tail
 │                 │
 ▼                 ▼
[10]⇄[20]

prepend(1)

Step 1: node.next = old head        1.next → 10
Step 2: head.prev = node            10.prev → 1
Step 3: head = new node              head now = 1

After:
head                  tail
 │                      │
 ▼                      ▼
[1]⇄[10]⇄[20]
```

**Complexity:** O(1).

---

## 4. `get(index)` — the bidirectional-traversal optimization

```javascript
get(index) {
  if (index < 0 || index >= this.size) return undefined;

  let current;

  if (index < this.size / 2) {
    current = this.head;
    let step = 0;
    while (index > step) { current = current.next; step++; }
  } else {
    current = this.tail;
    let step = this.size - 1;
    while (index < step) { current = current.prev; step--; }
  }

  return current;
}
```

### How it works — this is the key upgrade over a singly linked list
A singly linked list can *only* walk forward from `head`, so `get()` there is always up to O(n). A doubly linked list can walk backward too — so this version picks whichever **end is closer** to the target index and starts from there:

- **`index` in the first half** (`index < size / 2`) → start at `head`, walk forward.
- **`index` in the second half** → start at `tail`, walk backward.

```
List of 8 elements, indices 0..7.  get(6):

Naive (head-only) approach: 6 steps forward from head.

Optimized approach: 6 is in the second half (6 ≥ 8/2=4)
  → start at tail (index 7), walk backward ONE step to reach index 6.

  0   1   2   3   4   5   6   7
[ ]-[ ]-[ ]-[ ]-[ ]-[ ]-[●]-[ ]
                          ▲       ▲
                     target=6   tail, step 7 → walk back 1 step

Only 1 hop instead of 6.
```

### Edge cases handled
- **`index < 0`** and **`index >= size`** → both rejected up front with a single combined condition, returning `undefined`.
- **Also returns `current`, the NODE itself** — not `current.value` like the singly linked list's `get()` did. This is intentional here: `remove()` and `insertAt()` both call `get()` internally and need the actual node reference (to rewire `prev`/`next`), not just its value.

**Complexity:** O(n) in the absolute worst case, but effectively **O(n/2)** on average since it never has to traverse more than half the list — this is strictly better than a singly linked list's `get()`, even though both are technically "O(n)" in big-O terms (which discards the constant factor).

---

## 5. `find(value)` — search by value

```javascript
find(value) {
  let current = this.head;
  let step = 0;

  while (this.size > step) {
    step++;
    if (current.value === value) return current;
    current = current.next;
  }

  return undefined;
}
```

### How it works
Same idea as the singly linked list's `find()`, but the loop condition is `this.size > step` (a counter) rather than `current != null`. Both approaches terminate at the same point in a well-formed list, but this version leans on `size` being trustworthy.

```
find(30) on [10]⇄[20]⇄[30]⇄[40]

step=0→1: check 10 ≠ 30, move on
step=1→2: check 20 ≠ 30, move on
step=2→3: check 30 = 30 → return this node ✔
```

### Edge cases handled
**Empty list** — `this.size > step` is `0 > 0`, false immediately, loop body never runs (so `current.value` is never accessed on a `null` `current` — this matters, since unlike `get()`, there's no defensive `current?.value`; the loop bound protects against ever dereferencing `null`).
**Value not found** — loop runs through the whole list, `step` reaches `size`, loop exits naturally, falls through to `return undefined`.

**Complexity:** O(n).

---

## 6. `remove(index)` — delete a node, with 4 distinct cases

```javascript
remove(index) {
  if (index < 0 || index >= this.size) return undefined;

  const current = this.get(index);

  if (this.size === 1) {
    this.head = null;
    this.tail = null;
  }
  else if (current === this.head) {
    this.head = current.next;
    this.head.prev = null;
  }
  else if (current === this.tail) {
    this.tail = current.prev;
    this.tail.next = null;
  }
  else {
    current.prev.next = current.next;
    current.next.prev = current.prev;
  }

  this.size--;
  current.prev = null;
  current.next = null;

  return current;
}
```

### How it works
Uses `get(index)` to fetch the actual node (benefiting from that same near-side traversal optimization — see below), then branches into **exactly one** of four mutually exclusive cases.

### Why the order of these checks matters
```
1. this.size === 1        (checked FIRST)
2. current === this.head
3. current === this.tail
4. else (middle)
```
If the list has exactly one node, that single node is *simultaneously* the head AND the tail. If case 2 (`current === this.head`) were checked before case 1, it would run `this.head = current.next` (→ `null`, fine) and then immediately try `this.head.prev = null` — but `this.head` is now `null`, so `null.prev` would **throw**. Checking `size === 1` first sidesteps this entirely by handling "the only node" as its own clean case, resetting both `head` and `tail` to `null` directly without touching `.prev`/`.next` on anything.

### Edge cases handled

**a) Removing the only node in the list**
```
Before:  head ⇄ [10] ⇄ tail        (size = 1)

remove(0)
  size === 1 → head = null, tail = null directly (no prev/next touching)

After:   head = null, tail = null   (size = 0)
```

**b) Removing the head (size > 1)**
```
Before:
head                     tail
 │                         │
 ▼                         ▼
[10]⇄[20]⇄[30]

remove(0)
  current = node 10
  head = current.next        → head now points to 20
  head.prev = null            → 20.prev is cleared (nothing points before it anymore)

After:
head              tail
 │                  │
 ▼                  ▼
[20]⇄[30]
```
Note the extra step vs. the singly linked list: `head.prev = null` is required here — without it, the new head (`20`) would still have a stale `prev` pointer back to the removed node `10`, which is a dangling reference to an otherwise-detached node.

**c) Removing the tail (size > 1)** — the mirror image of removing the head
```
Before:
head                     tail
 │                         │
 ▼                         ▼
[10]⇄[20]⇄[30]

remove(2)
  current = node 30
  tail = current.prev        → tail now points to 20
  tail.next = null             → 20.next is cleared

After:
head              tail
 │                  │
 ▼                  ▼
[10]⇄[20]
```

**d) Removing from the middle** — "bridge over" the target in BOTH directions
```
Before:
head                          tail
 │                              │
 ▼                              ▼
[10]⇄[20]⇄[30]⇄[40]

remove(1)   // removing "20"
  current = node 20
  current.prev.next = current.next    → 10.next = 30
  current.next.prev = current.prev    → 30.prev = 10

After:
head                    tail
 │                        │
 ▼                        ▼
[10]⇄[30]⇄[40]
```
Compare to the singly linked list, which only needed `previous.next = current.next` (one pointer). Here, both neighbors need updating since both directions of the link have to skip over the removed node.

**e) Disconnecting the removed node before returning it**
```javascript
current.prev = null;
current.next = null;
```
This runs **after every branch**, unconditionally. It severs the removed node from the rest of the list entirely — without this, `current` would still technically point *into* the list (e.g. `current.next` might still reference a node that's still in the list), which could cause confusing bugs if the caller holds onto the returned node and later reads its `prev`/`next`, or could interfere with garbage collection of an otherwise fully-detached node.

**f) Bonus optimization: `remove(0)` and `remove(size - 1)` are effectively O(1)**
Because `remove()` calls `get(index)` internally, and `get()` picks the nearer end — removing the very first or very last element means `get()` does zero or one traversal steps, not a full walk. Only removing from somewhere in the *middle* actually costs up to O(n/2).

**Complexity:** O(1) for `index === 0` or `index === size - 1`; up to O(n/2) otherwise (bounded by `get()`'s cost).

---

## 7. `insertAt(index, value)` — insert at an arbitrary position

```javascript
insertAt(index, value) {
  if (index < 0 || index > this.size) return false;

  if (index === 0) { this.prepend(value); return true; }
  if (index === this.size) { this.append(value); return true; }

  const node = new DoublyLinkedNode(value);
  const current = this.get(index - 1);

  node.next = current.next;
  node.prev = current;
  current.next.prev = node;
  current.next = node;

  this.size++;
  return true;
}
```

### How it works
1. **Bounds check** — note this uses `index > this.size` (not `>=`), since inserting exactly *at* `size` is valid — it means "insert after everything," i.e. append.
2. **Delegates the two easy edge positions** to the methods that already handle them correctly: index `0` → `prepend()`, index `size` → `append()`.
3. **For a genuine middle insertion**, find the node currently sitting *before* the target position (`get(index - 1)`), then splice the new node in between it and its current next neighbor — four pointer reassignments to keep all four directions consistent.

```
Before:
[10]⇄[20]⇄[40]
       ▲
    current = get(0) = node 20  (inserting at index 1 → look at index-1 = 0)

insertAt(1, 30)

node = new node holding 30

Step 1: node.next = current.next     30.next → 40
Step 2: node.prev = current           30.prev → 20
Step 3: current.next.prev = node     40.prev → 30   (must happen BEFORE step 4!)
Step 4: current.next = node           20.next → 30

After:
[10]⇄[20]⇄[30]⇄[40]
```

### Why the order of steps 3 and 4 matters
`current.next.prev = node` (step 3) reads `current.next` — which at that point is **still the OLD next node** (`40`), because step 4 (`current.next = node`) hasn't happened yet. If steps 3 and 4 were swapped, `current.next` would already be the *new* node by the time step 3 ran, and `current.next.prev = node` would become `node.prev = node` — wiring the new node's `prev` to itself instead of fixing `40`'s `prev`. The order here is deliberate and necessary.

### Edge cases handled
- **`index < 0` or `index > size`** → rejected, returns `false`.
- **`index === 0`** (insert at the very front) → delegated to `prepend()`, which already correctly handles both the empty-list and non-empty-list cases.
- **`index === size`** (insert at the very end, including into an empty list where `size === 0`) → delegated to `append()`, same reasoning.
- **Genuine middle insertion** — only reachable once both edge cases above are ruled out, so `get(index - 1)` is guaranteed to return a real, existing node (never `undefined`) at this point.

**Complexity:** O(1) for the two delegated edge cases; up to O(n/2) for a middle insertion (bounded by `get()`'s cost).

---

## 8. `reverse()` — flip the entire list in place

```javascript
reverse() {
  let current = this.head;
  let step = 0;

  while (this.size > step) {
    const next = current.next;
    const prev = current.prev;

    current.next = prev;
    current.prev = next;

    current = next;
    step++;
  }

  [this.head, this.tail] = [this.tail, this.head];
}
```

### How it works
Walks every node exactly once, and at each node **swaps its `next` and `prev`** — turning every forward link into a backward link and vice versa. The tricky part: once you overwrite `current.next`, you'd lose the ability to move forward — so the *original* `next` is saved into a local variable **before** either pointer is touched.

```
Reversing [10]⇄[20]⇄[30]  (before: head=10, tail=30)

Visiting node 10:
  next = 10.next = 20        (saved BEFORE mutating)
  prev = 10.prev = null       (saved BEFORE mutating)
  10.next = prev = null       ← 10's forward link now points to nothing
  10.prev = next = 20         ← 10's backward link now points to 20
  current = next = 20          ← move on using the SAVED value, not the
                                   now-mutated current.next (which is null!)

Visiting node 20:
  next = 20.next = 30
  prev = 20.prev = 10
  20.next = prev = 10          ← swapped
  20.prev = next = 30          ← swapped
  current = 30

Visiting node 30:
  next = 30.next = null
  prev = 30.prev = 20
  30.next = prev = 20
  30.prev = next = null
  current = null

Loop ends (step reached size = 3).

Final swap:  [head, tail] = [tail, head]
  head becomes what tail WAS pointing to → 30
  tail becomes what head WAS pointing to → 10

Result:
head                     tail
 │                         │
 ▼                         ▼
[30]⇄[20]⇄[10]
```

### Why save `next` in a local variable at all?
```
current.next = prev;      // current.next is OVERWRITTEN here
current.prev = next;
current = next;            // if we tried "current = current.next" NOW,
                             // we'd be reading the value we just wrote
                             // one line above (the OLD prev) — completely
                             // wrong direction, the walk would go backward
                             // through the not-yet-reversed part, or hit
                             // null too early.
```
The local `next` variable is a snapshot taken **before** any mutation — it's the only reliable way to know "what used to come after this node" once `current.next` itself becomes repurposed to mean something else.

### Edge cases handled
**Empty list** — `this.size > step` is `0 > 0`, false immediately; the loop body never runs, and the final `[head, tail] = [tail, head]` just swaps two `null`s — a correct no-op.
**Single-node list** — the loop runs once: `next = null`, `prev = null`, so `current.next = null` and `current.prev = null` (both were already `null` — no actual change), then the head/tail swap exchanges the single node with itself (since `head === tail` for a one-element list) — also a correct no-op.

**Complexity:** O(n) — every node visited exactly once, with O(1) work each.

---

## 9. `clear()` — reset everything

```javascript
clear() {
  this.head = null;
  this.tail = null;
  this.size = 0;
}
```
Simplest method in the file — just drops all references. Once `head` and `tail` are both `null`, nothing outside the class holds a reference into the old chain either (assuming the caller doesn't independently keep old node references around), so the whole structure becomes eligible for garbage collection.

**Complexity:** O(1) — note this is O(1) precisely *because* it doesn't need to walk the list to null out every node's pointers individually; dropping the two entry points (`head`, `tail`) is enough for the garbage collector to reclaim everything reachable only through them.

---

## Summary table

| Method | Time Complexity | Handles empty list? | Special pointer updates |
|---|---|---|---|
| `append` | O(1) | ✅ (becomes head+tail) | `tail`, new node's `prev` |
| `prepend` | O(1) | ✅ (becomes head+tail) | `head`, old head's `prev` |
| `get` | O(n/2) avg | ✅ (bounds check → `undefined`) | none (read-only) |
| `find` | O(n) | ✅ (loop skipped → `undefined`) | none |
| `remove` | O(1) at edges, else O(n/2) | ✅ (bounds check → `undefined`) | `head`/`tail` + neighbor's `prev`/`next`, and severs removed node |
| `insertAt` | O(1) at edges, else O(n/2) | ✅ (delegates to append/prepend) | 4 pointers rewired for middle insert |
| `reverse` | O(n) | ✅ (loop skipped, no-op swap) | every node's `prev`⇄`next`, plus `head`⇄`tail` |
| `clear` | O(1) | n/a | `head`, `tail`, `size` |

## Core invariants to remember when debugging this doubly linked list

> **1. Every link is bidirectional — for every `A.next = B`, there must also be `B.prev = A`.** Nearly every bug in doubly linked list code comes from updating one direction and forgetting the other (see `remove()`'s head/tail cases, and `insertAt()`'s 4-step splice).

> **2. Order of operations matters when one pointer read depends on another pointer's OLD value.** Both `reverse()` (saving `next`/`prev` before mutating) and `insertAt()` (reading `current.next` in step 3 before overwriting it in step 4) rely on this — swap the order and you silently corrupt the list instead of crashing, which is worse.

> **3. Check the "only one node" case before checking "is this the head" / "is this the tail" separately** — in a single-node list, a node is both at once, and touching `.prev`/`.next` on a now-`null` `head`/`tail` throws. `remove()`'s `size === 1` check being first is what avoids this.