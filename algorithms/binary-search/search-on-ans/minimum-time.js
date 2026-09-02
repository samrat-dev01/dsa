// minimum-time problem
export function minimumTime(machines, target) {
    let left = 0;
    let right = Math.min(...machines) * target;
    let answer = right;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2)
        let produced = 0;

        for (const machine of machines) {
            produced += Math.floor(mid / machine)
        }

        if (produced >= target) {
            answer = mid;
            right = mid - 1
        }
        else {
            left = mid + 1
        }
    }

    return answer
}