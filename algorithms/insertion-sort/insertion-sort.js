export function insertionSort(arr = []) {
    for (let i = 1; i < arr.length; i++) {
        const curr = arr[i];
        let j = i - 1;

        while (j >= 0 && arr[j] > curr) {
            arr[j + 1] = arr[j]
            j -= 1
        }

        arr[j + 1] = curr
    }

    return arr
}