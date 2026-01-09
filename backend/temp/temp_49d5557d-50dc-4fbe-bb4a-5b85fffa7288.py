def func(x):
  return x[::-1]

import json
results = []
passed = 0
failed = 0

try:
    output = func('hello')
 passed_case = repr(output) == repr("'olleh'")
    if passed_case:
        passed += 1
    else:
        failed += 1
    results.append({
        "input": "'hello'",
        "expected": repr("'olleh'"),
        "output": repr(output),
        "passed": passed_case
    })
except Exception as e:
    failed += 1
    results.append({
        "input": "'hello'",
        "expected": str("'olleh'"),
        "output": str(e),
        "passed": False
    })
try:
    output = func('abcd')
 passed_case = repr(output) == repr("'dcba'")
    if passed_case:
        passed += 1
    else:
        failed += 1
    results.append({
        "input": "'abcd'",
        "expected": repr("'dcba'"),
        "output": repr(output),
        "passed": passed_case
    })
except Exception as e:
    failed += 1
    results.append({
        "input": "'abcd'",
        "expected": str("'dcba'"),
        "output": str(e),
        "passed": False
    })
try:
    output = func('12345')
 passed_case = repr(output) == repr("'54321'")
    if passed_case:
        passed += 1
    else:
        failed += 1
    results.append({
        "input": "'12345'",
        "expected": repr("'54321'"),
        "output": repr(output),
        "passed": passed_case
    })
except Exception as e:
    failed += 1
    results.append({
        "input": "'12345'",
        "expected": str("'54321'"),
        "output": str(e),
        "passed": False
    })

print(json.dumps({ "passedCount": passed, "failedCount": failed, "testResults": results }))
