#include <iostream>
#include <vector>
#include <string>
#include <nlohmann/json.hpp>

using json = nlohmann::json;
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
    
    while (i < l1.size()) {
        merged.push_back(l1[i++]);
    }
    
    while (j < l2.size()) {
        merged.push_back(l2[j++]);
    }
    
    return merged;
}

vector<int> func(vector<int> l1, vector<int> l2) {
    return mergeTwoLists(l1, l2);
}

int main() {
    // Read input from stdin (in JSON format)
    string input;
    getline(cin, input);
    
    auto data = json::parse(input);
    vector<int> l1 = data[0];
    vector<int> l2 = data[1];
    
    // Call function
    vector<int> result = func(l1, l2);
    
    // Output result as JSON array
    cout << json(result).dump() << endl;
    
    return 0;
}