# Singly Linked List — Implementation Notes

A from-scratch singly linked list in JavaScript with `head`, `tail`, and `size` tracking.

```javascript
export class ListNode {
  value = null;
  next = null;
}

export class LinkedList {
  head = null;
  tail = null;
  size = 0;
}
```

**Why track both `head` AND `tail`?**
Without a `tail` pointer, `append()` would need to walk the whole list every time to find the last node — O(n). Keeping a `tail` reference makes `append()` O(1).

```
head                              tail
 │                                  │
 ▼                                  ▼
[10|•]───▶[20|•]───▶[30|•]───▶[40|null]
```

---

## 1. `ListNode` — the building block

```javascript
new ListNode(value, next = null)
```

Each node is just a box holding a `value` and a pointer (`next`) to the following node. `next` defaults to `null`, meaning "I'm not connected to anything yet."

```
┌───────┬──────┐
│ value │ next │──▶ (next node, or null)
└───────┴──────┘
```

---

## 2. `append(value)` — add to the end

```javascript
append(value) {
  const node = new ListNode(value);

  if (!this.head) this.head = node;

  if (!this.tail) this.tail = node;
  else {
    this.tail.next = node;
    this.tail = node;
  }

  this.size++;
}
```

### How it works
1. Create the new node.
2. **If the list is empty** (`head` is `null`), the new node becomes the `head`.
3. **If the list is empty** (`tail` is `null` too — same moment), the new node also becomes the `tail`.
4. **If the list already has a tail**, link the old tail to the new node (`tail.next = node`), then move `tail` forward to the new node.
5. Increment `size`.

### Why two separate `if` checks instead of `if/else`?
Because on the **first append to an empty list**, both conditions (`!head` and `!tail`) are true — the same node needs to become *both* head and tail. Using one `if(!head)` and a separate `if(!tail) ... else ...` lets both assignments happen without duplicating node-creation logic.

### Edge cases handled

**a) Appending to an empty list**
```
Before:  head = null, tail = null

append(10)

After:   head ──▶ [10|null] ◀── tail
```
Both `head` and `tail` end up pointing at the same single node.

**b) Appending to a non-empty list**
```
Before:
head                tail
 │                    │
 ▼                    ▼
[10|•]───▶[20|null]

append(30)

Step 1: tail.next = new node
[10|•]───▶[20|•]───▶[30|null]

Step 2: tail = new node
head                       tail
 │                           │
 ▼                           ▼
[10|•]───▶[20|•]───▶[30|null]
```

**Complexity:** O(1) — no traversal needed, thanks to the `tail` pointer.

---

## 3. `prepend(value)` — add to the front

```javascript
prepend(value) {
  const node = new ListNode(value);
  if (this.head) node.next = this.head;
  this.head = node;
  if (!this.tail) this.tail = node;
  this.size++;
}
```

### How it works
1. Create the new node.
2. **If a head already exists**, point the new node's `next` at the old head (chaining it in front).
3. The new node *always* becomes the new `head`.
4. **If the list was empty** (no `tail` yet), the new node is also the `tail`.
5. Increment `size`.

### Edge cases handled

**a) Prepending to an empty list**
```
Before:  head = null, tail = null

prepend(5)

After:   head ──▶ [5|null] ◀── tail
```
Same "become both head and tail" situation as `append` on an empty list.

**b) Prepending to a non-empty list**
```
Before:
head              tail
 │                  │
 ▼                  ▼
[10|•]───▶[20|null]

prepend(1)

Step 1: node.next = old head
[1|•]──▶[10|•]───▶[20|null]

Step 2: head = new node
head                            tail
 │                                │
 ▼                                ▼
[1|•]──▶[10|•]───▶[20|null]
```

**Complexity:** O(1) — the front is always directly reachable via `head`.

---

## 4. `get(index)` — read value at position

```javascript
get(index) {
  if (index < 0) return undefined;
  if (index >= this.size) return undefined;

  let current = this.head;
  let step = 0;

  while (index > step) {
    current = current?.next;
    step++;
  }

  return current?.value;
}
```

### How it works
Walks node-by-node from `head`, incrementing `step` until it equals `index`.

```
get(2) on: [10]──▶[20]──▶[30]──▶[40]
             ▲step0
                    ▲step1
                           ▲step2 = index → stop, return 30
```

### Edge cases handled

| Input | Guard | Why |
|---|---|---|
| `index < 0` | `if (index < 0) return undefined` | Negative indices are meaningless in a list — fail fast instead of looping forever/incorrectly. |
| `index >= size` | `if (index >= this.size) return undefined` | Prevents walking off the end of the list into `null.next`, which would throw. |
| `current?.next` / `current?.value` | Optional chaining | A **defensive safety net** — even though bounds are pre-checked using `size`, this protects against the list ever becoming desynced from its own `size` counter (e.g. a bug elsewhere leaves a dangling `null` mid-chain). Without it, walking past the actual end would throw `Cannot read properties of null`. |

```
get(-1)          → undefined (rejected immediately)
get(99) on len=3 → undefined (rejected immediately)
get(0)  → head.value directly (loop body never runs, step already equals index)
```

**Complexity:** O(n) worst case (getting the last element), O(1) best case (index 0).

---

## 5. `find(value)` — search by value

```javascript
find(value) {
  let current = this.head;
  while (current != null) {
    if (current.value === value) return current;
    current = current.next;
  }
}
```

### How it works
Simple linear scan from `head` to the end, comparing each node's `value` with strict equality (`===`).

```
find(30) on: [10]──▶[20]──▶[30]──▶[40]

check 10 ≠ 30 → move on
check 20 ≠ 30 → move on
check 30 = 30 → return this node ✔
```

