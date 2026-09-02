export function firstOccurence(arr = [], target) {
    let left = 0, right = arr.length - 1, candidate = -1;

    while (left <= right) {
        const mid = Math.floor((right + left) / 2);

        if (arr[mid] === target) {
            candidate = mid;
            right = mid - 1 // search left
        }
        else if (arr[mid] < target) {
            left = mid + 1
        }
        else {
            right = mid - 1
        }
    }

    return candidate
}