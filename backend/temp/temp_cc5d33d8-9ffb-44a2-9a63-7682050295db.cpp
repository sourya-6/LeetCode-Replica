#include <iostream>
#include <vector>
using namespace std;

// ===== User function =====
vector<int> func(vector<int>& nums, int target) {
    unordered_map<int, int> mp;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (mp.find(complement) != mp.end()) {
            return {mp[complement], i};
        }
        mp[nums[i]] = i;
    }
    return {};
}

// ===== Auto test runner =====
int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    vector<int> res = func(nums, target);

    for (int i : res) cout << i << " ";
    return 0;
}
