// Write your code here
a=10
print(a)

import json
results = []

try:
    output = func([2,7,11,15], 9)
    passed = str(output) == str("[0,1]")
    results.append({
        "input": "[2,7,11,15], 9",
        "expected": "[0,1]",
        "output": str(output),
        "passed": passed
    })
except Exception as e:
    results.append({
        "input": "[2,7,11,15], 9",
        "expected": "[0,1]",
        "output": str(e),
        "passed": False
    })
try:
    output = func([3,2,4], 6)
    passed = str(output) == str("[1,2]")
    results.append({
        "input": "[3,2,4], 6",
        "expected": "[1,2]",
        "output": str(output),
        "passed": passed
    })
except Exception as e:
    results.append({
        "input": "[3,2,4], 6",
        "expected": "[1,2]",
        "output": str(e),
        "passed": False
    })
try:
    output = func([3,3], 6)
    passed = str(output) == str("[0,1]")
    results.append({
        "input": "[3,3], 6",
        "expected": "[0,1]",
        "output": str(output),
        "passed": passed
    })
except Exception as e:
    results.append({
        "input": "[3,3], 6",
        "expected": "[0,1]",
        "output": str(e),
        "passed": False
    })

print(json.dumps(results))
