export function subarraySum(arr = [], k) {
    const prefixMap = new Map()
    prefixMap.set(0, 1)

    let currentSum = 0, count = 0;

    for (const num of arr) {
        currentSum += num

        // We need an earlier prefix such that:
        //
        // currentSum - earlierPrefix = k
        //
        // Therefore:
        // earlierPrefix = currentSum - k

        const requiredPrefix = currentSum - k;

        if (prefixMap.has(requiredPrefix)) {
            count += prefixMap.get(requiredPrefix)
        }

        prefixMap.set(currentSum, (prefixMap.get(currentSum) || 0) + 1)
    }

    return count
}