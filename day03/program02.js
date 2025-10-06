function p2(nums) {
  let pos = [];
  let neg = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > 0) pos.push(nums[i]);
    else neg.push(nums[i]);
  }
  let res = [];
  let maxLen = Math.max(pos.length, neg.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < pos.length) res.push(pos[i]);
    if (i < neg.length) res.push(neg[i]);
  }
  return res;
}
console.log(p2([-3, 1, -2, -5, -2, -4]));
