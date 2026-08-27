# HashSet (Separate Chaining) — Implementation Notes

A hash **set** — same underlying bucket-array-with-chaining strategy as the `HashMap` you likely just built, but each bucket stores raw **items** directly (no `[key, value]` pairs), since a set only cares about *membership*, not values.

```javascript
export class HashSet {
  #bucket = [];        // array of "slots" — undefined OR an array of raw items
  #tableSize = 10;      // total number of slots
  #size = 0;             // number of items actually stored
}
```

```
Conceptual layout (tableSize = 5):

  index:    0        1        2        3        4
          ┌────┐   ┌────┐   ┌────┐   ┌────┐   ┌────┐
bucket = │undef│  │undef│  │undef│  │undef│  │undef│   ← all empty at start
          └────┘   └────┘   └────┘   └────┘   └────┘

After add("ab") and a colliding add("ba"):

  index:    0                   1        2        3        4
          ┌─────────────────┐ ┌────┐   ┌────┐   ┌────┐   ┌────┐
bucket = │["ab", "ba"]        │undef│  │undef│  │undef│  │undef│
          └─────────────────┘ └────┘   └────┘   └────┘   └────┘
           (chain of raw items, not pairs)
```

This is the exact same `getHash` polynomial rolling hash used elsewhere — see below for the walkthrough — imported/reused as-is.

---

## 1. `getHash(key, size)` — the hash function

```javascript
export function getHash(key, size = 5) {
  const str = String(key);
  let result = 0;

  for (const ch of str) {
    result = (result * 31 + ch.charCodeAt(0)) % size;
  }

  return result;
}
```

### How it works
Walks each character of the stringified item, builds up `result = result * 31 + charCode`, and takes `% size` **on every iteration** (not just at the end) to keep the running total small.

```
getHash("ab", 5)

'a' (97): result = (0*31 + 97) % 5 = 97 % 5 = 2
'b' (98): result = (2*31 + 98) % 5 = 160 % 5 = 0

→ getHash("ab", 5) = 0
```

### Why mod inside the loop?
Without it, `result` for a long string would exceed `Number.MAX_SAFE_INTEGER` (2^53) before the loop even finishes, silently corrupting the hash due to floating-point precision loss. Taking `% size` each step keeps `result` bounded to `[0, size - 1]` at all times.

**Complexity:** O(L), where L = length of the stringified item.

---

## 2. Constructor — setting up the buckets

```javascript
constructor(tableSize) {
  this.#tableSize = tableSize;
  this.#bucket = Array.from({ length: tableSize });
}
```

`Array.from({ length: tableSize })` builds an array of `tableSize` slots, each `undefined` — the "nothing here" sentinel used consistently throughout this class (never an empty array `[]`).

### ⚠️ Edge case NOT handled: missing constructor argument

```javascript
new HashSet()   // called with no arguments at all
```

Notice the class field declares a default (`#tableSize = 10;`), **but the constructor parameter itself has no default value** (`constructor(tableSize)`, not `constructor(tableSize = 10)`). Field initializers run *before* the constructor body, so the sequence is:

```
1. Field initializer runs:      #tableSize = 10        (temporarily 10)
2. Constructor body runs:       this.#tableSize = tableSize   // tableSize is undefined
                                 → #tableSize is now OVERWRITTEN to undefined
3. this.#bucket = Array.from({ length: undefined })
                                 → length coerces to 0 → bucket = [] (an empty array)
```

So `new HashSet()` silently ends up with `#tableSize = undefined` and a zero-length `#bucket`, **not** the "10" that the field declaration seems to promise.

**Does it actually break at runtime?** Surprisingly, not immediately — because of two JS quirks working in its favor:
- `#getHash(item)` calls the standalone `getHash(str, this.#tableSize)` — passing `undefined` **explicitly** as `size`. Default parameters activate on an explicit `undefined` argument too, so `size` falls back to its own default, `5`. Hashing still works, just against `5` instead of the intended `10`.
- `this.#bucket` being a zero-length array doesn't stop `this.#bucket[hash] = [item]` from working — JS arrays are just objects under the hood; assigning to an out-of-range index (e.g. index `3` on a length-`0` array) auto-extends the array. It "just works," but the array's `.length` no longer means what you'd expect it to.

