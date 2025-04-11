def is_even(n):
    return n % 2 == 0

import json

results = []

  try:
      output = is_even(2)
      passed = str(output) == str(true)
      results.append({
          "input": "2",
          "expected": true,
          "output": str(output),
          "passed": passed
      })
  except Exception as e:
      results.append({
          "input": "2",
          "expected": true,
          "output": str(e),
          "passed": False
      })

  try:
      output = is_even(3)
      passed = str(output) == str(false)
      results.append({
          "input": "3",
          "expected": false,
          "output": str(output),
          "passed": passed
      })
  except Exception as e:
      results.append({
          "input": "3",
          "expected": false,
          "output": str(e),
          "passed": False
      })

  try:
      output = is_even(10)
      passed = str(output) == str(true)
      results.append({
          "input": "10",
          "expected": true,
          "output": str(output),
          "passed": passed
      })
  except Exception as e:
      results.append({
          "input": "10",
          "expected": true,
          "output": str(e),
          "passed": False
      })

print(json.dumps(results))
