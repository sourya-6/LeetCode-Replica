def func(n):
  return n%2==0

import json
results = []
passed = 0
failed = 0

try:
    output = func(2)
    passed_case = str(output) == str(true)
    if passed_case:
        passed += 1
    else:
        failed += 1
    results.append({
        "input": "2",
        "expected": str(true),
        "output": str(output),
        "passed": passed_case
    })
except Exception as e:
    failed += 1
    results.append({
        "input": "2",
        "expected": str(true),
        "output": str(e),
        "passed": False
    })
try:
    output = func(3)
    passed_case = str(output) == str(false)
    if passed_case:
        passed += 1
    else:
        failed += 1
    results.append({
        "input": "3",
        "expected": str(false),
        "output": str(output),
        "passed": passed_case
    })
except Exception as e:
    failed += 1
    results.append({
        "input": "3",
        "expected": str(false),
        "output": str(e),
        "passed": False
    })
try:
    output = func(10)
    passed_case = str(output) == str(true)
    if passed_case:
        passed += 1
    else:
        failed += 1
    results.append({
        "input": "10",
        "expected": str(true),
        "output": str(output),
        "passed": passed_case
    })
except Exception as e:
    failed += 1
    results.append({
        "input": "10",
        "expected": str(true),
        "output": str(e),
        "passed": False
    })

print(json.dumps({ "passedCount": passed, "failedCount": failed, "testResults": results }))
