function twoSum(nums, target) {
  const map = new Map(); // number -> index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i]; // found the pair
    }
    map.set(nums[i], i);
  }

  return []; // no solution found
}

console.log([2,7,11,15], 9)