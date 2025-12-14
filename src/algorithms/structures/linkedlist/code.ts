export const LINKED_LIST_CODE = `public class LinkedList<T> {
    private class Node {
        T data;
        Node next;
        Node(T data) { this.data = data; }
    }
    
    private Node head;
    private Node tail;
    private int size;

    public void addFirst(T val) {
        Node newNode = new Node(val);
        if (head == null) {
            head = tail = newNode;
        } else {
            newNode.next = head;
            head = newNode;
        }
        size++;
    }

    public void addLast(T val) {
        Node newNode = new Node(val);
        if (head == null) {
            head = tail = newNode;
        } else {
            tail.next = newNode;
            tail = newNode;
        }
        size++;
    }

    public T removeFirst() {
        if (head == null) throw new Exception();
        T val = head.data;
        head = head.next;
        if (head == null) tail = null;
        size--;
        return val;
    }
    
    public T removeLast() {
        if (head == null) throw new Exception();
        if (head == tail) {
            T val = head.data;
            head = tail = null;
            size--;
            return val;
        }
        Node current = head;
        while (current.next != tail) {
            current = current.next;
        }
        T val = tail.data;
        tail = current;
        tail.next = null;
        size--;
        return val;
    }
}`;
