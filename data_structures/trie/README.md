# Trie (Prefix Tree) — Implementation Notes

A Trie built with `Map`-based children (instead of a fixed 26-letter array), supporting `insert`, `search`, `startsWith`, and `delete` (with memory-cleaning pruning on delete).

```javascript
export class TrieNode {
  children = new Map(); // char -> TrieNode
  isEnd = false;         // true if a word ENDS at this node
}

export class Trie {
  root = new TrieNode(); // root represents "" (empty prefix)
}
```

**Core idea:** each node represents *one character*, and a path from `root` down to a node spells out a string. `isEnd` marks "a real inserted word stops here" — this is what distinguishes a *complete word* from a *mere prefix* that happens to lie along the path of a longer word.

```
Trie after inserting: "cat", "car", "care", "dog"

                    root
                   /    \
                 c        d
                /          \
              a              o
             / \              \
           t*    r*             g*
                / \
             (end)  e*

Legend: * = isEnd = true (a complete word ends here)

Full paths:
root → c → a → t*        = "cat"
root → c → a → r*        = "car"
root → c → a → r → e*    = "care"
root → d → o → g*        = "dog"
```

Notice `r` is marked `isEnd = true` (because "car" is a word) **and** still has a child `e` (because "care" continues past it). A single node can be both a word-ending *and* a mid-path node for another, longer word — this dual role is the source of most of the tricky logic in `delete()`.

---

## 1. `insert(str)` — add a word

```javascript
insert(str) {
  let current = this.root;

  if (str === "") {
    current.isEnd = true;
    return;
  }

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];

    if (current.children.has(ch)) {
      current = current.children.get(ch);
    } else {
      const node = new TrieNode();
      current.children.set(ch, node);
      current = node;
    }

    if (i === str.length - 1) {
      current.isEnd = true;
    }
  }
}
```

### How it works
Walk character by character from `root`. For each character:
- **If a child already exists** for that character, just move into it (reuse the shared path — this is what makes a Trie memory-efficient for words with common prefixes).
- **If it doesn't exist**, create a new `TrieNode` and attach it.
- On the **last character**, mark `isEnd = true` — this is the only line that actually says "a word stops here," as opposed to "this is just a letter along some path."

```
insert("cat") into empty trie:

step i=0 'c': root has no 'c' child → create it
    root ──c──▶ [c]

step i=1 'a': [c] has no 'a' child → create it
    root ──c──▶ [c] ──a──▶ [a]

step i=2 't': [a] has no 't' child → create it
              i === length-1 → mark isEnd = true
    root ──c──▶ [c] ──a──▶ [a] ──t──▶ [t]*
```

```
insert("car") into the trie above (reuses "c" and "a"!):

step i=0 'c': [c] already exists → reuse, move in
step i=1 'a': [a] already exists → reuse, move in
step i=2 'r': [a] has no 'r' child → create it
              mark isEnd = true

    root ──c──▶ [c] ──a──▶ [a] ──t──▶ [t]*
                              └──r──▶ [r]*
```

### Edge cases handled

**a) Inserting the empty string `""`**
```javascript
insert("")
```
The `for` loop condition `i < str.length` is `0 < 0`, which is `false` — the loop body would never execute anyway. But rather than silently doing nothing, the code explicitly checks `str === ""` **first** and marks `root.isEnd = true`. This makes `""` a legitimately searchable/deletable "word" — the empty string is considered inserted, and `search("")` will correctly return `true`.

**b) Inserting a word that's a duplicate**
Every character finds an existing child (`children.has(ch)` is true each time), so no new nodes are created — `current` just walks the existing path and re-marks `isEnd = true` at the end (a harmless no-op, since it was already `true`).

**c) Inserting a word that's a prefix of an already-inserted word** (e.g. insert "car" after "care" already exists)
The path is fully reused; only the intermediate node's `isEnd` flips from `false` to `true`. No structural change — this is exactly what makes "car" **also** a valid stored word alongside "care" using the same nodes.

**Complexity:** O(L) where L = length of the string being inserted — independent of how many words are already stored.

---

## 2. `search(str)` — is this an exact stored word?

```javascript
search(str) {
  let current = this.root;

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    current = current.children.get(ch);
    if (!current) return false;
  }

  return current.isEnd;
}
```

### How it works
Walk the path character by character. If at any point the next character doesn't exist as a child, the word was never inserted → `false` immediately. If the full path exists, the word is only a genuine match if `isEnd` is `true` on the final node — **existing as a path is not enough**, it must have been an actual inserted word, not just a prefix of a longer one.

