export const STACK_CODE = `public class Stack {
    private int[] store;
    private int top;
    private int capacity;

    public Stack(int capacity) {
        this.capacity = capacity;
        this.store = new int[capacity];
        this.top = -1;
    }

    public void push(int value) {
        if (top == capacity - 1) {
            System.out.println("Stack Overflow");
            return;
        }
        store[++top] = value;
    }

    public int pop() {
        if (top == -1) {
            System.out.println("Stack Underflow");
            return -1;
        }
        return store[top--];
    }

    public int peek() {
        if (top == -1) {
            return -1;
        }
        return store[top];
    }
}`;
