import { type TrieStep, type TrieNode } from './types';
import { v4 as uuidv4 } from 'uuid';

// Helper to clone (deep copy for visualization snapshots)
// In a real optimized viz, we wouldn't clone the whole tree every step, 
// but for this scale (10-20 nodes), it's fine and safe.
export function cloneTrie(node: TrieNode): TrieNode {
    const newNode: TrieNode = {
        id: node.id,
        isEndOfWord: node.isEndOfWord,
        children: {}
    };
    for (const key in node.children) {
        newNode.children[key] = cloneTrie(node.children[key]);
    }
    return newNode;
}

export function createTrieNode(): TrieNode {
    return { children: {}, isEndOfWord: false, id: uuidv4() };
}

export function* insertTrie(root: TrieNode, word: string): Generator<TrieStep> {
    const newRoot = cloneTrie(root);
    let curr = newRoot;

    yield {
        type: 'insert', root: newRoot, activeNodeId: curr.id, activeChar: null,
        codeLine: 8, description: `Starting insert for "${word}" at root`
    };

    for (let i = 0; i < word.length; i++) {
        const char = word[i];

        yield {
            type: 'highlight', root: newRoot, activeNodeId: curr.id, activeChar: char,
            codeLine: 9, description: `Processing character '${char}'`
        };

        if (!curr.children[char]) {
            curr.children[char] = { children: {}, isEndOfWord: false, id: uuidv4() };

            // Re-yield to show creation
            yield {
                type: 'insert', root: newRoot, activeNodeId: curr.id, activeChar: char,
                codeLine: 11, description: `Created new node for '${char}'`
            };
        } else {
            yield {
                type: 'highlight', root: newRoot, activeNodeId: curr.children[char].id, activeChar: char,
                codeLine: 10, description: `Node for '${char}' exists, moving down`
            };
        }

        curr = curr.children[char];

        yield {
            type: 'highlight', root: newRoot, activeNodeId: curr.id, activeChar: char,
            codeLine: 13, description: `Moved to node '${char}'`
        };
    }

    curr.isEndOfWord = true;
    yield {
        type: 'insert', root: newRoot, activeNodeId: curr.id, activeChar: null,
        codeLine: 15, description: `Marked end of word "${word}"`
    };
}

export function* searchTrie(root: TrieNode, word: string): Generator<TrieStep> {
    const vizRoot = cloneTrie(root); // Use a copy to highlight/mark traversal? 
    // Actually we just need to pass the ID of current node to highlight in UI
    let curr = vizRoot;

    yield {
        type: 'search', root: vizRoot, activeNodeId: curr.id, activeChar: null,
        codeLine: 19, description: `Starting search for "${word}"`
    };

    for (let i = 0; i < word.length; i++) {
        const char = word[i];

        yield {
            type: 'highlight', root: vizRoot, activeNodeId: curr.id, activeChar: char,
            codeLine: 20, description: `Looking for child '${char}'`
        };

        if (!curr.children[char]) {
            yield {
                type: 'not-found', root: vizRoot, activeNodeId: curr.id, activeChar: char,
                codeLine: 21, description: `Child '${char}' not found. Word does not exist.`
            };
            return;
        }

        curr = curr.children[char];

        yield {
            type: 'highlight', root: vizRoot, activeNodeId: curr.id, activeChar: char,
            codeLine: 22, description: `Found '${char}', moving down.`
        };
    }

    if (curr.isEndOfWord) {
        yield {
            type: 'found', root: vizRoot, activeNodeId: curr.id, activeChar: null,
            codeLine: 24, description: `End of word flag is TRUE. Word found!`
        };
    } else {
        yield {
            type: 'not-found', root: vizRoot, activeNodeId: curr.id, activeChar: null,
            codeLine: 24, description: `End of word flag is FALSE. Prefix exists, but not full word.`
        };
    }
}
