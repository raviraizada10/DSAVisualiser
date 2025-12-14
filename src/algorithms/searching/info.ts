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

export const SEARCHING_ALGORITHMS_INFO: { [key: string]: AlgoInfo } = {
    'Linear Search': {
        title: 'Linear Search',
        description: 'Linear Search iterates through every element in the array one by one until the target value is found or the end of the array is reached.',
        steps: [
            'Start from the first element.',
            'Compare the current element with the target.',
            'If matches, return the index.',
            'If not, move to the next element.',
            'Repeat until found or array ends.'
        ],
        complexity: {
            best: 'O(1)',
            average: 'O(n)',
            space: 'O(1)'
        }
    },
    'Binary Search': {
        title: 'Binary Search',
        description: 'Binary Search is an efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing in half the portion of the list that could contain the item.',
        steps: [
            'Compare target with the middle element.',
            'If equal, return the index.',
            'If target is smaller, search the left half.',
            'If target is larger, search the right half.',
            'Repeat until found or the search interval is empty.'
        ],
        complexity: {
            best: 'O(1)',
            average: 'O(log n)',
            space: 'O(1)'
        }
    }
};
