x=input()
print(x[::-1])

import json
results = []
passed = 0
failed = 0

try:
    output = func('hello')
    passed_case = output == "'olleh'"
    if passed_case:
        passed += 1
    else:
        failed += 1
    results.append({
        "input": "'hello'",
        "expected": "'olleh'",
        "output": output,
        "passed": passed_case
    })
except Exception as e:
    failed += 1
    results.append({
        "input": "'hello'",
        "expected": "'olleh'",
        "output": str(e),
        "passed": False
    })
try:
    output = func('abcd')
    passed_case = output == "'dcba'"
    if passed_case:
        passed += 1
    else:
        failed += 1
    results.append({
        "input": "'abcd'",
        "expected": "'dcba'",
        "output": output,
        "passed": passed_case
    })
except Exception as e:
    failed += 1
    results.append({
        "input": "'abcd'",
        "expected": "'dcba'",
        "output": str(e),
        "passed": False
    })
try:
    output = func('12345')
    passed_case = output == "'54321'"
    if passed_case:
        passed += 1
    else:
        failed += 1
    results.append({
        "input": "'12345'",
        "expected": "'54321'",
        "output": output,
        "passed": passed_case
    })
except Exception as e:
    failed += 1
    results.append({
        "input": "'12345'",
        "expected": "'54321'",
        "output": str(e),
        "passed": False
    })

print(json.dumps({ "passedCount": passed, "failedCount": failed, "testResults": results }))
