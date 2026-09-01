export function minWindow(str = '', target) {
    if (str === '' || !target) return ''

    const need = new Map(), window = new Map();

    for (const ch of [...target]) {
        const freq = need.get(ch) || 0
        need.set(ch, freq + 1)
    }

    let left = 0, formed = 0, required = need.size;
    let minLength = Infinity, minStart = 0;

    const chars = [...str]
    for (let right = 0; right < chars.length; right++) {
        const char = chars[right];

        window.set(char, (window.get(char) || 0) + 1)

        if (need.has(char) && window.get(char) === need.get(char)) {
            formed++
        }

        while (formed === required) {
            const currentLength = right - left + 1

            if (currentLength < minLength) {
                minLength = currentLength;
                minStart = left
            }

            const leftChar = chars[left];

            window.set(leftChar, (window.get(leftChar) || 0) - 1);

            if (need.has(leftChar) && window.get(leftChar) < need.get(leftChar)) {
                formed--
            }

            left++
        }
    }

    if (minLength === Infinity) return ''

    return chars.slice(minStart, minStart + minLength).join("");
}