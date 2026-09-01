export function minSubArrayLen(arr = [], k) {
    let left = 0;
    let sum = 0;
    let minLength = Infinity;

    for (let right = 0; right < arr.length; right++) {
        sum += arr[right];

        while (sum >= k) {
            minLength = Math.min(minLength, right - left + 1);

            sum -= arr[left];
            left++;
        }
    }

    return minLength === Infinity ? 0 : minLength;
}
