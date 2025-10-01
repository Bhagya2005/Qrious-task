function task6(x, y) {
    let xor = x ^ y;
    let count = 0;
    while (xor > 0) {
        count += xor & 1;
        xor >>= 1;
    }
    return count;
}
console.log(task6(1, 4));

//first of all initialized a variable xor to store the result of the bitwise XOR operation between x and y.
//Then, initialized a counter variable count to keep track of the number of differing bits.Next, used a while loop to iterate as long as xor is greater than 0.
//Inside the loop, used the bitwise AND operation (xor & 1) to check if the least significant bit of xor is 1. If it is, incremented the count by 1.
//Then, right-shifted xor by 1 bit using the right shift operator (>>=) to process the next bit in the next iteration.
