export function twoSumSorted(arr = [], target) {
    let l = 0, r = arr.length - 1;

    while (r > l) {
        const sum = arr[l] + arr[r]
        if (sum === target) {
            return true
        }

        if (sum > target) r--;
        else l++;
    }

    return false
}