export function quickSort(arr = [], low = 0, high = arr.length - 1) {
    if (low >= high) return arr;

    const pivotIndex = partition(arr, low, high);

    quickSort(arr, low, pivotIndex);
    quickSort(arr, pivotIndex + 1, high);

    return arr;
}

function partition(arr, low, high) {
    const middle = Math.floor((low + high) / 2);
    const pivot = arr[middle];

    let left = low;
    let right = high;

    while (left <= right) {

        while (arr[left] < pivot) {
            left++;
        }

        while (arr[right] > pivot) {
            right--;
        }

        if (left <= right) {
            [arr[left], arr[right]] = [arr[right], arr[left]];

            left++;
            right--;
        }
    }

    return left - 1;
}