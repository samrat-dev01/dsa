
export function rangeSum(arr = [], left, right) {

    // We create one extra space because prefix[0]
    // represents the sum before the array starts.
    const prefix = Array.from({
        length: arr.length + 1
    });

    prefix[0] = 0;

    // Build the running sum.
    //
    // Instead of starting the sum again for every query,
    // we remember the sum calculated so far.
    //
    // Example:
    // i = 0 → prefix[1] = 0 + 2 = 2
    // i = 1 → prefix[2] = 2 + 4 = 6
    // i = 2 → prefix[3] = 6 + 1 = 7
    for (let i = 0; i < arr.length; i++) {
        prefix[i + 1] = prefix[i] + arr[i];
    }

    // prefix[right + 1] gives us the sum from the
    // beginning up to `right`.
    //
    // prefix[left] removes everything before `left`.
    //
    // What remains is exactly the range we need.
    return prefix[right + 1] - prefix[left];
}