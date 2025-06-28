#include <iostream>
using namespace std;

// Definition for singly-linked list.
struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};

// Merge two sorted lists
ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
    ListNode dummy(0); // dummy head
    ListNode* tail = &dummy;

    while (l1 && l2) {
        if (l1->val < l2->val) {
            tail->next = l1;
            l1 = l1->next;
        } else {
            tail->next = l2;
            l2 = l2->next;
        }
        tail = tail->next;
    }

    // Append remaining nodes
    if (l1) tail->next = l1;
    if (l2) tail->next = l2;

    return dummy.next;
}

// Helper: Convert array to linked list
ListNode* createList(const vector<int>& vals) {
    ListNode* head = nullptr;
    ListNode* tail = nullptr;
    for (int val : vals) {
        ListNode* newNode = new ListNode(val);
        if (!head) {
            head = tail = newNode;
        } else {
            tail->next = newNode;
            tail = tail->next;
        }
    }
    return head;
}

// Helper: Print linked list
void printList(ListNode* head) {
    cout << "[";
    while (head) {
        cout << head->val;
        if (head->next) cout << ",";
        head = head->next;
    }
    cout << "]\n";
}

// Test Runner
int main() {
    vector<pair<vector<int>, vector<int>>> testCases = {
        {{1,2,4}, {1,3,4}},
        {{}, {}},
        {{5}, {1,2,3}}
    };

    for (auto& test : testCases) {
        ListNode* l1 = createList(test.first);
        ListNode* l2 = createList(test.second);
        ListNode* merged = mergeTwoLists(l1, l2);
        printList(merged);
    }

    return 0;
}
