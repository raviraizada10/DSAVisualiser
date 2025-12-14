export interface HeapStep {
    type: 'insert' | 'extract' | 'heapify' | 'swap' | 'compare' | 'complete';
    array: number[];
    highlightIndices: number[]; // Indices to highlight (e.g., swapping pair)
    codeLine?: number;
    description?: string;
}

export type HeapOperation = 'insert' | 'extractMax' | 'extractMin';

// Display code snippet for Heap operations
export const HEAP_CODE_JAVA = `public class MaxHeap {
    private int[] heap;
    private int size;

    public void insert(int val) {
        heap[size] = val;
        siftUp(size);
        size++;
    }

    private void siftUp(int index) {
        while (index > 0) {
            int parent = (index - 1) / 2;
            if (heap[index] <= heap[parent]) break;
            swap(index, parent);
            index = parent;
        }
    }

    public int extractMax() {
        int max = heap[0];
        heap[0] = heap[--size];
        siftDown(0);
        return max;
    }

    private void siftDown(int index) {
        while (true) {
            int left = 2 * index + 1, right = 2 * index + 2;
            int largest = index;
            if (left < size && heap[left] > heap[largest]) largest = left;
            if (right < size && heap[right] > heap[largest]) largest = right;
            if (largest == index) break;
            swap(index, largest);
            index = largest;
        }
    }
}`;
