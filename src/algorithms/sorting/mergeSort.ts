import { type SortStep } from './types';

export const MERGE_SORT_CODE = `void sort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        sort(arr, l, m);
        sort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}

void merge(int arr[], int l, int m, int r) {
    // Copy data to temp arrays
    int n1 = m - l + 1, n2 = r - m;
    int L[] = new int[n1], R[] = new int[n2];
    for(int i=0; i<n1; ++i) L[i] = arr[l+i];
    for(int j=0; j<n2; ++j) R[j] = arr[m+1+j];

    // Merge temp arrays
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    // Copy remaining
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}`;

export function* mergeSort(array: number[]): Generator<SortStep> {
    let arr = [...array];
    let n = arr.length;
    let aux = [...arr];

    function* merge(low: number, mid: number, high: number): Generator<SortStep> {
        for (let i = low; i <= high; i++) aux[i] = arr[i];

        let i = low, j = mid + 1, k = low;

        yield {
            array: [...arr], comparing: [], swapping: [], sorted: [],
            codeLine: 10,
            description: `Merging subarrays: [${low}...${mid}] and [${mid + 1}...${high}]`
        };

        while (i <= mid && j <= high) {
            yield {
                array: [...arr], comparing: [i, j], swapping: [], sorted: [],
                codeLine: 19,
                description: `Comparing left element ${aux[i]} with right element ${aux[j]}`
            };

            if (aux[i] <= aux[j]) {
                arr[k] = aux[i];
                yield {
                    array: [...arr], comparing: [], swapping: [], sorted: [],
                    overwrite: { index: k, value: aux[i] },
                    codeLine: 20,
                    description: `L[i] <= R[j], placing ${aux[i]} at index ${k}`
                };
                i++;
            } else {
                arr[k] = aux[j];
                yield {
                    array: [...arr], comparing: [], swapping: [], sorted: [],
                    overwrite: { index: k, value: aux[j] },
                    codeLine: 21,
                    description: `L[i] > R[j], placing ${aux[j]} at index ${k}`
                };
                j++;
            }
            k++;
        }

        while (i <= mid) {
            arr[k] = aux[i];
            yield {
                array: [...arr], comparing: [], swapping: [], sorted: [],
                overwrite: { index: k, value: aux[i] },
                codeLine: 24, // Copy remaining loop
                description: `Copying remaining element ${aux[i]} from left subarray`
            };
            i++;
            k++;
        }

        yield {
            array: [...arr], comparing: [], swapping: [], sorted: [],
            codeLine: 6,
            description: `Merge completed for range [${low}...${high}]`
        };
    }

    function* sort(low: number, high: number): Generator<SortStep> {
        if (high <= low) return;

        yield {
            array: [...arr], comparing: [], swapping: [], sorted: [],
            codeLine: 2,
            description: `Splitting range [${low}...${high}]`
        };

        let mid = Math.floor(low + (high - low) / 2);

        yield* sort(low, mid);
        yield* sort(mid + 1, high);

        yield* merge(low, mid, high);
    }

    yield* sort(0, n - 1);

    yield {
        array: [...arr],
        comparing: [],
        swapping: [],
        sorted: Array.from({ length: n }, (_, k) => k),
        codeLine: 1,
        description: "Sorting completed!"
    };
}
