//***** I just share my approach to solve the problem *****
//** but in some senario that is not work properly **/


function task11(matrix) {
    if (!matrix.length) return 0;
    let cols = matrix[0].length;
    let heights = Array(cols).fill(0);
    let maxArea = 0;
    
    for (let row of matrix) {
        for (let j = 0; j < cols; j++) {
            heights[j] = row[j] === 0 ? 0 : heights[j] + 1;
        }
        maxArea = Math.max(maxArea, area(heights));
    }
    return maxArea;

    function area(heights) {
        let stack = [], max = 0;
        heights.push(0);
        for (let i = 0; i < heights.length; i++) {
            while (stack.length && heights[i] < heights[stack[stack.length - 1]]) {
                let h = heights[stack.pop()];
                let w = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
                max = Math.max(max, h * w);
            }
            stack.push(i);
        }
        heights.pop();   
        return max;
    }

}

