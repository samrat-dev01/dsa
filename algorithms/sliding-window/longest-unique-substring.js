export function longestUniqueSubstring(str = '') {
    const chars = [...str];

    let l = 0;
    let maxLength = 0;
    const window = new Set()

    for (let r = 0; r < chars.length; r++) {
        // duplicate character exists
        // remove characters from Set
        // shrink from left
        while (window.has(chars[r])) {
            window.delete(chars[l])
            l++
        }

        window.add(chars[r]);

        maxLength = Math.max(maxLength, r - l + 1)
    }

    return maxLength
}