```
Trie contains "care" (but NOT "car" as its own word):

    root ──c──▶ [c] ──a──▶ [a] ──r──▶ [r] ──e──▶ [e]*
                                        (isEnd=false)

search("car")
  path exists fully (c → a → r) ✓
  BUT current.isEnd is false at [r]  →  returns false ✗

search("care")
  path exists fully, current.isEnd is true at [e]  →  returns true ✓

search("ca")
  path exists fully, current.isEnd is false at [a]  →  returns false ✗

search("cars")
  c → a → r found, then .get('s') on [r]'s children → undefined
  current becomes undefined → `if (!current) return false` fires early
```

### Edge cases handled

**a) Searching for a prefix that was never explicitly inserted as a word**
Handled by checking `current.isEnd`, not just path existence — shown above with `"car"` vs `"care"`.

**b) Searching for a string whose path doesn't exist at all**
`current.children.get(ch)` returns `undefined` for a missing character; `current` becomes `undefined`, and `if (!current) return false` catches it before the next iteration tries to call `.children` on `undefined` (which would otherwise throw).

**c) Searching for the empty string `""`**
The loop never runs (`0 < 0` is false), so `current` stays as `this.root`, and the function returns `root.isEnd` directly — correctly reflecting whether `insert("")` was ever called.

**Complexity:** O(L) — proportional only to the length of the searched string.

---

## 3. `startsWith(str)` — does any word begin with this prefix?

```javascript
startsWith(str) {
  let current = this.root;

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    current = current.children.get(ch);
    if (!current) return false;
  }

  return true;
}
```

### How it works
Nearly identical to `search()`, but with one crucial difference: it **doesn't check `isEnd`**. As long as the path exists, the prefix is valid — it doesn't matter whether a complete word stops there or the path merely continues on to something longer.

```
Trie contains only "care":

startsWith("car")  → path c→a→r exists → true  (even though "car" alone was never inserted)
startsWith("care") → path exists → true
startsWith("cares")→ 'e' has no 's' child → false
```

### Edge cases handled

**a) Prefix that matches a partial path only (not a full word)** — this is the whole *point* of the method, shown above: `startsWith("car")` is `true` even when `search("car")` would be `false`.

**b) Empty string prefix `""`**
The loop never runs, so it falls straight through to `return true`. This is semantically correct — every stored word "starts with" the empty string.

**Complexity:** O(L).

---

## 4. `delete(str)` — remove a word, and prune now-unused nodes

```javascript
delete(str) {
  let current = this.root;
  const path = [];

  if (str === "") {
    if (!current.isEnd) return false;
    current.isEnd = false;
    return true;
  }

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    current = current.children.get(ch);
    if (!current) return false;
    path.push({ node: current, char: ch });
  }

  if (!current.isEnd) return false;

  current.isEnd = false;

  for (let i = path.length - 1; i >= 0; i--) {
    const { node, char } = path[i];

    if (node.isEnd) break;
    if (node.children.size > 0) break;

    const parent = i === 0 ? this.root : path[i - 1].node;
    parent.children.delete(char);
  }

  return true;
}
```

This is the most involved method because deleting a word isn't just "unmark the end" — it should also **remove nodes that exist only to spell out this word**, so the Trie doesn't accumulate dead branches. But it must be careful not to remove nodes that other words still depend on.

### How it works — two phases

**Phase 1: locate and unmark.** Walk the string same as `search()`, but this time record every `{node, char}` visited into `path` (so we can walk *backwards* afterward). If the path doesn't fully exist, or the final node isn't actually a word-end, there's nothing valid to delete → `false`.

**Phase 2: prune backwards.** Starting from the *last* character and moving toward the root, try to delete each node from its parent's `children` map — but **stop the moment** you hit a node that's either:
- still the end of *another* word (`node.isEnd === true`), or
- still has children (meaning some *longer* word still passes through it).

Either condition means "this node is still needed — don't delete it, and don't even check further up, because everything above it is definitely still needed too" (if a node is needed, its parent, which leads to it, is needed even more).

### Edge cases handled

**a) Deleting the empty string `""`**
```javascript
delete("")
```
Special-cased at the top, mirroring `insert("")`'s special case: just flips `root.isEnd` off (if it was ever on), no traversal needed.

**b) Deleting a word that was never inserted (missing path)**
```
Trie has "cat" only.
delete("car")
  c found, a found, .get('r') on [a] → undefined → return false immediately
```
`path` is abandoned mid-way; nothing is mutated.

**c) Deleting a string that's only a prefix, not an actual stored word**
```
Trie has "care" only (not "car").
delete("car")
  path c→a→r exists fully...
  but current.isEnd (on node 'r') is false → return false
```
This correctly refuses to delete something that was never a real word — matches `search()`'s semantics.

