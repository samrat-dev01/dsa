# HashMap (Separate Chaining) — Implementation Notes

A hash map built from a fixed-size array of **buckets**, where each bucket is an array of `[key, value]` pairs. Collisions (different keys landing on the same bucket index) are resolved by **chaining** — just keep a small list at that index instead of overwriting.

```javascript
export function getHash(key, size = 5) { ... }

export class HashMap {
  #bucket = [];      // array of "slots" — each slot is undefined OR an array of [key,value] pairs
  #mapSize = 5;       // total number of slots (fixed, does not grow)
  #size = 0;           // number of key-value pairs actually stored
}
```

```
Conceptual layout (mapSize = 5):

  index:    0        1        2        3        4
          ┌────┐   ┌────┐   ┌────┐   ┌────┐   ┌────┐
bucket = │undef│  │undef│  │undef│  │undef│  │undef│   ← all empty at start
          └────┘   └────┘   └────┘   └────┘   └────┘

After a few set() calls, a slot becomes an ARRAY of pairs (a "chain"):

  index:    0                1        2        3        4
          ┌──────────────┐ ┌────┐   ┌────┐   ┌────┐   ┌────┐
bucket = │[["ab",1]]      │undef│  │undef│  │undef│  │undef│
          └──────────────┘ └────┘   └────┘   └────┘   └────┘
```

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
This is a classic **polynomial rolling hash**: it walks each character, multiplies the running total by a prime (`31`), adds the character's code point, and — crucially — takes `% size` **after every single character**, not just once at the end.

```
getHash("ab", 5)

start: result = 0

char 'a' (code 97):
  result = (0 * 31 + 97) % 5
          = 97 % 5
          = 2

char 'b' (code 98):
  result = (2 * 31 + 98) % 5
          = (62 + 98) % 5
          = 160 % 5
          = 0

→ getHash("ab", 5) = 0
```

### Why mod inside the loop instead of at the end?
If you accumulated the *full* polynomial value first (e.g. for a 50-character string, `result` could balloon past `31^50`) and only took `% size` at the very end, the number would exceed **`Number.MAX_SAFE_INTEGER` (2^53)** long before the loop finished. JavaScript numbers silently lose precision past that point, which would make the hash function produce **wrong, non-deterministic-looking results** for longer strings. Taking `% size` on every iteration keeps `result` bounded between `0` and `size - 1` at all times — it never has a chance to overflow.

### Edge cases handled

**a) Non-string keys** — `String(key)` coerces *anything* (numbers, booleans, etc.) into a string before hashing, so `getHash(5, 5)` and `getHash("5", 5)` compute the **same** hash (both stringify to `"5"`). This is intentional for the hash step, but see the `HashMap` section below for why this does **not** mean `5` and `"5"` are treated as the *same key* overall.

**b) Iterating with `for...of` instead of index-based `for`** — `for (const ch of str)` iterates by **Unicode code point**, correctly handling astral characters (like emoji, which occupy two UTF-16 code units) as a single "character" step. An index-based `str[i]` loop would instead split such characters into two broken halves. This is a subtle but correct choice.

**Complexity:** O(L) where L = string length of the (stringified) key.

---

## 2. Constructor — setting up the buckets

```javascript
constructor(mapSize = 5) {
  this.#mapSize = mapSize;
  this.#bucket = Array.from({ length: mapSize });
}
```

`Array.from({ length: mapSize })` creates an array of `mapSize` slots, each holding `undefined` — this is the "all buckets empty" starting state. `undefined` (not an empty array `[]`) is the chosen "nothing here" sentinel throughout this implementation — keep that in mind, it matters later in `delete()`.

```
new HashMap(5)  →  bucket = [undefined, undefined, undefined, undefined, undefined]
                             0          1          2          3          4
```

**Note on fixed size:** `#mapSize` never changes after construction — this HashMap does **not** automatically resize/rehash as more entries are added. As `#size` grows while `#mapSize` stays fixed, more keys are forced to collide into the same buckets, and chains get longer — degrading lookup from close to O(1) toward O(n) in the worst case. This is a known limitation of this implementation, not a bug — production hash maps typically resize (e.g. double the bucket count) once the load factor (`size / mapSize`) crosses some threshold.

---

## 3. `set(key, value)` — insert or update

```javascript
set(key, value) {
  const hash = this.#getHash(key);

  if (!this.#bucket[hash]) {
    this.#bucket[hash] = [[key, value]];
    this.#size++;
  } else {
    const entries = this.#bucket[hash];
    let found = false;

    for (let i = 0; i < entries.length; i++) {
      const item = entries[i];
      if (item[0] === key) {
        this.#bucket[hash][i] = [key, value];
        found = true;
        break;
      }
    }

    if (!found) {
      this.#bucket[hash].push([key, value]);
      this.#size++;
    }
  }
}
```

