// function countDown(n) {
//     if (n === 0) return n;
//     console.log(n)
//     return countDown(n - 1)
// }

// countDown(5)

// function sumToN(n) {
//     if (n === 0) return 0;
//     return n + sumToN(n - 1)
// }

// console.log(sumToN(5))

// function sumArray(arr = []) {
//     if (arr.length === 0) return 0;

//     const [firstItem, ...rest] = arr;
//     return firstItem + sumArray(rest);
// }

// function sumArray(arr = [], index = 0) {
//     if (index === arr.length) return 0;
//     return arr[index] + sumArray(arr, index + 1)
// }

// console.log(sumArray([2, 4, 6, 8]))


// function findMax(arr = []) {
//     let i = 0
//     let maxItem = arr[0];

//     function max(arr = [], i = 0) {
//         if (i === arr.length) {
//             return
//         };

//         if (arr[i] > maxItem) {
//             maxItem = arr[i]
//         }
//         max(arr, i + 1)
//     }

//     max(arr, i);

//     return maxItem
// }


// export const findMax = (arr = [], index = 0) => {
//     if (arr.length === 0) return undefined;

//     // Base case: last element
//     if (index === arr.length - 1) {
//         return arr[index];
//     }

//     const maxOfRest = findMax(arr, index + 1);

//     return arr[index] > maxOfRest
//         ? arr[index]
//         : maxOfRest;
// };

// console.log(findMax([14, 3, 7, 2, 100, 9, 4, 8, 12, 3]))

// function reverseString(str = '', i = str.length - 1) {
//     if (i < 0 ) return '';
//     return str[i] + reverseString(str, i - 1)
// }
// function reverseString(str = '', i = 0) {
//     if (i === str.length) return '';
//     return reverseString(str, i + 1) + str[i];
// }

// console.log(reverseString("hello"))


// function isPalindrome(str = '', left = 0, right = str.length - 1) {
//     if (left >= right) return true
//     return str[left] === str[right] && isPalindrome(str, left + 1, right - 1)
// }

// console.log(isPalindrome("racecar"))
// console.log(isPalindrome("hello"))
// console.log(isPalindrome("a"))
// console.log(isPalindrome("aa"))
// console.log(isPalindrome(""))


// function factorial(n) {
//     if (n <= 0) return 1;
//     return n * factorial(n - 1)
// }

// console.log(factorial(0))
// console.log(factorial(2))
// console.log(factorial(3))
// console.log(factorial(5))

// let fibMemo = new Map();

// function fibonacci(n) {
//     if (n <= 1) return n;

//     if (fibMemo.has(n)) return fibMemo.get(n);

//     const final = fibonacci(n - 1) + fibonacci(n - 2);
//     fibMemo.set(n, final)

//     return final
// }

// console.log(fibonacci(5))


// function mostFrequent(arr = [], i = 0, map = new Map(), mostFrequentEl = arr[0], maxCount = 0) {
//     if (i === arr.length) return mostFrequentEl;

//     let freq = map.get(arr[i]) || 0;

//     map.set(arr[i], ++freq);

//     // In a tie, return the element that first reaches the highest frequency.
//     // [4, 2, 4, 3, 2, 4, 2]
//     // 4 and 2 present 3 times
//     // First: got 4 of count 3 -> maxCount = 3
//     // Second: 2 also 3 times -> checks 3 > 3 (maxCount) => false => mostFrequentEl not updated which is still 4
//     // Sataisfied -> Only return first element
//     if (freq > maxCount) {
//         maxCount = freq;
//         mostFrequentEl = arr[i]
//     }

//     return mostFrequent(arr, i + 1, map, mostFrequentEl, maxCount)
// }

// console.log(mostFrequent([4, 2, 4, 3, 2, 4, 2]))
// console.log(mostFrequent([]))