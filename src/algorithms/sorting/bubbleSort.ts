import { type SortStep } from './types';

// Java Code constant for display
export const BUBBLE_SORT_CODE = `public void bubbleSort(int[] arr) {
    int n = arr.length;
    boolean swapped;
    do {
        swapped = false;
        for (int i = 0; i < n - 1; i++) {
            // Compare adjacent elements
            if (arr[i] > arr[i + 1]) {
                // Swap if out of order
                int temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
                swapped = true;
            }
        }
        n--; 
    } while (swapped);
}`;

export function* bubbleSort(array: number[]): Generator<SortStep> {
    let arr = [...array];
    let n = arr.length;
    let swapped;

    yield {
        array: [...arr], comparing: [], swapping: [], sorted: [],
        codeLine: 1, description: "Starting Bubble Sort..."
    };

    do {
        swapped = false;
        yield {
            array: [...arr], comparing: [], swapping: [], sorted: [],
            codeLine: 4, description: "Starting new pass through the array."
        };

        for (let i = 0; i < n - 1; i++) {
            yield {
                array: [...arr],
                comparing: [i, i + 1],
                swapping: [],
                sorted: [],
                codeLine: 8,
                description: `Comparing index ${i} (${arr[i]}) and index ${i + 1} (${arr[i + 1]})`
            };

            if (arr[i] > arr[i + 1]) {
                let temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
                swapped = true;

                yield {
                    array: [...arr],
                    comparing: [],
                    swapping: [i, i + 1],
                    sorted: [],
                    codeLine: 10,
                    description: `Swapped ${arr[i]} and ${arr[i + 1]} because ${arr[i + 1]} < ${arr[i]}`
                };
            }
        }
        n--;
        yield {
            array: [...arr], comparing: [], swapping: [], sorted: [n],
            codeLine: 16, description: `Element at index ${n} is now sorted.`
        };
    } while (swapped);

    yield {
        array: [...arr],
        comparing: [],
        swapping: [],
        sorted: Array.from({ length: array.length }, (_, i) => i),
        codeLine: 17, // End of loop
        description: "Sorting completed!"
    };
}
