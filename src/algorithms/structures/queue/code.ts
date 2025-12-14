export const QUEUE_CODE = `public class Queue {
    private int[] array;
    private int front;
    private int rear;
    private int capacity;
    private int size;

    public Queue(int capacity) {
        this.capacity = capacity;
        this.array = new int[capacity];
        this.front = 0;
        this.rear = -1;
        this.size = 0;
    }

    public void enqueue(int item) {
        if (size == capacity) {
            System.out.println("Queue is full");
            return;
        }
        rear = (rear + 1) % capacity;
        array[rear] = item;
        size++;
    }

    public int dequeue() {
        if (size == 0) {
            System.out.println("Queue is empty");
            return -1;
        }
        int item = array[front];
        front = (front + 1) % capacity;
        size--;
        return item;
    }

    public int peek() {
        if (size == 0) return -1;
        return array[front];
    }
}`;
