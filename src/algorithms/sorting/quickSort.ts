import { type SortStep } from './types';

export const QUICK_SORT_CODE = `void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            // Swap arr[i] and arr[j]
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    // Swap arr[i+1] and arr[high]
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}`;

export function* quickSort(array: number[]): Generator<SortStep> {
    let arr = [...array];

    function* partition(low: number, high: number): Generator<SortStep> {
        let pivot = arr[high];
        let i = low - 1;

        yield {
            array: [...arr], comparing: [high], swapping: [], sorted: [],
            codeLine: 10,
            description: `Chosen pivot: ${pivot} at index ${high}`
        };

        for (let j = low; j < high; j++) {
            yield {
                array: [...arr], comparing: [j, high], swapping: [], sorted: [],
                codeLine: 13,
                description: `Comparing ${arr[j]} with pivot ${pivot}`
            };

            if (arr[j] < pivot) {
                i++;
                let temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
                yield {
                    array: [...arr], comparing: [], swapping: [i, j], sorted: [],
                    codeLine: 15, // inside swap block
                    description: `${arr[j]} < ${pivot}, swapping it to left partition (index ${i})`
                };
            }
        }
        let temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;

        yield {
            array: [...arr], comparing: [], swapping: [i + 1, high], sorted: [],
            codeLine: 22,
            description: `Placing pivot at correct sorted position ${i + 1}`
        };

        return i + 1;
    }

    function* sort(low: number, high: number): Generator<SortStep> {
        if (low < high) {
            yield {
                array: [...arr], comparing: [], swapping: [], sorted: [],
                codeLine: 3,
                description: `Partitioning subarray [${low}...${high}]`
            };

            let pi = yield* partition(low, high) as any;

            yield* sort(low, pi - 1);
            yield* sort(pi + 1, high);
        }
    }

    yield* sort(0, arr.length - 1);

    yield {
        array: [...arr],
        comparing: [],
        swapping: [],
        sorted: Array.from({ length: arr.length }, (_, k) => k),
        codeLine: 26, // End of function
        description: "Sorting completed!"
    };
}
