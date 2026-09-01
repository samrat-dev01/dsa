export function longestAtMostKDistinct(str = '', k) {
    const chars = [...str];

    let l = 0;
    let maxLength = 0;
    const window = new Map();

    for (let r = 0; r < chars.length; r++) {
        const char = chars[r];

        if (!window.has(char)) window.set(char, 1)
        else window.set(char, window.get(char) + 1)

        while (window.size > k) {
            const leftChar = chars[l];

            window.set(leftChar, window.get(leftChar) - 1);

            if (window.get(leftChar) === 0) {
                window.delete(leftChar);
            }

            l++;
        }

        maxLength = Math.max(maxLength, r - l + 1)
    }

    return maxLength
}