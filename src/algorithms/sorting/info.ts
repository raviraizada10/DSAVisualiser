export interface AlgoInfo {
    title: string;
    description: string;
    steps: string[];
    complexity: {
        best: string;
        average: string;
        space: string;
    };
}

export const SORTING_ALGORITHMS_INFO: { [key: string]: AlgoInfo } = {
    'Bubble Sort': {
        title: 'Bubble Sort',
        description: 'Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
        steps: [
            'Start at the beginning of the array.',
            'Compare the first two elements.',
            'If the first is greater than the second, swap them.',
            'Move to the next pair and repeat until the end.',
            'Repeat this process for the remaining unsorted elements.'
        ],
        complexity: {
            best: 'O(n)',
            average: 'O(n²)',
            space: 'O(1)'
        }
    },
    'Selection Sort': {
        title: 'Selection Sort',
        description: 'Selection Sort divides the input list into two parts: the sublist of items already sorted and the sublist of items remaining to be sorted.',
        steps: [
            'Find the minimum element in the unsorted subarray.',
            'Swap it with the leftmost unsorted element.',
            'Move the boundary of the sorted subarray one element to the right.',
            'Repeat until the entire array is sorted.'
        ],
        complexity: {
            best: 'O(n²)',
            average: 'O(n²)',
            space: 'O(1)'
        }
    },
    'Insertion Sort': {
        title: 'Insertion Sort',
        description: 'Insertion Sort builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms.',
        steps: [
            'Iterate from the second element to the end.',
            'Compare the current element with its predecessor.',
            'If the key element is smaller than its predecessor, compare it to the elements before.',
            'Move the greater elements one position up to make space for the swapped element.',
            'Repeat until the array is sorted.'
        ],
        complexity: {
            best: 'O(n)',
            average: 'O(n²)',
            space: 'O(1)'
        }
    },
    'Merge Sort': {
        title: 'Merge Sort',
        description: 'Merge Sort is an efficient, stable, comparison-based sorting algorithm. Most implementations produce a stable sort, which means that the implementation preserves the input order of equal elements in the sorted output.',
        steps: [
            'Divide the unsorted list into n sublists, each containing one element.',
            'Repeatedly merge sublists to produce new sorted sublists until there is only one sublist remaining.',
            'This will be the sorted list.'
        ],
        complexity: {
            best: 'O(n log n)',
            average: 'O(n log n)',
            space: 'O(n)'
        }
    },
    'Quick Sort': {
        title: 'Quick Sort',
        description: 'Quick Sort is an efficient sorting algorithm which is a systematic method for placing the elements of an array in order.',
        steps: [
            'Pick an element, called a pivot, from the array.',
            'Partition reordering the array so that all elements with values less than the pivot come before the pivot.',
            'Recursively apply the above steps to the sub-array of elements with smaller values and separately to the sub-array of elements with greater values.'
        ],
        complexity: {
            best: 'O(n log n)',
            average: 'O(n log n)',
            space: 'O(log n)'
        }
    }
};