### Edge cases handled

**a) Value not found**
```javascript
find(999) // loop runs to completion, current becomes null,
           // while exits, function falls off the end
           // → returns undefined (implicit)
```
There's no explicit `return undefined;` — JavaScript functions implicitly return `undefined` when they finish without hitting a `return`. This is intentional/idiomatic but worth knowing when debugging.

**b) Empty list**
```
head = null → while (current != null) is false immediately → returns undefined
```

**Note:** `find` returns the **node itself**, not just the value — useful if the caller wants to keep a reference and mutate `.next` manually. Contrast with `get()`, which returns only the `.value`.

**Complexity:** O(n) worst case (value at the end, or absent).

---

## 6. `remove(index)` — delete node at position

```javascript
remove(index) {
  if (index < 0) return;
  if (index >= this.size) return;

  if (index === 0) {
    this.head = this.head.next || null;
    if (this.size == 1) this.tail = null;
    this.size--;
    return;
  }

  let previous = this.head;
  let step = 0;

  while (index - 1 > step) {
    previous = previous.next;
    step++;
  }

  let current = previous.next;
  previous.next = current.next;

  if (current == this.tail) {
    this.tail = previous;
  }

  this.size--;
  return;
}
```

### How it works — two distinct paths

**Path A: removing the head (`index === 0`)**
No "previous" node exists to relink, so this is handled as a special case: just move `head` forward by one.

**Path B: removing anything else**
Walk to the node **just before** the target (`previous`), then "skip over" the target by pointing `previous.next` at `current.next`. The target node is left with nothing pointing to it, so it's garbage collected.

```
Removing by index means: walk to previous, then bridge over current.

Before:              previous  current
                         │        │
                         ▼        ▼
        [10]──▶[20]──▶[30]──▶[40]──▶null

Bridge: previous.next = current.next
        (30.next = 40.next = null... wait, current.next here is 40's link)

Concretely, remove(index) targeting node "30":
   previous = 20, current = 30
   previous.next = current.next  →  20.next = 40

After:
        [10]──▶[20]──────────▶[40]──▶null
                     (30 is unlinked, garbage collected)
```

### Edge cases handled

**a) Negative or out-of-range index**
```javascript
remove(-1)      // no-op, returns undefined
remove(size)    // out of range, no-op
```
Guarded up front — same reasoning as `get()`: prevents corrupting the list or throwing on `null`.

**b) Removing the only node in the list (`index === 0 && size === 1`)**
```
Before:  head ──▶ [10|null] ◀── tail       (size = 1)

remove(0)

head = head.next || null   → head = null   (head.next was already null,
                                              the `|| null` just makes it explicit)
size == 1 → tail = null    → tail must ALSO be reset, or it would
                              dangle, pointing at a node nobody
                              else references anymore (a "ghost tail")

After:   head = null, tail = null           (size = 0)
```
**Why this matters:** if you forgot to reset `tail`, the very next `append()` would see `this.tail` as non-null and do `this.tail.next = node`, silently reattaching the new node onto the *removed, orphaned* node instead of onto `head` — corrupting the list in a way that's hard to debug because `head` would look empty (`null`) while `tail` secretly points into deleted memory.

**c) Removing the head when more nodes exist (`index === 0 && size > 1`)**
```
Before:
head                     tail
 │                         │
 ▼                         ▼
[10]──▶[20]──▶[30|null]

remove(0)

head = head.next  →  head now points to 20
tail is untouched (still correctly 30)

After:
head              tail
 │                  │
 ▼                  ▼
[20]──▶[30|null]
```

**d) Removing the tail node (last element, `index === size - 1`, but not index 0)**
This is the trickiest case — the code has to notice that the node it just unlinked *was* the tail, and pull `tail` back one step.
```
Before:
head                            tail
 │                                │
 ▼                                ▼
[10]──▶[20]──▶[30|null]

remove(2)   // removing "30"

previous walks to 20 (index - 1 = 1 step)
current = previous.next = 30
previous.next = current.next  → 20.next = null

current == this.tail?  → 30 == tail → YES
this.tail = previous   → tail now = 20

After:
head              tail
 │                  │
 ▼                  ▼
[10]──▶[20|null]
```
**Why the `current == this.tail` check is necessary:** without it, `tail` would keep pointing at the now-detached node `30`. The list would *look* fine from `head`, but any future `append()` would attach new nodes onto the orphaned `30`, which is no longer reachable from `head` — so those new nodes would silently vanish from the list forever.

**e) Removing from the middle**
Standard case, shown in the "How it works" diagram above — no special handling needed since neither `head` nor `tail` is affected.

**Complexity:**
- Removing index `0`: O(1)
- Removing any other index: O(n) (must walk to `previous`)

---

## Summary table

| Method | Time Complexity | Handles empty list? | Special pointer updates |
|---|---|---|---|
| `append` | O(1) | ✅ (becomes head+tail) | `tail` |
| `prepend` | O(1) | ✅ (becomes head+tail) | `head`, maybe `tail` |
| `get` | O(n) | ✅ (bounds check → `undefined`) | none |
| `find` | O(n) | ✅ (loop skipped → `undefined`) | none |
| `remove` | O(1) at index 0, else O(n) | ✅ (bounds check → no-op) | `head`, maybe `tail` |

## Core invariant to remember when debugging this list

> **Every time a node that *might* be the tail gets detached, `tail` must be explicitly re-pointed — the garbage collector doesn't tell you your `tail` reference is now stale.**

This single invariant explains cases 6(b) and 6(d) above, and is the most common bug source in hand-rolled linked lists.