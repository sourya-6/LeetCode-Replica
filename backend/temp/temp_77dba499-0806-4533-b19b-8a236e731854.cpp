#include <iostream>
using namespace std;

string isEven(int n) {
    return (n % 2 == 0) ? "Even" : "Odd";
}

int main() {
    cout << isEven(4) << "|";
    cout << isEven(7) << "|";
    cout << isEven(10) << "|";
    cout << isEven(15);
    return 0;
}
console.log(2)