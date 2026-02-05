export type SearchStep =
    | { type: 'compare'; index: number; codeLine?: number; description?: string }
    | { type: 'found'; index: number; codeLine?: number; description?: string }
    | { type: 'not-found'; codeLine?: number; description?: string }
    | { type: 'range'; start: number; end: number; codeLine?: number; description?: string }; // For Binary Search

export type SearchAlgorithm = (array: number[], target: number) => Generator<SearchStep>;

export const LINEAR_SEARCH_CODE = `public int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) {
            return i; // Found
        }
    }
    return -1; // Not found
}`;

export const BINARY_SEARCH_CODE = `public int binarySearch(int[] arr, int target) {
    int start = 0, end = arr.length - 1;
    while (start <= end) {
        int mid = start + (end - start) / 2;
        if (arr[mid] == target)
            return mid;
        if (arr[mid] < target)
            start = mid + 1;
        else
            end = mid - 1;
    }
    return -1; // Not found
}`;

export function* linearSearch(array: number[], target: number): Generator<SearchStep> {
    yield {
        type: 'compare', index: 0,
        codeLine: 2,
        description: "Starting linear search from the beginning"
    };

    for (let i = 0; i < array.length; i++) {
        yield {
            type: 'compare', index: i,
            codeLine: 3,
            description: `Checking index ${i}: Is ${array[i]} == ${target}?`
        };

        if (array[i] === target) {
            yield {
                type: 'found', index: i,
                codeLine: 4,
                description: `Found target ${target} at index ${i}!`
            };
            return;
        }
    }
    yield {
        type: 'not-found',
        codeLine: 7,
        description: "Reached end of array. Target not found."
    };
}

export function* binarySearch(array: number[], target: number): Generator<SearchStep> {
    let start = 0;
    let end = array.length - 1;

    yield {
        type: 'range', start, end,
        codeLine: 2,
        description: "Initializing pointers: start = 0, end = n-1"
    };

    while (start <= end) {
        yield {
            type: 'range', start, end,
            codeLine: 3,
            description: `Current search range: [${start}, ${end}]`
        };

        const mid = Math.floor((start + end) / 2);
        yield {
            type: 'compare', index: mid,
            codeLine: 4,
            description: `Calculating mid index: ${mid}, value: ${array[mid]}`
        };

        yield {
            type: 'compare', index: mid,
            codeLine: 5,
            description: `Comparing arr[mid] (${array[mid]}) with target (${target})`
        };

        if (array[mid] === target) {
            yield {
                type: 'found', index: mid,
                codeLine: 6,
                description: `Target ${target} found at index ${mid}!`
            };
            return;
        }

        if (array[mid] < target) {
            start = mid + 1;
            yield {
                type: 'range', start, end,
                codeLine: 8,
                description: `${array[mid]} < ${target}, taking right half (start = ${mid + 1})`
            };
        } else {
            end = mid - 1;
            yield {
                type: 'range', start, end,
                codeLine: 10,
                description: `${array[mid]} > ${target}, taking left half (end = ${mid - 1})`
            };
        }
    }
    yield {
        type: 'not-found',
        codeLine: 12,
        description: "Start > End. Target not found."
    };
}
