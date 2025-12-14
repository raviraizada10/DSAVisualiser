export const SLIDING_WINDOW_CODE = `function maxSumArray(arr, k) {
    if (arr.length < k) return null;
    
    let maxSum = 0;
    let windowSum = 0;

    // First window
    for (let i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    maxSum = windowSum;

    // Slide
    for (let i = k; i < arr.length; i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = Math.max(maxSum, windowSum);
    }

    return maxSum;
}`;

export const TWO_POINTERS_CODE = `function twoSumSorted(arr, target) {
    let left = 0;
    let right = arr.length - 1;

    while (left < right) {
        let sum = arr[left] + arr[right];

        if (sum === target) {
            return [left, right]; // Found
        } else if (sum < target) {
            left++; // Need larger sum
        } else {
            right--; // Need smaller sum
        }
    }
    return [-1, -1]; // Not found
}`;

export const MERGE_INTERVALS_CODE = `function merge(intervals) {
    if (intervals.length <= 1) return intervals;

    // Sort by start time
    intervals.sort((a, b) => a[0] - b[0]);

    const result = [intervals[0]];

    for (let i = 1; i < intervals.length; i++) {
        const current = intervals[i];
        const last = result[result.length - 1];

        // Overlap: current.start <= last.end
        if (current[0] <= last[1]) {
            // Merge: new end is max(last.end, current.end)
            last[1] = Math.max(last[1], current[1]);
        } else {
            // No overlap, add to result
            result.push(current);
        }
    }

    return result;
} `;
