import { type HeapStep } from './types';

export function* insertHeap(array: number[], value: number): Generator<HeapStep> {
    const newArr = [...array, value];
    let index = newArr.length - 1;

    yield {
        type: 'insert',
        array: [...newArr],
        highlightIndices: [index],
        codeLine: 6,
        description: `Inserted ${value} at the end (index ${index})`
    };

    yield {
        type: 'insert',
        array: [...newArr],
        highlightIndices: [index],
        codeLine: 7,
        description: `Starting siftUp operation from index ${index}`
    };

    while (index > 0) {
        let parent = Math.floor((index - 1) / 2);

        yield {
            type: 'compare',
            array: [...newArr],
            highlightIndices: [index, parent],
            codeLine: 13, // while check or internal logic
            description: `Comparing child ${newArr[index]} with parent ${newArr[parent]}`
        };

        if (newArr[index] <= newArr[parent]) {
            break;
        }

        // Swap
        [newArr[index], newArr[parent]] = [newArr[parent], newArr[index]];

        yield {
            type: 'swap',
            array: [...newArr],
            highlightIndices: [index, parent],
            codeLine: 15,
            description: `Swapped ${newArr[parent]} and ${newArr[index]}`
        };

        index = parent;
    }

    yield {
        type: 'complete',
        array: [...newArr],
        highlightIndices: [],
        codeLine: 8,
        description: `Insert complete. Heap property restored.`
    };
}

export function* extractMaxHeap(array: number[]): Generator<HeapStep> {
    if (array.length === 0) return;

    let newArr = [...array];
    const max = newArr[0];
    const last = newArr.pop()!;

    if (newArr.length > 0) {
        newArr[0] = last;

        yield {
            type: 'extract',
            array: [...newArr],
            highlightIndices: [0],
            codeLine: 22,
            description: `Replaced root (${max}) with last element (${last})`
        };

        yield {
            type: 'heapify',
            array: [...newArr],
            highlightIndices: [],
            codeLine: 23,
            description: `Starting siftDown from root`
        };

        let index = 0;
        const size = newArr.length;

        while (true) {
            let left = 2 * index + 1;
            let right = 2 * index + 2;
            let largest = index;

            yield {
                type: 'compare',
                array: [...newArr],
                highlightIndices: [index],
                codeLine: 31,
                description: `Checking children of index ${index}`
            };

            if (left < size && newArr[left] > newArr[largest]) {
                largest = left;
            }
            if (right < size && newArr[right] > newArr[largest]) {
                largest = right;
            }

            if (largest === index) {
                yield {
                    type: 'complete',
                    array: [...newArr],
                    highlightIndices: [index],
                    codeLine: 33,
                    description: `Heap property satisfied.`
                };
                break;
            }

            // Swap
            [newArr[index], newArr[largest]] = [newArr[largest], newArr[index]];

            yield {
                type: 'swap',
                array: [...newArr],
                highlightIndices: [index, largest],
                codeLine: 34,
                description: `Swapped parent ${newArr[largest]} with larger child ${newArr[index]}`
            };

            index = largest;
        }
    } else {
        yield {
            type: 'extract',
            array: [],
            highlightIndices: [],
            codeLine: 31,
            description: `Removed last element. Heap is empty.`
        };
    }

    yield {
        type: 'complete',
        array: [...newArr],
        highlightIndices: [],
        codeLine: 24,
        description: `Extract Max Complete.`
    };
}