**Bottom line:** the class *functions* even when misused this way, but only by accident, riding on JS's permissiveness — not because the code intentionally guards against it. If you're revising this later: **the fix is `constructor(tableSize = 10)`**, matching the field default, so the field declaration isn't silently lying.

---

## 3. `add(item)` — insert (duplicates are no-ops)

```javascript
add(item) {
  const hash = this.#getHash(item);

  if (!this.#bucket[hash]) {
    this.#bucket[hash] = [item];
    this.#size++;
  } else {
    const entries = this.#bucket[hash];

    for (const el of entries) {
      if (el === item) return;
    }

    this.#bucket[hash].push(item);
    this.#size++;
  }
}
```

### How it works — two branches

**Branch A: bucket is empty** (`undefined`) → nothing has ever hashed here → start a new chain with just this item, `#size` increases.

**Branch B: bucket already has a chain** → scan for an item that's *already* strictly equal (`===`) to what's being added:
- **Already present** → `return` immediately, doing **nothing** — a set has no duplicates by definition, and `#size` correctly stays the same.
- **Not present** → this is a genuinely new item that happens to collide with something else → push it onto the chain, `#size` increases.

```
add("ab")   — bucket[0] undefined (Branch A)
  bucket[0] = ["ab"]        size: 0 → 1

add("ab")   — again! bucket[0] exists, "ab" found in chain (Branch B, match)
  scan finds "ab" === "ab" → return immediately, nothing changes
  size stays 1                                       ← duplicate correctly ignored

add("ba")   — suppose it ALSO hashes to 0 (a collision).
              bucket[0] exists, "ba" NOT found (Branch B, no match)
  scan: "ab" !== "ba" → no match in whole chain
  push "ba"                  size: 1 → 2

bucket[0] = ["ab", "ba"]    ← two distinct items sharing one bucket
```

### Edge cases handled

**a) Adding a duplicate item** — silently ignored via the `return` inside the scan loop; `#size` is not double-counted.

**b) Hash collision between genuinely different items** — resolved by chaining, exactly as in `HashMap`.

**c) Reference vs. value equality for objects** — because matching uses `===`, two *structurally identical but distinct* objects are **not** considered duplicates:
```javascript
const set = new HashSet(10);
set.add({ id: 1 });
set.add({ id: 1 });   // a DIFFERENT object literal, same shape

// Both get added! === compares object references, not contents.
// set.size() → 2, not 1.
```
This is a natural consequence of using `===`, not a special case in the code — but it's an easy trap to fall into if you expect "set" semantics to mean deep-equality dedup. If you need value-based deduplication for objects, you'd need to hash/compare based on a serialized form (e.g. `JSON.stringify`) instead of the raw object reference.

**Complexity:** O(k), k = chain length at that bucket.

---

## 4. `has(item)` — membership check

```javascript
has(item) {
  const hash = this.#getHash(item);
  const entries = this.#bucket[hash] || [];

  for (const el of entries) {
    if (el === item) return true;
  }

  return false;
}
```

### How it works
`this.#bucket[hash] || []` — if the slot is `undefined`, fall back to an empty array so the `for...of` loop simply runs zero times instead of throwing on `undefined`. Then scan the chain for a strict match.

```
has("ab") on bucket[0] = ["ab", "ba"]
  scan: "ab" === "ab" → true

has("zz") where getHash("zz") also happens to be 0
  scan: "ab" !== "zz", "ba" !== "zz" → false
  (bucket existed, but this specific item wasn't in it)

has("qq") where getHash("qq") is some untouched index, e.g. 3
  bucket[3] is undefined → entries = [] → loop runs 0 times → false
```

### Edge cases handled

**a) Bucket slot is `undefined`** — the `|| []` fallback avoids a crash on iterating `undefined`.

**b) Bucket has a chain, but this exact item isn't among the entries** (a *different* colliding item is there instead) — loop completes without a match, returns `false`.

**Complexity:** O(k).

---

## 5. `delete(item)` — remove an item

```javascript
delete(item) {
  const hash = this.#getHash(item);
  const entries = this.#bucket[hash] || [];

  for (let i = 0; i < entries.length; i++) {
    if (entries[i] === item) {
      this.#bucket[hash].splice(i, 1);
      if (this.#bucket[hash].length === 0) this.#bucket[hash] = undefined;
      this.#size--;
      return true;
    }
  }

  return false;
}
```

