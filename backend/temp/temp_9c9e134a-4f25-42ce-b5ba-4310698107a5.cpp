#include <vector>
using namespace std;

vector<int> mergeTwoLists(vector<int> l1, vector<int> l2) {
    vector<int> merged;
    int i = 0, j = 0;
    
    while (i < l1.size() && j < l2.size()) {
        if (l1[i] < l2[j]) {
            merged.push_back(l1[i++]);
        } else {
            merged.push_back(l2[j++]);
        }
    }
    
    // Add remaining elements from l1
    while (i < l1.size()) {
        merged.push_back(l1[i++]);
    }
    
    // Add remaining elements from l2
    while (j < l2.size()) {
        merged.push_back(l2[j++]);
    }
    
    return merged;
}

vector<int> func(vector<int> l1, vector<int> l2) {
    return mergeTwoLists(l1, l2);
}