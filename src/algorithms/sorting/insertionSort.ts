import { type SortStep } from './types';

export const INSERTION_SORT_CODE = `public void insertionSort(int[] arr) {
    int n = arr.length;
    for (int i = 1; i < n; ++i) {
        int key = arr[i];
        int j = i - 1;
        // Move elements greater than key one pos ahead
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`;

export function* insertionSort(array: number[]): Generator<SortStep> {
    let arr = [...array];
    let n = arr.length;

    for (let i = 1; i < n; i++) {
        let j = i;
        yield {
            array: [...arr],
            comparing: [i],
            swapping: [],
            sorted: [],
            codeLine: 3,
            description: `Considering element ${arr[i]} at index ${i} (key)`
        };

        while (j > 0 && arr[j] < arr[j - 1]) {
            yield {
                array: [...arr],
                comparing: [j, j - 1],
                swapping: [],
                sorted: [],
                codeLine: 6,
                description: `Comparing key ${arr[j]} with ${arr[j - 1]}`
            };

            let temp = arr[j];
            arr[j] = arr[j - 1];
            arr[j - 1] = temp;

            yield {
                array: [...arr],
                comparing: [],
                swapping: [j, j - 1],
                sorted: [],
                codeLine: 7,
                description: `${arr[j - 1]} > ${arr[j]}, shifting ${arr[j - 1]} right`
            };

            j--;
        }

        yield {
            array: [...arr],
            comparing: [],
            swapping: [],
            sorted: Array.from({ length: i + 1 }, (_, k) => k),
            codeLine: 10,
            description: `Inserted key at correct position`
        };
    }
    yield {
        array: [...arr],
        comparing: [],
        swapping: [],
        sorted: Array.from({ length: n }, (_, k) => k),
        codeLine: 12,
        description: "Sorting completed!"
    };
}