**d) Deleting a word with a totally unique path (no sharing with other words)** — full cleanup happens
```
Trie has ONLY "cat":
    root ──c──▶[c]──a──▶[a]──t──▶[t]*

delete("cat")

Phase 1: path = [{c,'c'}, {a,'a'}, {t,'t'}], current='t' node, isEnd was true
         set [t].isEnd = false

Phase 2 (walk backwards):
  i=2, node=[t], char='t':
     [t].isEnd? false ✓ (just cleared)   [t].children.size? 0 ✓
     → delete 't' from parent ([a].children)   [a] loses its 't' child

  i=1, node=[a], char='a':
     [a].isEnd? false ✓   [a].children.size? 0 ✓ (just emptied above)
     → delete 'a' from parent ([c].children)

  i=0, node=[c], char='c':
     [c].isEnd? false ✓   [c].children.size? 0 ✓
     → delete 'c' from parent (root.children)

Result: root.children is empty again — the whole branch is gone,
        no memory wasted on a word that no longer exists.
```

**e) Deleting a word that is a *prefix* of another, longer stored word** — pruning stops immediately, nothing removed
```
Trie has "car" AND "carpet":
    root ──c──▶[c]──a──▶[a]──r──▶[r]*──p──▶[p]──e──▶[e]──t──▶[t]*

delete("car")

Phase 1: current = [r] node. [r].isEnd was true → set to false.

Phase 2 (walk backwards from [r]):
  i=2, node=[r], char='r':
     [r].isEnd? false (just cleared) — passes that check
     [r].children.size? 1 (still has 'p' child, for "carpet") → NOT zero
     → break immediately. Nothing is deleted.

Result: "car" is no longer a valid word (search("car") → false),
        but every node is still intact because "carpet" needs them.
        startsWith("car") is still true, correctly.
```
This is the key safety check: even though the word "car" itself is gone, the *characters* c-a-r are still structurally required by "carpet", so the nodes must survive.

**f) Deleting a word where only the *tail end* is prunable, but an ancestor is shared** — partial pruning
```
Trie has "car" AND "cars":
    root ──c──▶[c]──a──▶[a]──r──▶[r]*──s──▶[s]*

delete("cars")

Phase 1: current = [s] node, isEnd was true → set to false.

Phase 2 (walk backwards from [s]):
  i=3, node=[s], char='s':
     [s].isEnd? false (cleared)   [s].children.size? 0
     → delete 's' from parent [r].children

  i=2, node=[r], char='r':
     [r].isEnd? TRUE ("car" is still a word!) → break immediately

Result: only the 's' node is pruned. "car" remains fully intact,
        because [r] is still a legitimate word-ending on its own.
```
This demonstrates why the loop checks `node.isEnd` **fresh at each ancestor**, not just at the originally-deleted node — an ancestor can independently be "in use" as its own complete word.

**g) `parent` lookup for the very first character**
```javascript
const parent = i === 0 ? this.root : path[i - 1].node;
```
`path` only contains nodes *below* the root (it never includes `root` itself), so when pruning reaches the first character (`i === 0`), there's no `path[-1]` to look up — the parent must be `this.root` directly. This ternary exists purely to bridge that off-by-one gap.

**Complexity:** O(L) — the traversal is O(L), and the backward pruning walks at most the same L nodes once, so it doesn't add an extra order of magnitude.

---

## Why `Map` instead of a fixed-size array (e.g. `new Array(26)`)?

| | `Map` (this implementation) | Fixed array `[26]` |
|---|---|---|
| Alphabet | Any characters (unicode, symbols, mixed case) | Usually just `a`–`z` |
| Memory per node | Only allocates entries for children that exist | Allocates 26 slots even if only 1 is used |
| Lookup | O(1) average (hash-based) | O(1) (direct index) |

The tradeoff is a small constant-factor overhead per `Map` vs. raw array indexing, but the flexibility (any character set, no wasted slots) is usually worth it outside of narrow "lowercase English letters only" problems.

---

## Summary table

| Method | Time Complexity | Checks `isEnd`? | Mutates structure? |
|---|---|---|---|
| `insert` | O(L) | Sets it | ✅ creates nodes as needed |
| `search` | O(L) | ✅ reads it | ❌ |
| `startsWith` | O(L) | ❌ (path only) | ❌ |
| `delete` | O(L) | ✅ reads + clears it | ✅ prunes dead nodes only |

*(L = length of the string argument)*

## Core invariant to remember when debugging this trie

> **A node can be "in use" for two independent reasons: it's a word's ending (`isEnd`), or it's a stepping stone to a longer word (`children.size > 0`). Pruning during `delete` must check *both*, at *every* ancestor on the way back to the root — not just at the node where the deleted word ends.**

This single invariant is why the backward loop in `delete()` re-checks `node.isEnd` and `node.children.size` fresh at every step, rather than assuming "if the last node was safe to delete, everything above it is too."