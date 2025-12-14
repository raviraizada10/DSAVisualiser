export const HASHTABLE_CODE = `class HashTable {
    class Node {
        int key, value;
        Node next;
        public Node(int k, int v) {
            key = k; value = v;
        }
    }

    private Node[] buckets;
    private int capacity;

    public HashTable(int cap) {
        capacity = cap;
        buckets = new Node[capacity];
    }

    private int hash(int key) {
        return key % capacity;
    }

    public void put(int key, int value) {
        int index = hash(key);
        Node head = buckets[index];
        
        // Update if exists
        while (head != null) {
            if (head.key == key) {
                head.value = value;
                return;
            }
            head = head.next;
        }

        // Insert at beginning (Collision: Chaining)
        Node newNode = new Node(key, value);
        newNode.next = buckets[index];
        buckets[index] = newNode;
    }

    public int get(int key) {
        int index = hash(key);
        Node head = buckets[index];
        while (head != null) {
            if (head.key == key) return head.value;
            head = head.next;
        }
        return -1; // Not found
    }
}`;