### How it works — two branches

**Branch A: bucket is currently empty** (`undefined`) → this is the very first key ever hashed to this slot. Create a brand-new chain containing just this one pair, and count it toward `#size`.

**Branch B: bucket already has a chain** → scan every existing pair in the chain looking for a matching key (`item[0] === key`, **strict equality**):
- **Found a match** → this is an *update*: overwrite that specific pair in place, `#size` does **NOT** increase (no new key was added, just its value changed).
- **No match after scanning the whole chain** → this is a genuinely *new* key that happens to collide with existing ones → append `[key, value]` to the chain, and `#size` **does** increase.

```
set("ab", 1)  — bucket[0] is undefined (Branch A)

bucket[0] = [["ab", 1]]     size: 0 → 1


set("ab", 99) — bucket[0] already exists, "ab" found in chain (Branch B, match)

  scan: item[0]="ab" === key "ab" → MATCH at i=0
  bucket[0][0] = ["ab", 99]   ← value overwritten in place
  size unchanged (still 1)

bucket[0] = [["ab", 99]]


set("ba", 2)  — suppose "ba" ALSO hashes to 0 (a collision).
                bucket[0] exists, but "ba" is NOT found in chain (Branch B, no match)

  scan: item[0]="ab" !== key "ba" → no match found in whole chain
  push ["ba", 2] onto the chain
  size: 1 → 2

bucket[0] = [["ab", 99], ["ba", 2]]     ← two DIFFERENT keys, same bucket
             └── chain of length 2 ──┘
```

### Edge cases handled

**a) Hash collision between genuinely different keys** — resolved by chaining (shown above: `"ab"` and `"ba"` coexist peacefully in the same bucket array).

**b) Updating an existing key's value** — detected via the linear `item[0] === key` scan; `#size` is correctly *not* incremented, since no new key was added.

**c) Type coincidence via `String(key)` inside `getHash`, but distinctness preserved by `===`** — this is the sneakiest edge case in the whole file:
```
set(5, "number-five")     // getHash stringifies 5 → "5" → some hash H
set("5", "string-five")   // getHash stringifies "5" → "5" → SAME hash H

Both land in the SAME bucket (hash collision, by design of String(key)).

But inside set()'s scan: item[0] === key uses the ORIGINAL, un-stringified key.
  5 === "5"   →  false  (strict equality: different types)

So the second set() does NOT find a match → treated as a NEW key → pushed
as a separate chain entry. Both 5 and "5" are stored as distinct keys:

bucket[H] = [[5, "number-five"], ["5", "string-five"]]
```
In short: **the hash function may treat `5` and `"5"` as colliding (same bucket)**, but **the map itself still correctly treats them as different keys** (different chain entries), because key comparison uses strict `===` on the original values, not the stringified ones used only for hashing.

**Complexity:** O(k) where k = length of the chain at that bucket (O(1) average with a well-distributed hash and low load factor; degrades toward O(n) if many keys collide).

---

## 4. `has(key)` / `get(key)` — lookups

```javascript
has(key) {
  const hash = this.#getHash(key);
  if (!this.#bucket[hash]) return false;
  const entries = this.#bucket[hash];
  for (let item of entries) {
    if (item[0] === key) return true;
  }
  return false;
}
```
`get(key)` is structurally identical, but returns `item[1]` (the value) instead of `true`, and `undefined` instead of `false`.

### How it works
1. Compute the bucket index.
2. **If the bucket slot is `undefined`** (nothing was ever stored there), short-circuit immediately — no chain to search.
3. **Otherwise**, linearly scan the chain for a pair whose key strictly equals the requested key.

```
has("ab") on bucket[0] = [["ab", 99], ["ba", 2]]

  hash("ab") = 0
  bucket[0] exists → scan chain
  item[0]="ab" === "ab" → MATCH → return true


has("zz") where getHash("zz") happens to also be 0

  bucket[0] exists → scan chain
  "ab" !== "zz", "ba" !== "zz" → no match found
  → return false   (bucket existed, but the specific key wasn't in it)
```

### Edge cases handled

**a) Bucket slot is `undefined`** (nothing ever hashed there) → `!this.#bucket[hash]` catches this immediately, avoiding a crash from trying to iterate `undefined`.

**b) Bucket slot exists, but this specific key isn't among the chained entries** (a *different* key collided into this same bucket) → the loop runs to completion without matching, falls through to the "not found" return.

**c) Requesting a key that was `delete()`-d** → covered in the `delete()` section below; after deletion, either the specific pair is missing from the chain, or the whole bucket becomes `undefined` again.

