export function findMax(arr = [], l = 0, r = arr.length - 1) {
    if (arr.length === 0) return undefined;
    if (l === r) return arr[l]

    const middle = Math.floor((l + r) / 2);

    const leftMax = findMax(arr, l, middle);
    const rightMax = findMax(arr, middle + 1, r);

    return leftMax > rightMax ? leftMax : rightMax;
}