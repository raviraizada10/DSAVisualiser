export const BST_INSERT_CODE = `public void insert(int value) {
    root = insertRec(root, value);
}

private Node insertRec(Node root, int value) {
    if (root == null) {
        root = new Node(value);
        return root;
    }

    if (value < root.value)
        root.left = insertRec(root.left, value);
    else if (value > root.value)
        root.right = insertRec(root.right, value);

    return root;
}`;

export const BST_SEARCH_CODE = `public boolean search(int value) {
    return searchRec(root, value);
}

private boolean searchRec(Node root, int value) {
    if (root == null) return false;
    if (root.value == value) return true;
    
    if (value < root.value)
        return searchRec(root.left, value);
    else
        return searchRec(root.right, value);
}`;

export const BST_TRAVERSAL_CODE = `public void inorder() { inorderRec(root); }
private void inorderRec(Node root) {
    if (root != null) {
        inorderRec(root.left);
        System.out.print(root.value + " ");
        inorderRec(root.right);
    }
}

public void preorder() { preorderRec(root); }
private void preorderRec(Node root) {
    if (root != null) {
        System.out.print(root.value + " ");
        preorderRec(root.left);
        preorderRec(root.right);
    }
}

public void postorder() { postorderRec(root); }
private void postorderRec(Node root) {
    if (root != null) {
        postorderRec(root.left);
        postorderRec(root.right);
        System.out.print(root.value + " ");
    }
}`;
