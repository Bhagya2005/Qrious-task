function p3(nums) {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false; 
    if (i + nums[i] > maxReach) {
      maxReach = i + nums[i];
    }
  }
  return true;
}
console.log(p3([2, 3, 1, 1, 4]));
