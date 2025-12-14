import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

import GraphVisualizer from '../components/GraphVisualizer';
import NQueensVisualizer from '../components/backtracking/NQueensVisualizer';
import AlgorithmInfoPanel from '../components/AlgorithmInfoPanel';

describe('Sanity Check: Application Rendering', () => {
    it('renders the main App without crashing', () => {
        render(<App />);
        // Assuming the landing page has a title "Visualize" or similar.
        // There might be multiple elements with "Visualize", so we check for at least one.
        const titleElements = screen.getAllByText(/Visualize/i);
        expect(titleElements.length).toBeGreaterThan(0);
    });
});



describe('Component Sanity: AlgorithmInfoPanel', () => {
    it('renders metadata correctly', () => {
        const mockData = {
            id: 'test',
            name: 'Test Algorithm',
            category: 'Sorting' as const,
            description: 'Test Description',
            complexity: { time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' }, space: 'O(1)' },
            useCases: ['Case 1'],
            pros: ['Pro 1'],
            cons: ['Con 1']
        };

        render(<AlgorithmInfoPanel data={mockData} />);
        expect(screen.getByText('Test Algorithm')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        const complexitymetrics = screen.getAllByText('O(1)');
        expect(complexitymetrics.length).toBeGreaterThan(0);
    });

    it('renders interview tips when available', () => {
        const mockDataWithTips = {
            id: 'test-tips',
            name: 'Test Algorithm',
            category: 'Sorting' as const,
            description: 'Test',
            complexity: { time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' }, space: 'O(1)' },
            useCases: [],
            pros: [],
            cons: [],
            interviewTips: {
                whenToUse: ['Use constraint A'],
                commonProblems: ['Problem X'],
                pitfalls: ['Pitfall Y']
            }
        };

        render(<AlgorithmInfoPanel data={mockDataWithTips} />);
        expect(screen.getByText('When to Use')).toBeInTheDocument();
        expect(screen.getByText('Use constraint A')).toBeInTheDocument();
        expect(screen.getByText('Common Problems')).toBeInTheDocument();
    });
});

describe('Page Sanity: Visualizers Load', () => {
    // Smoke test to ensure complex visualizers don't crash on mount

    it('GraphVisualizer mounts successfully', () => {
        const mockProps = {
            algorithm: {} as any, // Mock minimal props if needed
            algorithmName: 'BFS',
            onSelectAlgorithm: vi.fn(),
            availableAlgorithms: ['BFS']
        };
        // We might need to mock ResizeObserver for ResizableSplit
        global.ResizeObserver = vi.fn().mockImplementation(() => ({
            observe: vi.fn(),
            unobserve: vi.fn(),
            disconnect: vi.fn(),
        }));

        render(<GraphVisualizer {...mockProps} />);
        expect(screen.getByText('BFS')).toBeInTheDocument();
    });

    it('NQueensVisualizer mounts successfully', () => {
        global.ResizeObserver = vi.fn().mockImplementation(() => ({
            observe: vi.fn(),
            unobserve: vi.fn(),
            disconnect: vi.fn(),
        }));

        render(<NQueensVisualizer />);
        // Look for typical text in NQueens
        expect(screen.getByText(/Board Size/i)).toBeInTheDocument();
    });
});
