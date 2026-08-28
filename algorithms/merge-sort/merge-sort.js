// Only accepts sorted arrays
const merge = (left, right) => {
    const result = [];

    let i = 0;
    let j = 0;

    // check both arrays element -> compare smaller -> then push to result
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }

    // if left remaining
    while (i < left.length) {
        result.push(left[i]);
        i++;
    }
    // if right remaining
    while (j < right.length) {
        result.push(right[j]);
        j++;
    }

    return result;
};

export const mergeSort = (arr = []) => {
    // if arr has only one element - return arr
    if (arr.length <= 1) {
        return arr;
    }

    const middle = Math.floor(arr.length / 2);

    const left = arr.slice(0, middle);
    const right = arr.slice(middle);

    return merge(mergeSort(left), mergeSort(right));
};