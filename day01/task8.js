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

