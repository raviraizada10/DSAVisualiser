export interface TrieNode {
    children: { [key: string]: TrieNode };
    isEndOfWord: boolean;
    id: string; // Unique ID for visualization stability
}

export interface TrieStep {
    type: 'insert' | 'search' | 'highlight' | 'found' | 'not-found';
    root: TrieNode; // Full tree snapshots might be heavy, but Tries are small here
    activeNodeId: string | null;
    activeChar: string | null;
    codeLine?: number;
    description?: string;
}

export const TRIE_CODE_JAVA = `class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isEndOfWord = false;
}

class Trie {
    TrieNode root;

    public void insert(String word) {
        TrieNode curr = root;
        for (char c : word.toCharArray()) {
            if (curr.children[c - 'a'] == null) {
                curr.children[c - 'a'] = new TrieNode();
            }
            curr = curr.children[c - 'a'];
        }
        curr.isEndOfWord = true;
    }

    public boolean search(String word) {
        TrieNode curr = root;
        for (char c : word.toCharArray()) {
            if (curr.children[c - 'a'] == null) return false;
            curr = curr.children[c - 'a'];
        }
        return curr.isEndOfWord;
    }
}`;