**Complexity:** O(k), same reasoning as `set()`.

---

## 5. `delete(key)` — remove a key

```javascript
delete(key) {
  const hash = this.#getHash(key);
  const entries = this.#bucket[hash] || [];

  for (let i = 0; i < entries.length; i++) {
    const item = entries[i];
    if (item[0] === key) {
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
1. Compute the hash. `const entries = this.#bucket[hash] || []` — if the bucket is `undefined`, fall back to an empty array so the loop below doesn't crash; it will simply run zero times.
2. Scan for the matching key. On a match: `splice(i, 1)` removes just that one pair from the chain (leaving any other colliding keys in that bucket untouched).
3. **If removing that pair emptied the entire chain**, reset the slot back to `undefined` — restoring the bucket to its original "nothing here" state, consistent with how the constructor initializes empty slots.
4. Decrement `#size` and return `true`.
5. If the loop finishes without a match (wrong key, or bucket was empty to begin with), return `false` — nothing mutated.

```
Before: bucket[0] = [["ab", 99], ["ba", 2]]   size = 2

delete("ab")
  scan: item[0]="ab" === "ab" → match at i=0
  splice(0, 1) → bucket[0] becomes [["ba", 2]]
  length is 1, not 0 → slot stays as an array (still has "ba")
  size: 2 → 1
  return true

After: bucket[0] = [["ba", 2]]     size = 1


delete("ba")   (now the last item in that chain)
  scan: item[0]="ba" === "ba" → match at i=0
  splice(0, 1) → bucket[0] becomes []  (empty array)
  length IS 0 → reset bucket[0] = undefined
  size: 1 → 0
  return true

After: bucket[0] = undefined     size = 0   (back to pristine empty state)
```

### Edge cases handled

**a) Deleting from a bucket that was never populated (`undefined`)** — `this.#bucket[hash] || []` prevents calling `.length`/iterating on `undefined`; the loop simply runs 0 times and falls through to `return false`.

**b) Deleting a key that doesn't exist, but its bucket has OTHER keys in it** (collision case) — the scan runs through the whole chain, finds no match, returns `false`; the chain is left completely untouched.

**c) Deleting the *only* remaining pair in a chain** — explicitly resets the slot to `undefined` rather than leaving a "hollowed-out" empty array `[]` behind. This matters for consistency: the rest of the codebase's `!this.#bucket[hash]` checks are written expecting `undefined` to mean "empty," matching how the constructor initializes slots. (Leaving an empty array wouldn't actually break `has`/`get`/`set` — an empty array still makes their loops run zero times — but it would leave the internal state inconsistent with its own initial invariant, which is worth avoiding for anyone reasoning about or debugging the bucket array later.)

**d) Deleting one key out of a multi-key chain, leaving others intact** — shown in the first `delete("ab")` example above: `splice` removes only the targeted index, the rest of the chain shifts down and remains valid.

**Complexity:** O(k).

---

## 6. `clear()` — reset everything

```javascript
clear() {
  this.#bucket = Array.from({ length: this.#mapSize });
  this.#size = 0;
}
```
Simply throws away the old bucket array and builds a fresh one of `undefined` slots (same as the constructor), and resets `#size` to `0`. Because `#bucket` is a **private field**, there's no risk of any external code still holding a reference to the old array and being surprised — the old array is just garbage collected once nothing points to it anymore.

**Complexity:** O(mapSize) — has to allocate `mapSize` fresh slots, regardless of how many entries were actually stored.

---

## Summary table

| Method | Time Complexity | Handles empty bucket? | Mutates `#size`? |
|---|---|---|---|
| `getHash` | O(L) | n/a | n/a |
| `set` | O(k) avg | ✅ creates new chain | ✅ only on new key |
| `get` | O(k) avg | ✅ → `undefined` | ❌ |
| `has` | O(k) avg | ✅ → `false` | ❌ |
| `delete` | O(k) avg | ✅ → `false` (no-op) | ✅ only on real delete |
| `clear` | O(mapSize) | resets all | ✅ → `0` |

*(L = key length once stringified, k = number of entries chained at that particular bucket)*

## Core invariants to remember when debugging this hash map

> **1. An empty bucket slot is always `undefined`, never `[]`.** The constructor establishes this, and `delete()` explicitly restores it when a chain becomes empty — keeping every `!this.#bucket[hash]` check meaningful throughout the file.

> **2. Hashing can collide across types (`5` and `"5"` hash identically, since both get `String()`-coerced first), but key equality inside a chain always uses strict `===` on the original, un-stringified key.** Two keys can share a bucket without being the same key.

> **3. This map never resizes.** `#mapSize` is fixed at construction — as `#size` grows, average chain length grows with it, and lookups slowly drift away from O(1).