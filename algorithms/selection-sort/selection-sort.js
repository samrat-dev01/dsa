export const selectionSort = (arr = []) => {
    for (let i = 0; i < arr.length; i++) {

        let minIdx = i; // last seen index for minimum value compared to arr[i]
        
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j
            }
        }

        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
    }

    return arr
}