### How it works
1. `entries = this.#bucket[hash] || []` — same undefined-safety fallback as `has()`.
2. Scan for a strict match by index (needs the index this time, for `splice`).
3. On match: `splice(i, 1)` removes just that one item from the chain, leaving any other colliding items untouched.
4. **If that was the last item in the chain**, reset the slot back to `undefined` — restoring it to the same "empty" representation the constructor uses, rather than leaving a hollow `[]` behind.
5. Decrement `#size`, return `true`. If nothing matched, return `false` — no mutation.

```
Before: bucket[0] = ["ab", "ba"]     size = 2

delete("ab")
  match at i=0 → splice(0,1) → bucket[0] becomes ["ba"]
  length 1, not 0 → stays as an array
  size: 2 → 1
  return true


delete("ba")   (now the last item in that chain)
  match at i=0 → splice(0,1) → bucket[0] becomes []
  length IS 0 → reset bucket[0] = undefined
  size: 1 → 0
  return true

After: bucket[0] = undefined   size = 0   (back to pristine empty state)
```

### Edge cases handled

**a) Deleting from a never-populated bucket (`undefined`)** — `|| []` fallback, loop runs 0 times, `return false`.

**b) Deleting an item not present, but its bucket has OTHER items** (collision) — scan completes without a match, chain is left untouched, `return false`.

**c) Deleting the last remaining item in a chain** — bucket slot explicitly reset to `undefined`, keeping the "empty slot" representation consistent everywhere in the class (matches the constructor's initial state, and what `has`/`add`'s `!this.#bucket[hash]` checks expect).

**d) Deleting one item out of a multi-item chain** — `splice` removes only the matched index; the rest of the chain shifts down and stays valid, as shown in the first `delete("ab")` example above.

**Complexity:** O(k).

---

## 6. `size()` / `clear()`

```javascript
size() { return this.#size; }

clear() {
  this.#bucket = Array.from({ length: this.#tableSize });
  this.#size = 0;
}
```

`size()` is a method (not a getter property) — call it as `set.size()`, not `set.size`. `clear()` throws away the old bucket array and rebuilds a fresh all-`undefined` one at the *current* `#tableSize`, and resets the count. Because `#bucket` is private, no outside code can be left holding a stale reference to the old array.

**Complexity:** `size()` is O(1). `clear()` is O(tableSize).

---

## `HashSet` vs. `HashMap` — what's actually different?

| | `HashSet` | `HashMap` |
|---|---|---|
| Bucket entries store | raw `item` | `[key, value]` pair |
| Match check | `el === item` | `item[0] === key` |
| `add`/`set` on existing match | no-op (`return`) | **updates** the value in place |
| Purpose | membership only | key → value lookup |

Structurally, everything else — the hash function, the `undefined`-as-empty-slot convention, the collision-chaining strategy, the `splice`-then-reset-to-`undefined` cleanup on delete — is identical. If you understand one, you understand the other; a set is really just "a map that doesn't bother storing values."

---

## Summary table

| Method | Time Complexity | Handles empty bucket? | Mutates `#size`? |
|---|---|---|---|
| `getHash` | O(L) | n/a | n/a |
| `add` | O(k) avg | ✅ creates new chain | ✅ only if new item |
| `has` | O(k) avg | ✅ → `false` | ❌ |
| `delete` | O(k) avg | ✅ → `false` (no-op) | ✅ only on real delete |
| `size` | O(1) | n/a | ❌ (reads only) |
| `clear` | O(tableSize) | resets all | ✅ → `0` |

*(L = item length once stringified, k = number of items chained at that particular bucket)*

## Core invariants to remember when debugging this hash set

> **1. An empty bucket slot is always `undefined`, never `[]`.** Established by the constructor, restored by `delete()` whenever a chain empties out.

> **2. Membership is checked with `===` — reference/value equality, not deep equality.** Primitives (strings, numbers) behave intuitively; distinct objects with identical contents are treated as different items.

> **3. The constructor has no default `tableSize`, unlike the class field's declared default of `10`.** Calling `new HashSet()` with no argument silently produces `#tableSize = undefined` (functions anyway, via `getHash`'s own default of `5`, but not the `10` the field suggests). Always pass a `tableSize` explicitly.
