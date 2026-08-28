/**
 * 
 * @param {any[]} arr 
 * @returns {any[]}
 */
export const bubbleSort = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        // Track whether any swap occurred during each pass.
        // If no swap occurred, the array is already sorted, so terminate early.
        // This changes the best-case complexity from O(n²) to O(n), while average and worst cases remain O(n²).
        let swapped = false;

        for (let j = 0; j < arr.length - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true
            }
        }

        // No swaps means the array is already sorted
        if (!swapped) break;
    }

    return arr
}