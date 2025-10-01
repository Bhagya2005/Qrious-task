//in this senario like we take two pointer first is i and second is j 
// now i in the first index and j in the last index of the array 
//start itetrate is i is vowel then stop j-- until j is vowel
//same case for j is vowel then i++ until i is vowel
// then interchange or wer can say that swap

function task03(s){
    let vowels = 'aeiouAEIOU';
    let arr = s.split('');
    let i = 0, j = arr.length - 1;
    while (i < j) {
        if (!vowels.includes(arr[i])) { i++; continue; }
        if (!vowels.includes(arr[j])) { j--; continue; }
        [arr[i], arr[j]] = [arr[j], arr[i]];
        i++; j--;
    }
    return arr.join('');
}


console.log(task03("hello"));
