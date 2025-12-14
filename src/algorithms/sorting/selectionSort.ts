import { type SortStep } from './types';

export const SELECTION_SORT_CODE = `public void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            // Check if current element is smaller
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }
        // Swap found minimum with first element
        int temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}`;

export function* selectionSort(array: number[]): Generator<SortStep> {
  let arr = [...array];
  let n = arr.length;

  for (let i = 0; i < n; i++) {
    let minIdx = i;

    yield {
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: i }, (_, k) => k),
      codeLine: 3,
      description: `Starting search for minimum element from index ${i}`
    };

    for (let j = i + 1; j < n; j++) {
      yield {
        array: [...arr],
        comparing: [minIdx, j],
        swapping: [],
        sorted: Array.from({ length: i }, (_, k) => k),
        codeLine: 7,
        description: `Comparing current min (${arr[minIdx]}) with ${arr[j]}`
      };

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        yield {
          array: [...arr],
          comparing: [minIdx],
          swapping: [],
          sorted: Array.from({ length: i }, (_, k) => k),
          codeLine: 8,
          description: `Found new minimum: ${arr[minIdx]} at index ${minIdx}`
        };
      }
    }
    if (minIdx !== i) {
      let temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
      yield {
        array: [...arr],
        comparing: [],
        swapping: [i, minIdx],
        sorted: Array.from({ length: i }, (_, k) => k),
        codeLine: 12,
        description: `Swapping minimum (${arr[i]}) with element at index ${i}`
      };
    }
    yield {
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: i + 1 }, (_, k) => k),
      codeLine: 3,
      description: `Element at index ${i} is now sorted`
    };
  }
}
