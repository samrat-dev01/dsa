export function maxSubarrayLength(arr = [], k) {
    let left = 0;
    let sum = 0;
    let maxLength = 0;

    for (let right = 0; right < arr.length; right++) {
        sum += arr[right];

        while (sum > k) {
            sum -= arr[left];
            left++
        }

        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength
}