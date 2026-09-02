export const upperBound = (arr, target) => {
    let left = 0;
    let right = arr.length - 1;
    let answer = arr.length;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2)

        if (arr[mid] > target) {
            answer = mid;
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    return answer
}