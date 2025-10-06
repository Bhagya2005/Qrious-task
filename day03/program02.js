function p2(nums) {
  let pos = [];
  let neg = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > 0) pos.push(nums[i]);
    else neg.push(nums[i]);
  }
  let res = [];
  for (let i = 0; i < pos.length; i++) {
    res.push(pos[i]);
    res.push(neg[i]);
  }
  return res;
}
console.log(p2([3, 1, -2, -5, 2, -4])); 
