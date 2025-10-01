
function task8(arr) {
    let result = [];
    function helper(subArr) {
        for (let item of subArr) {
            if (Array.isArray(item)) helper(item);
            else result.push(item);
        }
    }
    helper(arr);
    return result;
}

console.log(task8([1,2,[5,4],3,[5],[93,8,2]]));

// logic for inside another function and recursively call
//in this senario like we first take one empty array then I use another function inside task8 function so that like [1,2,[3,4],5]  so here another opration perform for [3,4]

