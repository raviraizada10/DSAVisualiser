
export const HUFFMAN_CODE = `public void buildHuffmanTree(char[] charArray, int[] charFreq) {
    PriorityQueue<Node> q = new PriorityQueue<>(n, new MyComparator());

    for (int i = 0; i < n; i++) {
        Node hn = new Node();
        hn.c = charArray[i];
        hn.data = charFreq[i];
        hn.left = null;
        hn.right = null;
        q.add(hn);
    }

    Node root = null;
    while (q.size() > 1) {
        Node x = q.peek();
        q.poll();
        Node y = q.peek();
        q.poll();

        Node f = new Node();
        f.data = x.data + y.data;
        f.c = '-';
        f.left = x;
        f.right = y;
        root = f;
        q.add(f);
    }
}`;

export interface HuffmanNode {
    id: string; // Unique ID for visualization key
    char: string;
    freq: number;
    left?: HuffmanNode;
    right?: HuffmanNode;
    x?: number; // For layout
    y?: number;
    isProcessed?: boolean; // In Queue vs Processed
}

export interface HuffmanStep {
    queue: HuffmanNode[]; // Current nodes in PQ
    treeRoot: HuffmanNode | null; // Current tree being built (forest)
    // Actually we visualize the forest.
    // The queue basically holds the roots of the forest.
    activeNodes: string[]; // IDs of nodes currently being merged
    description: string;
    codeLine: number;
}

export function* huffmanCoding(input: { char: string, freq: number }[]): Generator<HuffmanStep> {
    // 1. Init Queue
    // We treat the array as our PQ for visualization
    let queue: HuffmanNode[] = input.map((item, idx) => ({
        id: `leaf-${idx}`,
        char: item.char,
        freq: item.freq,
        isProcessed: false
    }));

    // Sort initially
    queue.sort((a, b) => a.freq - b.freq);

    yield {
        queue: JSON.parse(JSON.stringify(queue)),
        treeRoot: null,
        activeNodes: [],
        description: "Initialized Priority Queue with leaf nodes.",
        codeLine: 2
    };

    while (queue.length > 1) {
        // Sort (simulate PQ)
        queue.sort((a, b) => a.freq - b.freq);

        const x = queue[0];
        const y = queue[1];

        yield {
            queue: JSON.parse(JSON.stringify(queue)),
            treeRoot: null,
            activeNodes: [x.id, y.id],
            description: `Extracted two minimum frequency nodes: ${x.char}(${x.freq}) and ${y.char}(${y.freq}).`,
            codeLine: 15
        };

        // Remove first two
        queue = queue.slice(2);

        // Create new internal node
        const z: HuffmanNode = {
            id: `internal-${x.id}-${y.id}`,
            char: '-',
            freq: x.freq + y.freq,
            left: x,
            right: y,
            isProcessed: false
        };

        queue.push(z);
        // Sort again to show insertion
        queue.sort((a, b) => a.freq - b.freq);

        yield {
            queue: JSON.parse(JSON.stringify(queue)),
            treeRoot: null, // We visualize the queue as the state
            activeNodes: [z.id], // Highlight the new node
            description: `Merged into new node with freq ${z.freq}. Added back to Queue.`,
            codeLine: 20
        };
    }

    yield {
        queue: JSON.parse(JSON.stringify(queue)),
        treeRoot: queue[0],
        activeNodes: [],
        description: "Huffman Tree built successfully!",
        codeLine: 28
    };
}
