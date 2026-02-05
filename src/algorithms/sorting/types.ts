export interface SortStep {
    array: number[];
    comparing: number[]; // Indices being compared
    swapping: number[]; // Indices being swapped
    sorted: number[]; // Indices known to be sorted
    overwrite?: { index: number; value: number; }; // For merge sort
    codeLine?: number; // Line number for code tracing
    description?: string; // Interactive step description
}

export type SortAlgorithm = (array: number[]) => Generator<SortStep>;
