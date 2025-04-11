
  def add(a, b):
 return a + b
  
  import json
  
  results = []
  
  try:
      output = add(1, 2)
      passed = str(output) == str("3")
      results.append({
          "input": "1, 2",
          "expected": "3",
          "output": str(output),
          "passed": passed
      })
  except Exception as e:
      results.append({
          "input": "1, 2",
          "expected": "3",
          "output": str(e),
          "passed": False
      })
  
  try:
      output = add(5, 7)
      passed = str(output) == str("12")
      results.append({
          "input": "5, 7",
          "expected": "12",
          "output": str(output),
          "passed": passed
      })
  except Exception as e:
      results.append({
          "input": "5, 7",
          "expected": "12",
          "output": str(e),
          "passed": False
      })
  
  print(json.dumps(results))
  