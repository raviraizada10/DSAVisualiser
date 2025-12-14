
export interface AlgorithmMetadata {
    id: string; // e.g. 'bubble-sort'
    name: string; // e.g. 'Bubble Sort'
    category: 'Sorting' | 'Searching' | 'Graph' | 'DP' | 'Backtracking' | 'Greedy' | 'Patterns' | 'Data Structure';
    description: string;
    keySteps: string[];
    complexity: {
        time: {
            best: string;
            average: string;
            worst: string;
        };
        space: string;
    };
    useCases: string[];
    pros: string[];
    cons: string[];
    realWorldExamples?: string[];
    interviewTips?: {
        whenToUse: string[];
        commonProblems: string[];
        pitfalls: string[];
    };
}
