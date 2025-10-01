//in this senario  initially take variable i the apply for loop 
//and check i th element j th element 
//if it is not match then i++
//if thi senario if we initially i=0 then our ans is i+1
//if some senario we take value of i = 1 then our ans is i

function task01(nums) {
    let i = 0;
    for (let j = 1; j < nums.length; j++) {
        if (nums[i] !== nums[j]) {
            i++;
            nums[i] = nums[j];
        }
    }
    return i + 1;
}


console.log(task01([1, 1, 2]));


